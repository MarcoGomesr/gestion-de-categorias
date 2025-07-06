"use client";
import { useDroppable } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useAppDispatch } from "@/store/hooks";
import { removeRow } from "@/store/slices/gridSlice";
import type { Row } from "@/types/grid";
import Header from "./Header";
import ProductSlots from "./ProductSlots";

interface Props {
  row: Row;
}

export default function CategoryCard({ row }: Props) {
  const dispatch = useAppDispatch();
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: row.id,
    data: { rowId: row.id },
  });

  const dragProps = useDragAndDrop({
    id: row.id,
    context: "CategoryRow",
    data: { rowId: row.id },
  });

  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const setCombinedRef = (node: HTMLElement | null) => {
    setDroppableRef(node);
    dragProps.setNodeRef?.(node);
  };

  function getSlotIndexes(alignment: string, numProducts: number) {
    const align = alignment || "left";
    if (numProducts === 0) return [null, null, null];
    if (numProducts === 1) {
      switch (align) {
        case "center":
          return [null, 0, null];
        case "right":
          return [null, null, 0];
        default:
          return [0, null, null];
      }
    }
    if (numProducts === 2) {
      switch (align) {
        case "center":
          return [0, 1];
        case "right":
          return [null, 0, 1];
        default:
          return [0, 1, null];
      }
    }
    return [0, 1, 2];
  }

  const productIds = row.products
    .map((p) => p.slotId)
    .filter((id): id is string => Boolean(id));
  const slotIndexes = getSlotIndexes(row.alignment, row.products.length);

  const emptyDroppable0 = useDroppable({
    id: `empty-${row.id}-0`,
    data: { rowId: row.id, emptySlotIndex: 0 },
  });
  const emptyDroppable1 = useDroppable({
    id: `empty-${row.id}-1`,
    data: { rowId: row.id, emptySlotIndex: 1 },
  });
  const emptyDroppable2 = useDroppable({
    id: `empty-${row.id}-2`,
    data: { rowId: row.id, emptySlotIndex: 2 },
  });
  const emptyDroppables = [emptyDroppable0, emptyDroppable1, emptyDroppable2];

  return (
    <div
      ref={setCombinedRef}
      style={{
        transition: dragProps.transition,
        transform: dragProps.transform
          ? `translate3d(${dragProps.transform.x}px, ${dragProps.transform.y}px, 0)`
          : undefined,
        opacity: dragProps.isDragging ? 0.5 : 1,
      }}
      className={`border rounded-xl p-4 shadow-sm bg-white`}
    >
      <Header
        rowId={row.id}
        alignment={row.alignment}
        showTemplateSelector={showTemplateSelector}
        setShowTemplateSelector={setShowTemplateSelector}
        onMove={() => {}}
        onRemove={(e) => {
          e.stopPropagation();
          dispatch(removeRow(row.id));
        }}
      />
      <SortableContext
        items={productIds}
        strategy={horizontalListSortingStrategy}
      >
        <div
          className={`flex gap-4 w-full p-4 border-2 border-dashed border-gray-400 rounded-xl min-h-[320px] bg-gray-50 ${
            row.products.length === 1 || row.products.length === 2
              ? row.alignment === "center"
                ? "justify-center"
                : row.alignment === "right"
                  ? "justify-end"
                  : "justify-start"
              : "justify-start"
          }`}
          style={{ transition: "background 0.2s, border 0.2s" }}
        >
          <ProductSlots
            row={row}
            slotIndexes={slotIndexes}
            emptyDroppables={emptyDroppables}
          />
        </div>
      </SortableContext>
    </div>
  );
}
