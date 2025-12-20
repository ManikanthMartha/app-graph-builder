import type { CustomNode, CustomEdge } from '../store';

// ============ Types ============

export interface App {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface GraphData {
  nodes: CustomNode[];
  edges: CustomEdge[];
}

// ============ Mock Data ============

const MOCK_APPS: App[] = [
  {
    id: 'app-1',
    name: 'E-Commerce Platform',
    description: 'Main production e-commerce system',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-15T14:30:00Z',
  },
  {
    id: 'app-2',
    name: 'Analytics Dashboard',
    description: 'Real-time analytics and monitoring',
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2024-12-10T09:15:00Z',
  },
  {
    id: 'app-3',
    name: 'Auth Service',
    description: 'Authentication and authorization microservice',
    createdAt: '2024-05-10T12:00:00Z',
    updatedAt: '2024-11-28T16:45:00Z',
  },
  {
    id: 'app-4',
    name: 'Data Pipeline',
    description: 'ETL and data processing workflows',
    createdAt: '2024-07-01T09:00:00Z',
    updatedAt: '2024-12-18T11:20:00Z',
  },
];

const MOCK_GRAPHS: Record<string, GraphData> = {
  'app-1': {
    nodes: [
      {
        id: 'github-1',
        type: 'github',
        position: { x: 100, y: 100 },
        data: { id: 'github-1', nodeType: 'github', label: 'GitHub Repo', status: 'healthy' },
      },
      {
        id: 'docker-1',
        type: 'docker',
        position: { x: 350, y: 100 },
        data: { id: 'docker-1', nodeType: 'docker', label: 'Web Container', status: 'healthy' },
      },
      {
        id: 'postgres-1',
        type: 'postgres',
        position: { x: 600, y: 100 },
        data: { id: 'postgres-1', nodeType: 'postgres', label: 'Main DB', status: 'healthy' },
      },
      {
        id: 'redis-1',
        type: 'redis',
        position: { x: 600, y: 250 },
        data: { id: 'redis-1', nodeType: 'redis', label: 'Cache Layer', status: 'degraded' },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'github-1', target: 'docker-1', type: 'smoothstep', animated: true },
      { id: 'e2-3', source: 'docker-1', target: 'postgres-1', type: 'smoothstep', animated: true },
      { id: 'e2-4', source: 'docker-1', target: 'redis-1', type: 'smoothstep', animated: true },
    ],
  },
  'app-2': {
    nodes: [
      {
        id: 'docker-1',
        type: 'docker',
        position: { x: 100, y: 150 },
        data: { id: 'docker-1', nodeType: 'docker', label: 'Analytics API', status: 'healthy' },
      },
      {
        id: 'mongo-1',
        type: 'mongo',
        position: { x: 350, y: 100 },
        data: { id: 'mongo-1', nodeType: 'mongo', label: 'Events Store', status: 'healthy' },
      },
      {
        id: 'redis-1',
        type: 'redis',
        position: { x: 350, y: 250 },
        data: { id: 'redis-1', nodeType: 'redis', label: 'Real-time Cache', status: 'healthy' },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'docker-1', target: 'mongo-1', type: 'smoothstep', animated: true },
      { id: 'e1-3', source: 'docker-1', target: 'redis-1', type: 'smoothstep', animated: true },
    ],
  },
  'app-3': {
    nodes: [
      {
        id: 'github-1',
        type: 'github',
        position: { x: 100, y: 150 },
        data: { id: 'github-1', nodeType: 'github', label: 'Auth Repo', status: 'healthy' },
      },
      {
        id: 'docker-1',
        type: 'docker',
        position: { x: 350, y: 150 },
        data: { id: 'docker-1', nodeType: 'docker', label: 'Auth Service', status: 'healthy' },
      },
      {
        id: 'postgres-1',
        type: 'postgres',
        position: { x: 600, y: 150 },
        data: { id: 'postgres-1', nodeType: 'postgres', label: 'Users DB', status: 'down' },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'github-1', target: 'docker-1', type: 'smoothstep', animated: true },
      { id: 'e2-3', source: 'docker-1', target: 'postgres-1', type: 'smoothstep', animated: true },
    ],
  },
  'app-4': {
    nodes: [
      {
        id: 'github-1',
        type: 'github',
        position: { x: 100, y: 100 },
        data: { id: 'github-1', nodeType: 'github', label: 'Pipeline Repo', status: 'healthy' },
      },
      {
        id: 'docker-1',
        type: 'docker',
        position: { x: 350, y: 50 },
        data: { id: 'docker-1', nodeType: 'docker', label: 'ETL Worker', status: 'healthy' },
      },
      {
        id: 'docker-2',
        type: 'docker',
        position: { x: 350, y: 200 },
        data: { id: 'docker-2', nodeType: 'docker', label: 'Scheduler', status: 'healthy' },
      },
      {
        id: 'postgres-1',
        type: 'postgres',
        position: { x: 600, y: 50 },
        data: { id: 'postgres-1', nodeType: 'postgres', label: 'Data Warehouse', status: 'healthy' },
      },
      {
        id: 'mongo-1',
        type: 'mongo',
        position: { x: 600, y: 200 },
        data: { id: 'mongo-1', nodeType: 'mongo', label: 'Raw Data', status: 'healthy' },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'github-1', target: 'docker-1', type: 'smoothstep', animated: true },
      { id: 'e1-3', source: 'github-1', target: 'docker-2', type: 'smoothstep', animated: true },
      { id: 'e2-4', source: 'docker-1', target: 'postgres-1', type: 'smoothstep', animated: true },
      { id: 'e3-5', source: 'docker-2', target: 'mongo-1', type: 'smoothstep', animated: true },
    ],
  },
};

// ============ Simulated Latency Helper ============

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Toggle this to simulate errors
let shouldSimulateError = false;

export const toggleErrorSimulation = () => {
  shouldSimulateError = !shouldSimulateError;
  return shouldSimulateError;
};

export const getErrorSimulationState = () => shouldSimulateError;

// ============ Mock API Functions ============

/**
 * GET /apps - Returns list of all apps
 */
export const fetchApps = async (): Promise<App[]> => {
  await delay(500 + Math.random() * 500); // 500-1000ms latency

  if (shouldSimulateError && Math.random() > 0.5) {
    throw new Error('Failed to fetch apps. Please try again.');
  }

  return [...MOCK_APPS];
};

/**
 * GET /apps/:appId/graph - Returns nodes + edges for selected app
 */
export const fetchAppGraph = async (appId: string): Promise<GraphData> => {
  await delay(300 + Math.random() * 400); // 300-700ms latency

  if (shouldSimulateError && Math.random() > 0.5) {
    throw new Error(`Failed to fetch graph for app ${appId}. Please try again.`);
  }

  const graph = MOCK_GRAPHS[appId];
  if (!graph) {
    throw new Error(`App with id ${appId} not found`);
  }

  return { nodes: [...graph.nodes], edges: [...graph.edges] };
};

/**
 * POST /apps - Create a new app (mock)
 */
export const createApp = async (name: string, description: string = ''): Promise<App> => {
  await delay(300 + Math.random() * 300);

  const newApp: App = {
    id: `app-${Date.now()}`,
    name,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  MOCK_APPS.push(newApp);
  MOCK_GRAPHS[newApp.id] = { nodes: [], edges: [] };

  return newApp;
};

/**
 * PUT /apps/:appId/graph - Save graph for an app (mock)
 */
export const saveAppGraph = async (appId: string, graph: GraphData): Promise<void> => {
  await delay(200 + Math.random() * 200);

  if (!MOCK_GRAPHS[appId]) {
    throw new Error(`App with id ${appId} not found`);
  }

  MOCK_GRAPHS[appId] = { nodes: [...graph.nodes], edges: [...graph.edges] };
  
  // Update the app's updatedAt timestamp
  const app = MOCK_APPS.find(a => a.id === appId);
  if (app) {
    app.updatedAt = new Date().toISOString();
  }
};
