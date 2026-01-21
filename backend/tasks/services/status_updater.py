from ..models import Task, TaskDependency


def update_task_status(task: Task):
    deps = TaskDependency.objects.filter(task=task).select_related("depends_on")

    if not deps.exists():
        # No dependencies, don't change status
        return

    statuses = [d.depends_on.status for d in deps]

    new_status = None
    if "blocked" in statuses:
        new_status = "blocked"
    elif all(s == "completed" for s in statuses):
        new_status = "in_progress"
    else:
        # Some dependencies not completed
        new_status = "pending"

    if new_status and new_status != task.status:
        task.status = new_status
        task.save()
        # Cascade update to tasks that depend on this task
        cascade_update(task)


def cascade_update(task: Task):
    dependents = TaskDependency.objects.filter(depends_on=task).select_related("task")

    for dep in dependents:
        update_task_status(dep.task)
