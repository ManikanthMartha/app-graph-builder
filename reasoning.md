# Reasoning & Technical Decisions

This document explains the architectural decisions, implementation approach, and trade-offs made while building the App Graph Builder.

---

## Project Overview

App Graph Builder is a visual tool for designing application infrastructure graphs. Users can:
- Select from multiple pre-configured apps
- View and edit node-based graphs representing services/infrastructure
- Drag new nodes from a toolbar
- Connect nodes with edges
- Create new empty graphs

The goal was to build a functional prototype demonstrating React Flow integration, state management patterns, and async data fetching—all within a clean, organized codebase.

---

##  Architecture Decisions

### 1. **React Flow for Graph Visualization**

**Choice:** [@xyflow/react](https://reactflow.dev/) (React Flow v12)

**Why:**
- Industry-standard library for node-based editors
- Excellent TypeScript support
- Built-in features: zooming, panning, minimap, controls
- Handles complex edge routing (smoothstep edges)
- Active maintenance and large community

**Trade-off:** Adds ~100KB to bundle size, but the functionality would take weeks to build from scratch.

---

### 2. **Zustand for Client State**

**Choice:** [Zustand](https://zustand-demo.pmnd.rs/) v5

**Why:**
- Minimal boilerplate compared to Redux
- No providers needed (though we use one for React Flow)
- Built-in TypeScript inference
- Shallow comparison utilities (`useShallow`) prevent infinite re-renders
- Easy to split state into logical sections

**Implementation Details:**
```typescript
// Store is organized into sections:
- UI State (selectedAppId, selectedNodeId, selectedEdgeId)
- ReactFlow State (nodes, edges, nodeIDs)
- UI Actions (setSelectedAppId, setSelectedNodeId, etc.)
- ReactFlow Actions (addNode, onNodesChange, deleteEdge, etc.)
```

**Key Pattern:** Using `useShallow` wrapper when selecting multiple values to prevent object reference issues:
```typescript
const { nodes, edges } = useStore(
  useShallow((state) => ({
    nodes: state.nodes,
    edges: state.edges,
  }))
);
```

---

### 3. **TanStack Query for Server State**

**Choice:** [@tanstack/react-query](https://tanstack.com/query) v5

**Why:**
- Separates server state from client state
- Built-in caching (5-minute stale time configured)
- Automatic refetching on app change
- Loading/error states out of the box
- Easy to swap mock API for real backend later

**Implementation:**
- `useQuery` for fetching apps list and graph data
- `useMutation` for creating new apps
- Query invalidation after mutations

---

### 4. **Mock API Design**

**Approach:** In-memory data with `setTimeout` delays

**Why:**
- Simulates real-world latency (300-1000ms)
- Tests loading/error UI states
- No backend setup required
- Easy to toggle error simulation

**Endpoints Mocked:**
| Endpoint | Description |
|----------|-------------|
| `GET /apps` | Returns list of 4 pre-configured apps |
| `GET /apps/:id/graph` | Returns nodes + edges for an app |
<!-- | `POST /apps` | Creates new app with empty graph |
| `PUT /apps/:id/graph` | Saves graph (prepared for future use) | -->

**Error Simulation:** Toggle available to randomly fail requests for testing error states.

---

### 5. **Folder Structure**

**Approach:** Feature-based organization

```
src/
├── api/              # Data fetching layer
├── components/       # Shared, reusable components
│   ├── draggable/    # Drag-and-drop functionality
│   ├── layout/       # App-level layout (Toolbar, AppSelector)
│   └── ui/           # Primitive components (Button, Input)
├── features/         # Feature modules (self-contained)
│   └── pipeline/     # The main graph editor
├── icons/            # SVG icon components
├── nodes/            # React Flow node definitions
├── store/            # Zustand store
└── styles/           # Global CSS
```

**Why This Structure:**
- Scalable as features grow
- Clear separation of concerns
- Easy to find related files
- `features/` could be split into micro-frontends later

---

### 6. **Node System Design**

**Pattern:** Configuration-driven node factory

```typescript
// nodeConfigs.ts - Single source of truth
export const NODE_CONFIGS = [
  { type: 'github', label: 'GitHub', ... },
  { type: 'docker', label: 'Docker', ... },
  // ...
];

// NodeFactory.tsx - Generates components from config
// nodeTypes.ts - Exports map for React Flow
```

**Why:**
- Add new node types by adding config, not code
- Consistent node appearance and behavior
- Easy to extend with new properties
- Toolbar automatically picks up new node types

---


## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                              │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ QueryClient     │  │ AppSelector     │                  │
│  │ Provider        │  │ (TanStack Query)│                  │
│  └─────────────────┘  └────────┬────────┘                  │
│                                │ selectedAppId              │
│                                ▼                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Zustand Store                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │ UI State    │  │ Graph State │  │ Actions     │  │   │
│  │  │ selectedApp │  │ nodes[]     │  │ addNode()   │  │   │
│  │  │ selectedNode│  │ edges[]     │  │ deleteEdge()│  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                │                            │
│                                ▼                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              PipelineUI (React Flow)                 │   │
│  │  - Renders nodes and edges                          │   │
│  │  - Handles drag/drop                                │   │
│  │  - Manages connections                              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Implementation Details

### Keyboard Delete Handling

Custom implementation instead of React Flow's built-in:
```typescript
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      // Skip if typing in input
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      
      if (selectedNodeId) deleteSelectedNode();
      else if (selectedEdgeId) deleteEdge(selectedEdgeId);
    }
  };
  // ...
}, [selectedNodeId, selectedEdgeId]);
```



### Edge Selection

Edges can be clicked to select, then deleted:
```typescript
onEdgeClick={(event, edge) => {
  event.stopPropagation();
  setSelectedEdgeId(edge.id);
}}
onPaneClick={() => setSelectedEdgeId(null)}
```

### Graph Loading on App Change

TanStack Query handles refetching when `selectedAppId` changes:
```typescript
const { data: graphData } = useQuery({
  queryKey: ['appGraph', selectedAppId],
  queryFn: () => fetchAppGraph(selectedAppId!),
  enabled: !!selectedAppId,
});

useEffect(() => {
  if (graphData) {
    setNodes(graphData.nodes);
    setEdges(graphData.edges);
  }
}, [graphData]);
```

---

## 🚧 Known Limitations & Future Work

### Current Limitations

1. **No Persistence**
   - All data is in-memory
   - Refresh loses everything
   - Fix: Add localStorage or backend API

2. **No Real-time Collaboration**
   - Single-user only
   - Fix: WebSocket integration with conflict resolution

3. **Limited Node Types**
   - Only 5 infrastructure types
   - Fix: Extend `NODE_CONFIGS` with more types

4. **No Undo/Redo**
   - Changes are permanent
   - Fix: Implement command pattern or use a library

5. **No Graph Validation**
   - Can create invalid connections
   - Fix: Add connection rules per node type

### Future Enhancements

- [ ] Persist graphs to localStorage
- [ ] Export/import graph JSON
- [ ] Node property inspector panel
- [ ] Connection validation rules
- [ ] Undo/redo stack
- [ ] Graph search and filtering
- [ ] Custom node type creator
- [ ] Keyboard shortcuts panel

---

## Libraries Used

| Library | Version | Purpose |
|---------|---------|---------|
| React | 19.2 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 7.2 | Build tool |
| @xyflow/react | 12.10 | Graph visualization |
| Zustand | 5.0 | Client state management |
| TanStack Query | 5.90 | Server state management |
| Tailwind CSS | 4.1 | Styling |
| Lucide React | 0.561 | Icons |
| Radix UI | Various | Accessible UI primitives |

---



##  Conclusion

This project demonstrates a well-structured React application with:
- Clean separation between client and server state
- Scalable folder organization
- Configuration-driven component generation
- Proper handling of async data with loading/error states

The mock API design makes it trivial to swap in a real backend—just replace the functions in `api/mockApi.ts` with actual fetch calls.
