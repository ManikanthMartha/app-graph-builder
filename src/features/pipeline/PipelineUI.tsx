import { useRef, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  SmoothStepEdge,
} from '@xyflow/react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertCircle } from 'lucide-react';
import { useStore, type CustomNode, type CustomNodeData } from '../../store';
import { useShallow } from 'zustand/shallow';
import { nodeTypes } from '../../nodes/nodeTypes';
import { fetchAppGraph } from '../../api/mockApi';

import '@xyflow/react/dist/style.css';

const gridSize = 15;
const proOptions = { hideAttribution: true };

const getInitNodeData = (nodeID: string, type: string): CustomNodeData => {
  return {
    id: nodeID,
    nodeType: type,
    label: `${type} Node`,
    status: 'healthy',
  };
};

const PipelineUIInner = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { fitView, screenToFlowPosition } = useReactFlow();

  // Use useShallow to prevent infinite re-renders
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteSelectedNode,
    deleteEdge,
    setSelectedEdgeId,
    setNodes,
    setEdges,
    selectedAppId,
    selectedNodeId,
    selectedEdgeId,
  } = useStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      getNodeID: state.getNodeID,
      addNode: state.addNode,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      deleteSelectedNode: state.deleteSelectedNode,
      deleteEdge: state.deleteEdge,
      setSelectedEdgeId: state.setSelectedEdgeId,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
      selectedAppId: state.selectedAppId,
      selectedNodeId: state.selectedNodeId,
      selectedEdgeId: state.selectedEdgeId,
    }))
  );

  // Fetch graph data when selectedAppId changes
  const {
    data: graphData,
    isLoading: isGraphLoading,
    isError: isGraphError,
    error: graphError,
    refetch: refetchGraph,
  } = useQuery({
    queryKey: ['appGraph', selectedAppId],
    queryFn: () => fetchAppGraph(selectedAppId!),
    enabled: !!selectedAppId,
    staleTime: 5 * 60 * 1000,
  });

  // Update store when graph data changes
  useEffect(() => {
    if (graphData) {
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
    }
  }, [graphData, setNodes, setEdges]);

  // Clear graph when no app is selected
  useEffect(() => {
    if (!selectedAppId) {
      setNodes([]);
      setEdges([]);
    }
  }, [selectedAppId, setNodes, setEdges]);

  // Handle keyboard delete
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // Prevent deletion when typing in inputs
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }
        event.preventDefault();
        
        if (selectedNodeId) {
          deleteSelectedNode();
        } else if (selectedEdgeId) {
          deleteEdge(selectedEdgeId);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNodeId, selectedEdgeId, deleteSelectedNode, deleteEdge]);

  // Fit view on initial load when nodes are present
  const hasNodes = nodes.length > 0;
  useEffect(() => {
    if (hasNodes) {
      setTimeout(() => fitView({ padding: 1.25 }), 100);
    }
  }, [hasNodes, fitView]);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const dataString = event.dataTransfer.getData('application/@xyflow/react');
      if (dataString) {
        const appData = JSON.parse(dataString) as { nodeType?: string };
        const type = appData?.nodeType;

        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const nodeID = getNodeID(type);
        const newNode: CustomNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [addNode, getNodeID, screenToFlowPosition]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Loading state
  if (isGraphLoading && selectedAppId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#141414]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-neutral-400 text-sm">Loading graph...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isGraphError && selectedAppId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#141414]">
        <div className="flex flex-col items-center gap-3 max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="text-red-400 text-sm">
            {graphError instanceof Error ? graphError.message : 'Failed to load graph'}
          </p>
          <button
            onClick={() => refetchGraph()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm text-white transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Empty state - no app selected
  if (!selectedAppId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#141414]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <p className="text-neutral-400 text-sm">Select an app to view its graph</p>
          <p className="text-neutral-600 text-xs">Use the dropdown above to choose an app</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={reactFlowWrapper} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={(event, edge) => {
          event.stopPropagation();
          setSelectedEdgeId(edge.id);
        }}
        onPaneClick={() => {
          setSelectedEdgeId(null);
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        edgeTypes={{ smoothstep: SmoothStepEdge }}
        deleteKeyCode={null} // We handle delete manually
        defaultEdgeOptions={{
          style: {
            stroke: '#6366e9',
            strokeWidth: 3,
          },
          animated: true,
        }}
        fitView
      >
        <Background bgColor="#141414" gap={gridSize} variant={BackgroundVariant.Dots} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export const PipelineUI = () => {
  return (
    <ReactFlowProvider>
      <PipelineUIInner />
    </ReactFlowProvider>
  );
};
