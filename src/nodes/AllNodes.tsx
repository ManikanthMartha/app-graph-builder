import type { ComponentType } from "react";
import type { NodeProps } from "@xyflow/react";
import { NodeFactory } from "./NodeFactory";
import { NODE_CONFIGS, type NodeConfig } from "./nodeConfigs";
import type { CustomNodeData } from "../store";
import { GithubIcon } from "@/icons/GithubIcon";
import { PostgresIcon } from "@/icons/PostgresIcon";
import { RedisIcon } from "@/icons/RedisIcon";
import { MongoIcon } from "@/icons/MongoIcon";
import { DockerIcon } from "@/icons/DockerIcon";


// Map node types to their icons
const NODE_ICONS: Record<string, ComponentType<{ width?: number; height?: number; className?: string }>> = {
  github: GithubIcon,
  postgres: PostgresIcon,
  redis: RedisIcon,
  mongo: MongoIcon,
  docker: DockerIcon,
};


function createNodeComponent(config: NodeConfig) {
  const IconComponent = NODE_ICONS[config.type];
  
  const NodeComponent = ({ id, data }: NodeProps) => {
    return (
      <NodeFactory
        id={id}
        data={data as CustomNodeData}
        config={{
          title: config.title,
          logo: IconComponent ? <IconComponent width={16} height={16} /> : null,
          price: config.price,
          status: config.defaultStatus,
          providerIcon: config.providerIcon,
          maxCpu: config.maxCpu,
          maxMemory: config.maxMemory,
          maxDisk: config.maxDisk,
          renderRegion: config.renderRegion,
        }}
      />
    );
  };  
  return NodeComponent;
}

export const GitHubNode = createNodeComponent(NODE_CONFIGS.find(c => c.type === "github")!);
export const PostgresNode = createNodeComponent(NODE_CONFIGS.find(c => c.type === "postgres")!);
export const RedisNode = createNodeComponent(NODE_CONFIGS.find(c => c.type === "redis")!);
export const MongoNode = createNodeComponent(NODE_CONFIGS.find(c => c.type === "mongo")!);
export const DockerNode = createNodeComponent(NODE_CONFIGS.find(c => c.type === "docker")!);
