# Technical Decisions - Task Dependency Management System

## Circular Dependency Detection Algorithm

### Problem Statement
The system needed to detect and prevent circular dependencies in task relationships. A circular dependency occurs when tasks form a cycle (e.g., A → B → C → A), which would create infinite loops in status updates and logical inconsistencies.

### Algorithm Choice: Depth-First Search (DFS)

#### Why DFS?
- **Efficiency**: O(V + E) time complexity where V is vertices (tasks) and E is edges (dependencies)
- **Memory Efficient**: Uses O(V) space for the recursion stack
- **Detects Cycles**: Can identify cycles during traversal
- **Simple Implementation**: Straightforward to implement and understand

#### Alternative Approaches Considered

1. **Topological Sort (Kahn's Algorithm)**
   - Pros: Can detect cycles and provide topological ordering
   - Cons: Requires maintaining indegree counts, more complex for dynamic additions

2. **Union-Find (Disjoint Set)**
   - Pros: Very fast for cycle detection (near O(1) amortized)
   - Cons: Doesn't provide cycle path information, harder to implement cycle prevention

3. **Floyd-Warshall**
   - Pros: Finds all-pairs shortest paths and can detect cycles
   - Cons: O(V³) complexity, too slow for real-time validation

#### DFS Implementation Details

```python
def detect_cycle(task_id, depends_on_id):
    # Build dependency graph: dependent -> dependency
    graph = defaultdict(list)
    for dep in TaskDependency.objects.all():
        graph[dep.task_id].append(dep.depends_on_id)
    
    # DFS to check if depends_on_id can reach task_id
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
```

#### How It Works

1. **Graph Construction**: Build adjacency list where each task points to its dependencies
2. **Traversal**: Start DFS from the potential dependency (`depends_on_id`)
3. **Cycle Detection**: If we can reach the dependent task (`task_id`) during traversal, a cycle exists
4. **Prevention**: Block the dependency creation if cycle is detected

#### Example
```
Tasks: A → B → C (A depends on B, B depends on C)

Adding C → A:
- Start DFS from A
- Traverse A → B → C
- Reach C from A? Yes → Cycle detected ✅

Adding A → C:
- Start DFS from C  
- Traverse C → ? (no dependencies)
- Reach A from C? No → No cycle ✅
```

#### Edge Cases Handled

- **Self-Dependency**: `task_id == depends_on_id` → Immediate rejection
- **Empty Graph**: No existing dependencies → Allow any valid dependency
- **Multiple Paths**: Algorithm correctly handles graphs with multiple paths
- **Disconnected Components**: Only checks reachability in relevant subgraph

#### Performance Considerations

- **Database Queries**: Single query to fetch all dependencies
- **Real-time Validation**: Fast enough for interactive UI (microseconds for typical task counts)
- **Scalability**: Performs well up to thousands of tasks and dependencies

#### Why This Approach Won

DFS provides the perfect balance of simplicity, performance, and correctness for this use case. It gives immediate feedback to users while preventing logical inconsistencies in the dependency graph.

## Other Technical Decisions

### Database Choice: SQLite vs MySQL
- **Development**: SQLite for simplicity and zero configuration
- **Production**: Easily configurable to MySQL/PostgreSQL via Django settings

### State Management: Custom Hooks vs Redux
- **Frontend**: Custom React hooks for state management
- **Rationale**: Simpler than Redux for this scope, better performance, easier testing

### Graph Visualization: Custom SVG vs Libraries
- **Custom Implementation**: HTML5 Canvas/SVG with manual layout
- **Rationale**: No external dependencies, full control, better performance, meets requirements

### API Design: RESTful with Django REST Framework
- **Consistency**: Standard REST patterns
- **Validation**: Built-in serializers with custom validation
- **Error Handling**: Structured error responses

### Status Update Cascade: Recursive Implementation
- **Automatic Propagation**: Status changes cascade through dependency chains
- **Prevention of Infinite Loops**: DAG structure (no cycles) ensures termination
- **Performance**: Minimal database queries with select_related optimization