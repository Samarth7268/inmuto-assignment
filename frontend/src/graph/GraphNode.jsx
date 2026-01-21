const STATUS_COLORS = {
  pending: "#9CA3AF",
  in_progress: "#3B82F6",
  completed: "#10B981",
  blocked: "#EF4444",
};

export default function GraphNode({ node, isHighlighted, onClick }) {
  const color = STATUS_COLORS[node.status] || "#9CA3AF";

  return (
    <g
      className="cursor-pointer"
      onClick={() => onClick(node)}
      style={{ filter: isHighlighted ? "brightness(1.2)" : "none" }}
    >
      <rect
        x={node.x - 60}
        y={node.y - 30}
        width={120}
        height={60}
        fill={color}
        stroke="#000"
        strokeWidth={2}
        rx={8}
      />
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
        className="pointer-events-none"
      >
        {node.title.length > 15 ? node.title.substring(0, 15) + "..." : node.title}
      </text>
    </g>
  );
}