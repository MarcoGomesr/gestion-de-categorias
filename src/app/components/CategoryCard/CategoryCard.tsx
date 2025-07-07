import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import CategoryHeader from "./CategoryHeader";
import ProductSlots from "./ProductSlots";
import type { CategoryCardProps } from "./types";

function CategoryCard({
  row,
  setCombinedRef,
  dragProps,
  showRing,
  productIds,
  slotIndexes,
  emptyDroppables,
}: CategoryCardProps) {
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
            "flex gap-4 w-full p-4 border-2 border-dashed border-gray-400 rounded-xl min-h-[320px] bg-gray-50 justify-center"
          }
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

export default CategoryCard;
