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

const statusConfig: Record<NodeStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  healthy: { label: "Healthy", variant: "default" },
  degraded: { label: "Degraded", variant: "secondary" },
  down: { label: "Down", variant: "destructive" },
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
        className={`node-container bg-card rounded-lg border shadow-sm min-w-70 relative ${className}`}
        style={style}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-3 border-b bg-muted/50 rounded-t-lg">
          <div className="flex items-center gap-2">
            {logo ?? <Server className="h-5 w-5 text-muted-foreground" />}
            <span className="font-semibold text-sm">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {price && (
              <span className="text-xs text-muted-foreground font-medium">
                {price}
              </span>
            )}
            <Button
              variant="ghost"
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
        <div className="p-3">{children}</div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t bg-muted/30 rounded-b-lg">
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
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