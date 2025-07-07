"use client";
import { useDndContext, useDroppable } from "@dnd-kit/core";
import type React from "react";
import { useDragAndDrop } from "@/shared/hooks/useDragAndDrop";
import { useAppDispatch } from "@/shared/store/hooks";
import type { Row } from "@/shared/types/grid";
import CategoryCard from "./CategoryCard";

type Props = {
  row: Row;
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

const CategoryCardContainer: React.FC<Props> = ({ row }) => {
  const dispatch = useAppDispatch();
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: row.id,
    data: { rowId: row.id },
  });
  const { active } = useDndContext();

  const dragProps = useDragAndDrop({
    id: row.id,
    context: "CategoryRow",
    data: { rowId: row.id },
  });

  const setCombinedRef = (node: HTMLElement | null) => {
    setDroppableRef(node);
    dragProps.setNodeRef?.(node);
  };

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
    <CategoryCard
      row={row}
      setCombinedRef={setCombinedRef}
      dragProps={dragProps}
      productIds={productIds}
      slotIndexes={slotIndexes}
      emptyDroppables={emptyDroppables}
    />
  );
};

export default CategoryCardContainer;
