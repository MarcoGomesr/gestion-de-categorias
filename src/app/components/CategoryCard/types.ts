import type { DraggableAttributes } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import type { Row } from "@/shared/types/grid";

export type DragPropsProductList = {
  setNodeRef?: (element: HTMLElement | null) => void;
  attributes: DraggableAttributes;
  listeners: Record<string, any> | undefined;
  transform: undefined;
  transition: undefined;
  isDragging: boolean;
  dragHandleProps: {
    role: string;
    tabIndex: number;
    "aria-disabled": boolean;
    "aria-pressed": boolean | undefined;
    "aria-roledescription": string;
    "aria-describedby": string;
  };
};

export type DragPropsCategory = {
  setNodeRef?: (node: HTMLElement | null) => void;
  attributes: DraggableAttributes;
  listeners: Record<string, any> | undefined;
  transform: Transform | null;
  transition: string | undefined;
  isDragging: boolean;
  dragHandleProps: Record<string, any> | undefined;
};

export type DragPropsFallback = {
  setNodeRef?: (node: HTMLElement | null) => void;
  attributes: Record<string, any>;
  listeners: Record<string, any>;
  transform?: undefined;
  transition?: undefined;
  isDragging: boolean;
  dragHandleProps: Record<string, any>;
};

export type CategoryCardProps = {
  row: Row;
  setCombinedRef: (node: HTMLElement | null) => void;
  dragProps: DragPropsProductList | DragPropsCategory | DragPropsFallback;
  showRing: boolean;
  productIds: string[];
  slotIndexes: (number | null)[];
  emptyDroppables: {
    setNodeRef: (node: HTMLElement | null) => void;
    isOver: boolean;
  }[];
};
