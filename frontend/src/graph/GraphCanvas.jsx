import { useEffect, useState, useRef } from "react";
import { fetchGraph } from "../api/tasks";
import { computeLayout } from "./layout";
import GraphNode from "./GraphNode";
import GraphEdge from "./GraphEdge";

export default function GraphCanvas({ refreshTrigger }) {
  const [graph, setGraph] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  useEffect(() => {
    loadGraph();
  }, [refreshTrigger]);

  const loadGraph = async () => {
    try {
      const data = await fetchGraph();
      const nodesWithPositions = computeLayout(data.nodes, data.edges);
      setGraph({ ...data, nodes: nodesWithPositions });
    } catch (error) {
      console.error("Failed to load graph:", error);
    }
  };

  const handleNodeClick = (node) => {
    setHighlightedNode(highlightedNode?.id === node.id ? null : node);
  };

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    handleZoom(e.deltaY > 0 ? -0.1 : 0.1);
  };

  if (!graph) {
    return (
      <div className="border rounded p-8 text-center text-gray-500">
        Loading graph...
      </div>
    );
  }

  if (graph.nodes.length === 0) {
    return (
      <div className="border rounded p-8 text-center text-gray-500">
        No tasks to display. Create some tasks first.
      </div>
    );
  }

  // Calculate bounds
  const padding = 50;
  const minX = Math.min(...graph.nodes.map(n => n.x - 60)) - padding;
  const maxX = Math.max(...graph.nodes.map(n => n.x + 60)) + padding;
  const minY = Math.min(...graph.nodes.map(n => n.y - 30)) - padding;
  const maxY = Math.max(...graph.nodes.map(n => n.y + 30)) + padding;

  const width = maxX - minX;
  const height = maxY - minY;

  // Get highlighted edges
  const highlightedEdges = highlightedNode ? [
    ...graph.edges.filter(e => e.from === highlightedNode.id),
    ...graph.edges.filter(e => e.to === highlightedNode.id)
  ] : [];

  return (
    <div className="border rounded bg-white overflow-hidden">
      <div className="p-2 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {graph.nodes.length} tasks, {graph.edges.length} dependencies
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleZoom(0.2)}
            className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            +
          </button>
          <button
            onClick={() => handleZoom(-0.2)}
            className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            -
          </button>
          <button
            onClick={() => setZoom(1)}
            className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="overflow-auto" style={{ height: "600px" }}>
        <svg
          ref={svgRef}
          width={width * zoom}
          height={height * zoom}
          viewBox={`${minX} ${minY} ${width} ${height}`}
          onWheel={handleWheel}
          className="block"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#666"
              />
            </marker>
          </defs>

          {graph.edges.map((edge, index) => (
            <GraphEdge
              key={index}
              edge={edge}
              nodes={graph.nodes}
              isHighlighted={highlightedEdges.some(he => he.from === edge.from && he.to === edge.to)}
            />
          ))}

          {graph.nodes.map((node) => (
            <GraphNode
              key={node.id}
              node={node}
              isHighlighted={highlightedNode?.id === node.id}
              onClick={handleNodeClick}
            />
          ))}
        </svg>
      </div>

      {highlightedNode && (
        <div className="p-2 bg-blue-50 border-t">
          <div className="text-sm">
            <strong>{highlightedNode.title}</strong> - {highlightedNode.status.replace("_", " ")}
          </div>
        </div>
      )}
    </div>
  );
}
