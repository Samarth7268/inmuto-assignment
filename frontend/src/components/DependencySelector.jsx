import { useState } from "react";
import { addTaskDependency } from "../api/tasks";

export default function DependencySelector({
  task,
  tasks,
  onChange,
}) {
  const [selected, setSelected] = useState("");

  const handleAdd = async () => {
    try {
      await addTaskDependency(task.id, Number(selected));
      onChange();
    } catch (err) {
      alert(
        err.response?.data?.error ||
        "Failed to add dependency"
      );
    }
  };

  return (
    <div>
      <select
        value={selected}
        onChange={e => setSelected(e.target.value)}
      >
        <option value="">Add dependency</option>
        {tasks
          .filter(t => t.id !== task.id)
          .map(t => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
      </select>
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
