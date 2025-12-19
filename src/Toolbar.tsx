import type { ComponentType } from "react";
import { DraggableNode } from "./draggableNode";
import { NODE_CONFIGS } from "./nodes/nodeConfigs";
import { GithubIcon } from "./icons/GithubIcon";
import { PostgresIcon } from "./icons/PostgresIcon";
import { DockerIcon } from "./icons/DockerIcon";
import { RedisIcon } from "./icons/RedisIcon";
import { MongoIcon } from "./icons/MongoIcon";

// ============ Icon Registry ============

const TOOLBAR_ICONS: Record<string, ComponentType> = {
  github: GithubIcon,
  postgres: PostgresIcon,
  docker: DockerIcon,
  redis: RedisIcon,
  mongo: MongoIcon,
};

// ============ Generate toolbar nodes from config ============

const TOOLBAR_NODES = NODE_CONFIGS.map((config) => ({
  type: config.type,
  icon: TOOLBAR_ICONS[config.type],
})).filter((node) => node.icon); // Only include nodes with icons

export const PipelineToolbar = () => {
  return (
    <div className="absolute top-1/3 left-4 z-50 bg-black backdrop-blur-sm border border-neutral-500 rounded-lg shadow-lg p-2 flex flex-col gap-4">
      {TOOLBAR_NODES.map((node) => (
        <DraggableNode key={node.type} {...node} />
      ))}
    </div>
  );
};
