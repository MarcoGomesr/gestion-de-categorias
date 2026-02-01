import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import type React from "react";
import { Button } from "@/shared/components/ui/button";
import type { Row } from "@/shared/types/grid";
import CategoryCard from "../CategoryCard";
import ZoomControls from "../ZoomControls";

type CategoryListProps = {
  rows: Row[];
  zoom: number;
  onAddCategory: () => void;
  gridRef: React.RefObject<HTMLDivElement | null>;
};

// Message shown when there are no categories
function EmptyCategoryMessage() {
  return (
    <div className="flex items-center justify-center text-muted-foreground text-base py-8">
      <span>
        No hay categorías disponibles. Haz clic en "Añadir categoría" para
        empezar
      </span>
    </div>
  );
}

// Renders all category rows
function CategoryRows({ rows }: { rows: Row[] }) {
  return (
    <>
      {rows.map((row) => (
        <SortableContext
          key={row.id}
          items={row.products.map((p) => p.slotId || p.id)}
          strategy={horizontalListSortingStrategy}
        >
          <CategoryCard row={row} />
        </SortableContext>
      ))}
    </>
  );
}

export default function CategoryList({
  rows,
  zoom,
  onAddCategory,
  gridRef,
}: CategoryListProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold" data-testid="title">
          Gestion de categorías
        </h2>
        <Button onClick={onAddCategory} data-testid="add-category-button">
          <Plus />
          Añadir categoría
        </Button>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <ZoomControls />
      </div>
      <div className="border-2 border-dashed border-gray-400 rounded-xl bg-gray-50 p-4 min-h-[120px] overflow-auto">
        <div
          ref={gridRef}
          className="w-full min-w-[600px] flex flex-col gap-6"
          style={{
            transform: `scale(${rows.length === 0 ? 1 : zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.2s",
          }}
        >
          {rows.length === 0 ? (
            <EmptyCategoryMessage />
          ) : (
            <CategoryRows rows={rows} />
          )}
        </div>
      </div>
    </div>
  );
}
