import { useState } from "react";
import { updateTaskStatus, deleteTask, addTaskDependency } from "../api/tasks";
import StatusBadge from "./StatusBadge";
import DependencySelector from "./DependencySelector";
import ConfirmModal from "./ConfirmModal";

const STATUSES = [
  "pending",
  "in_progress",
  "completed",
  "blocked",
];

export default function TaskItem({ task, tasks, onChange }) {
  const [showDependencies, setShowDependencies] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await updateTaskStatus(task.id, newStatus);
      onChange();
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTask(task.id);
      onChange();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to delete task");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleAddDependency = async (dependsOnId) => {
    try {
      await addTaskDependency(task.id, dependsOnId);
      onChange();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to add dependency");
    }
  };

  const dependencies = tasks.filter(t => 
    task.dependencies?.some(d => d.depends_on.id === t.id)
  );

  const dependents = tasks.filter(t =>
    t.dependencies?.some(d => d.depends_on.id === task.id)
  );

  return (
    <div className="border rounded p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={task.status} />
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-500 hover:text-red-700"
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={loading || task.status === "blocked"}
          className="border px-2 py-1 rounded text-sm"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setShowDependencies(!showDependencies)}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          {showDependencies ? "Hide" : "Show"} Dependencies
        </button>

        {showDependencies && (
          <div className="space-y-2 pl-4 border-l-2 border-gray-200">
            <div>
              <h4 className="text-sm font-medium">Depends on:</h4>
              {dependencies.length > 0 ? (
                <ul className="text-sm text-gray-600">
                  {dependencies.map(dep => (
                    <li key={dep.id}>• {dep.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No dependencies</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium">Blocking:</h4>
              {dependents.length > 0 ? (
                <ul className="text-sm text-gray-600">
                  {dependents.map(dep => (
                    <li key={dep.id}>• {dep.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Not blocking any tasks</p>
              )}
            </div>

            <DependencySelector
              task={task}
              tasks={tasks}
              onChange={onChange}
            />
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? ${dependents.length > 0 ? `This will remove dependencies from ${dependents.length} other task(s).` : ""}`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
