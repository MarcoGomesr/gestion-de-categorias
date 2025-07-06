import { useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import type { Product } from "@/types/grid";

type DragContext = "ProductList" | "CategoryCard" | "CategoryRow";

type UseDragAndDropProps = {
  id: string;
  context: DragContext;
  data?: {
    product?: Product;
    rowId?: string;
    slotId?: string;
  };
};

export function useDragAndDrop({ id, context, data }: UseDragAndDropProps) {
  const draggable = useDraggable({
    id: `palette-${id}`,
    data: { product: data?.product, rowId: "ProductList" },
  });

  const sortable = useSortable({
    id: data?.slotId || id,
    data: { product: data?.product, slotId: data?.slotId, rowId: data?.rowId },
  });

  if (context === "ProductList") {
    return {
      setNodeRef: draggable.setNodeRef,
      attributes: draggable.attributes,
      listeners: draggable.listeners,
      transform: undefined,
      transition: undefined,
      isDragging: draggable.isDragging,
      dragHandleProps: { ...draggable.attributes, ...draggable.listeners },
    };
  }

  if (context === "CategoryCard") {
    return {
      setNodeRef: sortable.setNodeRef,
      attributes: sortable.attributes,
      listeners: sortable.listeners,
      transform: sortable.transform,
      transition: sortable.transition,
      isDragging: sortable.isDragging,
      dragHandleProps: sortable.listeners,
    };
  }

  if (context === "CategoryRow") {
    return {
      setNodeRef: sortable.setNodeRef,
      attributes: sortable.attributes,
      listeners: sortable.listeners,
      transform: sortable.transform,
      transition: sortable.transition,
      isDragging: sortable.isDragging,
      dragHandleProps: sortable.listeners,
    };
  }

  // Fallback
  return {
    setNodeRef: undefined,
    attributes: {},
    listeners: {},
    transform: undefined,
    transition: undefined,
    isDragging: false,
    dragHandleProps: {},
  };
}
