from collections import defaultdict
from ..models import Task, TaskDependency


def build_dependency_graph():
    nodes = []
    edges = []

    for task in Task.objects.all():
        nodes.append({
            "id": task.id,
            "title": task.title,
            "status": task.status,
        })

    for dep in TaskDependency.objects.all():
        edges.append({
            "from": dep.task_id,
            "to": dep.depends_on_id,
        })

    return {"nodes": nodes, "edges": edges}


def detect_cycle(task_id, depends_on_id):
    # Check if adding task -> depends_on would create a cycle
    # This happens if there's already a path from depends_on to task in the dependency graph
    
    graph = defaultdict(list)
    for dep in TaskDependency.objects.all():
        graph[dep.task_id].append(dep.depends_on_id)  # dependent -> dependency
    
    # DFS to see if we can reach task_id from depends_on_id
    visited = set()
    
    def dfs(node):
        if node == task_id:
            return True
        visited.add(node)
        
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                if dfs(neighbor):
                    return True
        
        return False
    
    return dfs(depends_on_id)
