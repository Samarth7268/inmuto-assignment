import { useEffect, useState } from "react";
import { fetchTasks } from "../api/tasks";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((err) => {
        console.error("TASK LOAD ERROR:", err);
        setError("Failed to load tasks");
      });
  }, []);

  return { tasks, error };
};
