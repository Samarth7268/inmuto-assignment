// Simple hierarchical layout for dependency graph
export function computeLayout(nodes, edges) {
  const nodeMap = new Map(nodes.map(n => [n.id, { ...n, x: 0, y: 0, level: 0 }]));
  const adjacencyList = new Map();
  const reverseAdjacencyList = new Map();

  // Build adjacency lists
  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
    reverseAdjacencyList.set(node.id, []);
  });

  edges.forEach(edge => {
    adjacencyList.get(edge.from).push(edge.to);
    reverseAdjacencyList.get(edge.to).push(edge.from);
  });

  // Calculate levels (topological sort)
  const visited = new Set();
  const temp = new Set();

  function assignLevel(nodeId, level = 0) {
    if (temp.has(nodeId)) return; // Cycle detected, but we'll handle it
    if (visited.has(nodeId)) return;

    temp.add(nodeId);
    const node = nodeMap.get(nodeId);
    node.level = Math.max(node.level, level);

    // Process dependencies (what this node depends on)
    adjacencyList.get(nodeId).forEach(depId => {
      assignLevel(depId, level + 1);
    });

    temp.delete(nodeId);
    visited.add(nodeId);
  }

  // Start from nodes with no dependencies
  nodes.forEach(node => {
    if (reverseAdjacencyList.get(node.id).length === 0) {
      assignLevel(node.id);
    }
  });

  // Handle any remaining nodes (cycles)
  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      assignLevel(node.id);
    }
  });

  // Group nodes by level
  const levels = new Map();
  nodeMap.forEach(node => {
    if (!levels.has(node.level)) {
      levels.set(node.level, []);
    }
    levels.get(node.level).push(node);
  });

  // Assign positions
  const levelHeight = 100;
  const nodeWidth = 120;
  const nodeHeight = 60;

  levels.forEach((levelNodes, level) => {
    const levelWidth = levelNodes.length * (nodeWidth + 20);
    const startX = -levelWidth / 2;

    levelNodes.forEach((node, index) => {
      node.x = startX + index * (nodeWidth + 20) + nodeWidth / 2;
      node.y = level * levelHeight + nodeHeight / 2;
    });
  });

  return Array.from(nodeMap.values());
}