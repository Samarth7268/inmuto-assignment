from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError

from .models import Task, TaskDependency
from .serializers import TaskSerializer
from .services.dependency_graph import build_dependency_graph, detect_cycle
from .services.status_updater import cascade_update, update_task_status


class TaskListCreateView(APIView):
    def get(self, request):
        tasks = Task.objects.prefetch_related('dependencies__depends_on').all()
        return Response(TaskSerializer(tasks, many=True).data)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()
        return Response(TaskSerializer(task).data, status=201)


class TaskUpdateDeleteView(APIView):
    def patch(self, request, task_id):
        task = Task.objects.get(id=task_id)
        old_status = task.status
        serializer = TaskSerializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()

        # If status changed, update all tasks that depend on this task
        if task.status != old_status:
            cascade_update(task)

        return Response(TaskSerializer(task).data)

    def delete(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=404)

        dependents = TaskDependency.objects.filter(depends_on=task)
        
        # Delete all dependencies involving this task
        TaskDependency.objects.filter(task=task).delete()
        TaskDependency.objects.filter(depends_on=task).delete()
        
        # Update status of tasks that depended on this task
        for dep in dependents:
            update_task_status(dep.task)
        
        task.delete()
        return Response(status=204)


class TaskDependencyView(APIView):
    def post(self, request, task_id):
        depends_on_id = request.data.get("depends_on_id")

        if task_id == depends_on_id:
            return Response({"error": "Task cannot depend on itself"}, status=400)

        cycle = detect_cycle(task_id, depends_on_id)
        if cycle:
            return Response(
                {"error": "Circular dependency detected"},
                status=400,
            )

        try:
            TaskDependency.objects.create(
                task_id=task_id, depends_on_id=depends_on_id
            )
        except IntegrityError:
            return Response(
                {"error": "Dependency already exists"},
                status=400,
            )

        update_task_status(Task.objects.get(id=task_id))
        return Response(status=201)


class DependencyGraphView(APIView):
    def get(self, request):
        return Response(build_dependency_graph())
