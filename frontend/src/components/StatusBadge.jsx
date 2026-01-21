const STATUS_COLORS = {
  pending: "bg-gray-200 text-gray-800",
  in_progress: "bg-blue-200 text-blue-800",
  completed: "bg-green-200 text-green-800",
  blocked: "bg-red-200 text-red-800",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded text-sm font-medium ${STATUS_COLORS[status] || "bg-gray-200"}`}>
      {status.replace("_", " ")}
    </span>
  );
}