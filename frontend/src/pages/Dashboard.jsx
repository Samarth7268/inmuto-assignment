import GraphCanvas from "../graph/GraphCanvas";
import { useTasks } from "../hooks/useTasks";

export default function Dashboard() {
  const { tasks } = useTasks();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tasks</h1>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border p-3 rounded flex justify-between"
          >
            <span>{task.title}</span>
            <span>{task.status}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold">Dependency Graph</h2>
      <GraphCanvas />
    </div>
  );
}
