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
import { useStore, type CustomNode, type CustomNodeData } from './store';
import { useShallow } from 'zustand/shallow';
import { nodeTypes } from './nodes/nodeTypes';

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
    selectedNodeId,
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
      selectedNodeId: state.selectedNodeId,
    }))
  );

  // Handle keyboard delete
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNodeId) {
        // Prevent deletion when typing in inputs
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }
        event.preventDefault();
        deleteSelectedNode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNodeId, deleteSelectedNode]);

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

  return (
    <div ref={reactFlowWrapper} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
