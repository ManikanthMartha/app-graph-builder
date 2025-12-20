import type { ComponentType, DragEvent, SVGProps } from "react";

export interface DraggableNodeProps {
  type: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const DraggableNode = ({ type, icon: Icon }: DraggableNodeProps) => {
  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData(
      "application/@xyflow/react",
      JSON.stringify({ nodeType: type })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className=" draggable-node cursor-grab rounded-md "
    >
        <Icon width={24} height={24} />
      {/* <span className="node-label text-xs font-medium text-white">{label}</span> */}
    </div>
    // <div
    //   draggable
    //   onDragStart={onDragStart}
    //   className=" draggable-node cursor-grab flex flex-col items-center gap-2 p-2 border rounded-lg bg-card hover:bg-accent transition-colors"
    // >
    //     <Icon width={16} height={16} />
    //   {/* <span className="node-label text-xs font-medium">{label}</span> */}
    // </div>
  );
};
