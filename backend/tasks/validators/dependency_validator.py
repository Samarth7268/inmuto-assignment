from tasks.models import TaskDependency
from tasks.services.dependency_graph import build_graph, detect_cycle

def check_circular_dependency(task_id, depends_on_id):
    dependencies = TaskDependency.objects.values_list(
        "task_id", "depends_on_id"
    )

    graph = build_graph(dependencies)
    graph[task_id].append(depends_on_id)

    cycle = detect_cycle(graph, task_id)
    return cycle
