import { NodeFactory } from "./NodeFactory";
import type { CustomNodeData } from "../store";
import { GithubIcon } from "@/icons/GithubIcon";

interface GitHubNodeProps {
  id: string;
  data: CustomNodeData;
}

export const GitHubNode = ({ id, data }: GitHubNodeProps) => {
  return (
    <NodeFactory
      id={id}
      data={data}
      config={{
        title: "GitHub",
        logo: <GithubIcon width={14} height={14}/>,
        price: "$0.00/hr",
        maxCpu: 4,
        maxMemory: 8,
        maxDisk: 100,
      }}
    />
  );
};

