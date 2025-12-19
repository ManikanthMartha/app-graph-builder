import { Handle, Position } from "@xyflow/react";
import { memo, type ReactNode, type CSSProperties } from "react";
import { Settings, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ============ Types ============

export type NodeStatus = "healthy" | "degraded" | "down";

export interface BaseNodeProps {
  title: string;
  logo?: ReactNode;
  price?: string;
  status?: NodeStatus;
  providerIcon?: ReactNode;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onSettingsClick?: () => void;
}

const statusConfig: Record<NodeStatus, { label: string; className: string }> = {
  healthy: { label: "Healthy", className: "bg-green-800 text-green-100" },
  degraded: { label: "Degraded", className: "bg-yellow-600 text-white" },
  down: { label: "Down", className: "bg-red-800 text-red-100" },
};

/**
 * BaseNode: Pure render component for service nodes.
 * Structure: Header (title, logo, price, settings) -> Content (tabs) -> Footer (status, provider)
 */
export const BaseNode = memo<BaseNodeProps>(
  ({
    title,
    logo,
    price,
    status = "healthy",
    providerIcon,
    className = "",
    style = {},
    children,
    onSettingsClick,
  }) => {
    const statusInfo = statusConfig[status];

    return (
      <div
        className={`node-container bg-black rounded-lg shadow-sm min-w-80 relative ${className} p-4`}
        style={style}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 rounded-t-lg">
          <div className="flex items-center gap-2">
            {logo ?? <Server className="h-5 w-5 text-muted-foreground" />}
            <span className="font-semibold text-sm text-white">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {price && (
              <span className="text-xs text-green-700 font-semibold border border-green-700 rounded p-1">{price} </span>
            )}
            <Button
              size="icon"
              className="h-7 w-7"
              onClick={onSettingsClick}
              aria-label="Node settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Static Handles */}
        <Handle
          type="target"
          position={Position.Left}
          className="w-3! h-3! bg-indigo-500! border-2! border-white!"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3! h-3! bg-indigo-500! border-2! border-white!"
        />

        {/* Body / Content */}
        <div className="mt-6">{children}</div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6">
          <Badge className={`p-1 ${statusInfo.className} rounded-sm`}>{statusInfo.label}</Badge>
          {providerIcon && (
            <div className="flex items-center text-muted-foreground">
              {providerIcon}
            </div>
          )}
        </div>
      </div>
    );
  }
);