import type { ComponentType } from "react";
import { DraggableNode } from "./draggableNode";
import { GithubIcon } from "./icons/GithubIcon";
import { PostgresIcon } from "./icons/PostgresIcon";
import { DockerIcon } from "./icons/DockerIcon";
import { RedisIcon } from "./icons/RedisIcon";
import { MongoIcon } from "./icons/MongoIcon";

interface ToolbarNode {
  type: string;
  icon: ComponentType;
}

const TOOLBAR_NODES: ToolbarNode[] = [
  { type: "github", icon: GithubIcon },
  { type: "postgres", icon: PostgresIcon },
  { type: "docker", icon: DockerIcon },
  { type: "redis", icon: RedisIcon },
  { type: "mongo", icon: MongoIcon },
];

export const PipelineToolbar = () => {
  return (
    <div className="absolute top-1/3 left-4 z-50 bg-black backdrop-blur-sm border border-neutral-500 rounded-lg shadow-lg p-2 flex flex-col gap-4">
      {/* <div className="flex flex-wrap gap-2"> */}
        {TOOLBAR_NODES.map((node) => (
          <DraggableNode key={node.type} {...node} />
        ))}
      {/* </div> */}
    </div>
  );
};
