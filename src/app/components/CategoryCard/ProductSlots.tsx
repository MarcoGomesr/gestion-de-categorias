"use client";
import type React from "react";
import { useAppDispatch } from "@/store/hooks";
import { removeProductFromRow } from "@/store/slices/gridSlice";
import type { Row } from "@/types/grid";
import ProductCard from "../ProductCard";
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
  const dispatch = useAppDispatch();
  const handleRemoveProduct = (productId: string, slotId?: string) => {
    dispatch(removeProductFromRow({ rowId: row.id, productId, slotId }));
  };
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
              rowId={row.id}
              onRemove={() =>
                handleRemoveProduct(
                  row.products[productIdx].id,
                  row.products[productIdx].slotId,
                )
              }
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
