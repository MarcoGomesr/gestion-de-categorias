import { useDndContext } from "@dnd-kit/core";
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
}) => {
  const { active } = useDndContext();
  // Only highlight if dragging a product (not a category/row)
  const isDraggingProduct = active?.data?.current?.product;
  const showRing = isOver && isDraggingProduct;
  return (
    <div
      ref={setNodeRef}
      key={emptyId}
      data-id={emptyId}
      className={`w-[250px] h-[377px] rounded bg-gray-100 border border-dashed border-gray-300 opacity-50 transition ${showRing ? "ring-2 ring-blue-400" : ""}`}
    />
  );
};

export default EmptySlot;
