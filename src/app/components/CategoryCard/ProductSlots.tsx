"use client";
import type React from "react";
import ProductCard from "@/shared/components/ProductCard";
import type { Row } from "@/shared/types/grid";
import EmptySlot from "./EmptySlot";

type ProductSlotsProps = {
  row: Row;
  slotIndexes: (number | null)[];
  emptyDroppables: {
    setNodeRef: (node: HTMLElement | null) => void;
    isOver: boolean;
  }[];
};

const ProductSlots: React.FC<ProductSlotsProps> = ({
  row,
  slotIndexes,
  emptyDroppables,
}) => {
  return (
    <>
      {slotIndexes.map((productIdx, idx) => {
        if (productIdx !== null && row.products[productIdx]) {
          return (
            <ProductCard
              key={
                row.products[productIdx].slotId || row.products[productIdx].id
              }
              product={row.products[productIdx]}
              slotId={row.products[productIdx].slotId}
              rowId={row.id}
            />
          );
        } else {
          // render empty slots
          const emptyId = `empty-${row.id}-${idx}`;
          const droppable = emptyDroppables[idx];
          return (
            <EmptySlot
              key={emptyId}
              setNodeRef={droppable.setNodeRef}
              emptyId={emptyId}
              isOver={droppable.isOver}
            />
          );
        }
      })}
    </>
  );
};

export default ProductSlots;
