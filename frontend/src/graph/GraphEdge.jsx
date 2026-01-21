export default function GraphEdge({ edge, nodes, isHighlighted }) {
  const fromNode = nodes.find(n => n.id === edge.from);
  const toNode = nodes.find(n => n.id === edge.to);

  if (!fromNode || !toNode) return null;

  // Calculate arrow points
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const angle = Math.atan2(dy, dx);

  const arrowLength = 10;
  const arrowAngle = Math.PI / 6; // 30 degrees

  const arrowX = toNode.x - 60 * Math.cos(angle);
  const arrowY = toNode.y - 30 * Math.sin(angle);

  const leftX = arrowX - arrowLength * Math.cos(angle - arrowAngle);
  const leftY = arrowY - arrowLength * Math.sin(angle - arrowAngle);
  const rightX = arrowX - arrowLength * Math.cos(angle + arrowAngle);
  const rightY = arrowY - arrowLength * Math.sin(angle + arrowAngle);

  return (
    <g>
      <line
        x1={fromNode.x}
        y1={fromNode.y}
        x2={arrowX}
        y2={arrowY}
        stroke={isHighlighted ? "#FF6B6B" : "#666"}
        strokeWidth={isHighlighted ? 3 : 2}
        markerEnd="url(#arrowhead)"
      />
      <polygon
        points={`${arrowX},${arrowY} ${leftX},${leftY} ${rightX},${rightY}`}
        fill={isHighlighted ? "#FF6B6B" : "#666"}
      />
    </g>
  );
}