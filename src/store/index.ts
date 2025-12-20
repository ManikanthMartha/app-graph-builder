import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';

// ============ Types ============

export type NodeStatus = 'healthy' | 'degraded' | 'down';

export interface CustomNodeData extends Record<string, unknown> {
  id: string;
  nodeType: string;
  label?: string;
  description?: string;
  status?: NodeStatus;
  // Resource values
  cpu?: number;
  memory?: number;
  disk?: number;
  region?: string;
  [key: string]: unknown;
}

export type CustomNode = Node<CustomNodeData>;
export type CustomEdge = Edge;

export type InspectorTab = 'config' | 'runtime';

// UI State - for non-server state
interface UIState {
  selectedAppId: string | null;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: InspectorTab;
}

// ReactFlow State - for graph state
interface ReactFlowState {
  nodes: CustomNode[];
  edges: CustomEdge[];
  nodeIDs: Record<string, number>;
}

// Actions
interface UIActions {
  setSelectedAppId: (appId: string | null) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setSelectedEdgeId: (edgeId: string | null) => void;
  setMobilePanelOpen: (isOpen: boolean) => void;
  toggleMobilePanel: () => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
}

interface ReactFlowActions {
  getNodeID: (type: string) => string;
  addNode: (node: CustomNode) => void;
  onNodesChange: OnNodesChange<CustomNode>;
  onEdgesChange: OnEdgesChange<CustomEdge>;
  onConnect: OnConnect;
  updateNodeField: (nodeId: string, fieldName: string, fieldValue: unknown) => void;
  setNodes: (nodes: CustomNode[]) => void;
  setEdges: (edges: CustomEdge[]) => void;
  deleteSelectedNode: () => void;
  deleteEdge: (edgeId: string) => void;
  clearGraph: () => void;
}

// Selectors (derived state)
interface Selectors {
  getSelectedNode: () => CustomNode | undefined;
}

// Combined Store Type
export type AppStore = UIState & ReactFlowState & UIActions & ReactFlowActions & Selectors;

// ============ Store ============

export const useStore = create<AppStore>((set, get) => ({
  // -------- UI State --------
  selectedAppId: null,
  selectedNodeId: null,
  selectedEdgeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'config',

  // -------- ReactFlow State --------
  nodes: [],
  edges: [],
  nodeIDs: {},

  // -------- UI Actions --------
  setSelectedAppId: (appId) => {
    set({ selectedAppId: appId, selectedNodeId: null });
  },

  setSelectedNodeId: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  setSelectedEdgeId: (edgeId) => {
    set({ selectedEdgeId: edgeId });
  },

  setMobilePanelOpen: (isOpen) => {
    set({ isMobilePanelOpen: isOpen });
  },

  toggleMobilePanel: () => {
    set((state) => ({ isMobilePanelOpen: !state.isMobilePanelOpen }));
  },

  setActiveInspectorTab: (tab) => {
    set({ activeInspectorTab: tab });
  },

  // -------- ReactFlow Actions --------
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  onNodesChange: (changes: NodeChange<CustomNode>[]) => {
    // Handle selection changes to update selectedNodeId
    const selectionChange = changes.find(
      (change) => change.type === 'select' && 'selected' in change
    );
    
    if (selectionChange && selectionChange.type === 'select') {
      if (selectionChange.selected) {
        set({ selectedNodeId: selectionChange.id });
      } else if (get().selectedNodeId === selectionChange.id) {
        set({ selectedNodeId: null });
      }
    }

    // Handle node removal
    const removeChanges = changes.filter((change) => change.type === 'remove');
    if (removeChanges.length > 0) {
      const removedIds = removeChanges.map((change) => change.id);
      if (get().selectedNodeId && removedIds.includes(get().selectedNodeId!)) {
        set({ selectedNodeId: null });
      }
    }

    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange<CustomEdge>[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.Arrow, height: 12, width: 12 },
        },
        get().edges
      ),
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, [fieldName]: fieldValue },
          };
        }
        return node;
      }),
    });
  },

  setNodes: (nodes) => {
    set({ nodes, selectedNodeId: null });
  },

  setEdges: (edges) => {
    set({ edges });
  },

  deleteSelectedNode: () => {
    const { selectedNodeId, nodes, edges } = get();
    if (!selectedNodeId) return;

    set({
      nodes: nodes.filter((node) => node.id !== selectedNodeId),
      edges: edges.filter(
        (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId
      ),
      selectedNodeId: null,
    });
  },

  deleteEdge: (edgeId) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
    });
  },

  clearGraph: () => {
    set({ nodes: [], edges: [], selectedNodeId: null, nodeIDs: {} });
  },

  // -------- Selectors --------
  getSelectedNode: () => {
    const { nodes, selectedNodeId } = get();
    return nodes.find((node) => node.id === selectedNodeId);
  },
}));

// ============ Selector Hooks ============
// Use these for optimized re-renders

export const useSelectedAppId = () => useStore((state) => state.selectedAppId);
export const useSelectedNodeId = () => useStore((state) => state.selectedNodeId);
export const useIsMobilePanelOpen = () => useStore((state) => state.isMobilePanelOpen);
export const useActiveInspectorTab = () => useStore((state) => state.activeInspectorTab);

export const useNodes = () => useStore((state) => state.nodes);
export const useEdges = () => useStore((state) => state.edges);

export const useSelectedNode = () => {
  const nodes = useStore((state) => state.nodes);
  const selectedNodeId = useStore((state) => state.selectedNodeId);
  return nodes.find((node) => node.id === selectedNodeId);
};

