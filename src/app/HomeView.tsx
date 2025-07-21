import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import ProductCard from "@/shared/components/ProductCard";
import type { Product, Row } from "@/shared/types/grid";
import CategoryCard from "./components/CategoryCard";
import CategoryList from "./components/CategoryList";
import ProductList from "./components/ProductList";

interface HomeViewProps {
  zoom: number;
  activeRow: Row | null;
  activeProduct: Product | null;
  onDragEnd: (event: DragEndEvent) => void;
  onDragStart: (event: DragStartEvent) => void;
}

const HomeView: React.FC<HomeViewProps> = ({
  zoom,
  activeRow,
  activeProduct,
  onDragEnd,
  onDragStart,
}) => {
  return (
    <main className="w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <DndContext
        collisionDetection={pointerWithin}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
      >
        <div className="lg:col-span-2">
          <CategoryList />
        </div>
        <div className="lg:col-span-1">
          <ProductList />
        </div>
        <DragOverlay>
          {activeRow ? (
            <div
              className="w-full min-w-[600px] flex flex-col gap-6 absolute left-0 top-0 pointer-events-none origin-top transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            >
              <CategoryCard row={activeRow} />
            </div>
          ) : null}
          {activeProduct ? (
            <div
              className="pointer-events-none origin-top transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            >
              <ProductCard product={activeProduct} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </main>
  );
};

export default HomeView;
