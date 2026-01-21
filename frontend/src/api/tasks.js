import api from "./axios";

export const fetchTasks = () => api.get("tasks/").then(r => r.data);
export const createTask = (data) => api.post("tasks/", data);
export const updateTaskStatus = (id, status) =>
  api.patch(`tasks/${id}/`, { status });
export const deleteTask = (id) => api.delete(`tasks/${id}/`);
export const addTaskDependency = (id, dependsOnId) =>
  api.post(`tasks/${id}/dependencies/`, { depends_on_id: dependsOnId });
export const fetchGraph = () => api.get("tasks/graph/").then(r => r.data);
