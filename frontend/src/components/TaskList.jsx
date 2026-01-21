import { useState, useEffect } from "react";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import { fetchTasks } from "../api/tasks";

export default function TaskList({ onRefresh }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error("TASK LOAD ERROR:", err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleChange = () => {
    loadTasks();
    if (onRefresh) onRefresh();
  };

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-8">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <TaskForm onTaskCreated={handleChange} />

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tasks yet. Create your first task above.
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              tasks={tasks}
              onChange={handleChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
