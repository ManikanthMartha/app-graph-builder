import {
  GitHubNode,
  PostgresNode,
  RedisNode,
  MongoNode,
  DockerNode,
} from "./AllNodes";

export const nodeTypes = {
  github: GitHubNode,
  postgres: PostgresNode,
  redis: RedisNode,
  mongo: MongoNode,
  docker: DockerNode,
} as const;

export type NodeTypeKey = keyof typeof nodeTypes;