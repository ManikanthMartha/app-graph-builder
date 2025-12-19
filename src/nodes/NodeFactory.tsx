import { useState, type ReactNode } from "react";
import { Cloud } from "lucide-react";
import { BaseNode, type NodeStatus } from "./BaseNode";
import { useStore, type CustomNodeData } from "../store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

// ============ Types ============

export type TabType = "cpu" | "memory" | "disk" | "region";

export interface ResourceValues {
  cpu: number;
  memory: number;
  disk: number;
}

export interface NodeFactoryConfig {
  title: string;
  logo?: ReactNode;
  price?: string;
  status?: NodeStatus;
  providerIcon?: ReactNode;
  // Resource limits
  maxCpu?: number;
  maxMemory?: number;
  maxDisk?: number;
  // Custom region renderer
  renderRegion?: (props: { id: string; data: CustomNodeData }) => ReactNode;
}

export interface NodeFactoryProps {
  id: string;
  data: CustomNodeData;
  config: NodeFactoryConfig;
}

// ============ Synced Slider + Input Component ============

interface ResourceSliderProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}

function ResourceSlider({ label, value, max, unit, onChange }: ResourceSliderProps) {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(Math.min(Math.max(0, newValue), max));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">Max: {max} {unit}</span>
      </div>
      <Slider
        value={[value]}
        max={max}
        step={1}
        onValueChange={handleSliderChange}
        className="w-full"
      />
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={0}
          max={max}
          className="h-8 w-20"
        />
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

// ============ Default Region Renderer ============

function DefaultRegionRenderer() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Select a region for deployment
      </p>
      <div className="grid grid-cols-2 gap-2">
        {["US East", "US West", "EU West", "Asia Pacific"].map((region) => (
          <button
            key={region}
            className="px-3 py-2 text-xs border rounded-md hover:bg-accent transition-colors"
          >
            {region}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ Component ============

/**
 * NodeFactory: A node with tabs for CPU, Memory, Disk, and Region configuration.
 * Features synced slider + numeric input for resource tabs.
 */
export function NodeFactory({ id, data, config }: NodeFactoryProps) {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [resources, setResources] = useState<ResourceValues>({
    cpu: (data.cpu as number) ?? 2,
    memory: (data.memory as number) ?? 4,
    disk: (data.disk as number) ?? 50,
  });

  const [currentTab, setCurrentTab] = useState<TabType>("cpu");

  const handleResourceChange = (key: keyof ResourceValues, value: number) => {
    setResources((prev) => ({ ...prev, [key]: value }));
    updateNodeField(id, key, value);
  };

  const maxCpu = config.maxCpu ?? 16;
  const maxMemory = config.maxMemory ?? 64;
  const maxDisk = config.maxDisk ?? 500;

  return (
    <BaseNode
      title={config.title}
      logo={config.logo}
      price={config.price}
      status={config.status ?? (data.status as NodeStatus) ?? "healthy"}
      providerIcon={config.providerIcon ?? <Cloud className="h-4 w-4" />}
    >
      <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as TabType)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-8">
          <TabsTrigger value="cpu" className="text-xs">CPU</TabsTrigger>
          <TabsTrigger value="memory" className="text-xs">Memory</TabsTrigger>
          <TabsTrigger value="disk" className="text-xs">Disk</TabsTrigger>
          <TabsTrigger value="region" className="text-xs">Region</TabsTrigger>
        </TabsList>

        <TabsContent value="cpu" className="mt-3">
          <ResourceSlider
            label="CPU Cores"
            value={resources.cpu}
            max={maxCpu}
            unit="cores"
            onChange={(v) => handleResourceChange("cpu", v)}
          />
        </TabsContent>

        <TabsContent value="memory" className="mt-3">
          <ResourceSlider
            label="Memory"
            value={resources.memory}
            max={maxMemory}
            unit="GB"
            onChange={(v) => handleResourceChange("memory", v)}
          />
        </TabsContent>

        <TabsContent value="disk" className="mt-3">
          <ResourceSlider
            label="Disk Storage"
            value={resources.disk}
            max={maxDisk}
            unit="GB"
            onChange={(v) => handleResourceChange("disk", v)}
          />
        </TabsContent>

        <TabsContent value="region" className="mt-3">
          {config.renderRegion
            ? config.renderRegion({ id, data })
            : <DefaultRegionRenderer />}
        </TabsContent>
      </Tabs>
    </BaseNode>
  );
}

// ============ Legacy NodeFactory (simplified wrapper) ============

// Re-export types for backward compatibility
export type { NodeStatus } from "./BaseNode";
export { BaseNode } from "./BaseNode";
