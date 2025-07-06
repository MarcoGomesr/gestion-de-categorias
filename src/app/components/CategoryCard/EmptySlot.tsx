import type React from "react";

interface EmptySlotProps {
  setNodeRef: (node: HTMLElement | null) => void;
  emptyId: string;
  isOver: boolean;
}

const EmptySlot: React.FC<EmptySlotProps> = ({
  setNodeRef,
  emptyId,
  isOver,
}) => (
  <div
    ref={setNodeRef}
    key={emptyId}
    data-id={emptyId}
    className={`w-[250px] h-[377px] rounded bg-gray-100 border border-dashed border-gray-300 opacity-50 transition ${isOver ? "ring-2 ring-blue-400" : ""}`}
  />
);

export default EmptySlot;
