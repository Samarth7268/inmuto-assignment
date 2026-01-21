import { useEffect, useState } from "react";
import api from "../api/axios";

export function useGraph() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/tasks/graph/")
      .then((res) => {
        setNodes(res.data.nodes);
        setEdges(res.data.edges);
        setLoading(false);
      })
      .catch((err) => {
        console.error("GRAPH LOAD ERROR:", err);
        setError("Failed to load graph");
        setLoading(false);
      });
  }, []);

  return { nodes, edges, loading, error };
}
