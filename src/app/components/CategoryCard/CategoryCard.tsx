import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import type React from "react";
import CategoryHeader from "./CategoryHeader";
import ProductSlots from "./ProductSlots";
import type { CategoryCardProps } from "./types";

const CategoryCard: React.FC<CategoryCardProps> = ({
  row,
  setCombinedRef,
  dragProps,
  showRing,
  productIds,
  slotIndexes,
  emptyDroppables,
}) => {
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
      className={`border rounded-xl p-4 shadow-sm bg-white ${showRing ? "ring-2 ring-blue-400" : ""}`}
    >
      <CategoryHeader rowId={row.id} alignment={row.alignment} />
      <SortableContext
        items={productIds}
        strategy={horizontalListSortingStrategy}
      >
        <div
          className={
            "flex gap-3 w-full py-8 border-2 border-dashed border-gray-400 rounded-xl bg-gray-50 justify-center transition-colors transition-background duration-200"
          }
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
};

export default CategoryCard;
