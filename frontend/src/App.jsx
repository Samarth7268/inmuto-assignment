import { useState } from "react";
import TaskList from "./components/TaskList";
import GraphCanvas from "./graph/GraphCanvas";

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Task Dependency Manager
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Tasks</h2>
            <TaskList key={`tasks-${refreshKey}`} onRefresh={handleRefresh} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Dependency Graph</h2>
            <GraphCanvas refreshTrigger={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}
