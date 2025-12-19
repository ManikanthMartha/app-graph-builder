import type { ReactNode } from "react";
import type { NodeStatus } from "./BaseNode";
import type { CustomNodeData } from "../store";

export interface NodeConfig {
  type: string;
  title: string;
  logo: ReactNode;
  price?: string;
  defaultStatus?: NodeStatus;
  providerIcon?: ReactNode;
  maxCpu?: number;
  maxMemory?: number;
  maxDisk?: number;
  renderRegion?: (props: { id: string; data: CustomNodeData }) => ReactNode;
}

export const NODE_CONFIGS: NodeConfig[] = [
  {
    type: "github",
    title: "GitHub",
    logo: null,
    price: "$0.00/hr",
    maxCpu: 4,
    maxMemory: 8,
    maxDisk: 100,
  },
  {
    type: "postgres",
    title: "PostgreSQL",
    logo: null,
    price: "$0.25/hr",
    maxCpu: 8,
    maxMemory: 32,
    maxDisk: 500,
  },
  {
    type: "redis",
    title: "Redis",
    logo: null,
    price: "$0.15/hr",
    maxCpu: 4,
    maxMemory: 16,
    maxDisk: 50,
  },
  {
    type: "mongo",
    title: "MongoDB",
    logo: null,
    price: "$0.30/hr",
    maxCpu: 8,
    maxMemory: 32,
    maxDisk: 500,
  },
  {
    type: "docker",
    title: "Docker",
    logo: null,
    price: "$0.10/hr",
    maxCpu: 16,
    maxMemory: 64,
    maxDisk: 200,
  },
];

// ============ Helper to get config by type ============

export const getNodeConfig = (type: string): NodeConfig | undefined => {
  return NODE_CONFIGS.find((config) => config.type === type);
};

// ============ Get all node types for toolbar ============

export const getToolbarNodes = () => {
  return NODE_CONFIGS.map((config) => ({
    type: config.type,
    label: config.title,
  }));
};
