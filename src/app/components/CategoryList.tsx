"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addProductToRow,
  addRow,
  removeProductFromRow,
  reorderProductsInRow,
  reorderRows,
} from "@/store/slices/gridSlice";
import type { Row } from "@/types/grid";
import CategoryCard from "./CategoryCard";
import ProductCard from "./ProductCard";

export default function CategoryList() {
  const rows = useAppSelector((state) => state.grid.rows);
  const dispatch = useAppDispatch();
  const [activeRow, setActiveRow] = useState<Row | null>(null);
  const [activeProduct, setActiveProduct] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState<number | undefined>(undefined);
  const [overlayOffset, setOverlayOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (gridRef.current) {
      setGridWidth(gridRef.current.offsetWidth);
      // Calcular el offset del grid escalado respecto al viewport
      const rect = gridRef.current.getBoundingClientRect();
      // El offset es la diferencia entre la posición real y la visual escalada
      const x = rect.left - rect.left / zoom;
      const y = rect.top - rect.top / zoom;
      setOverlayOffset({ x, y });
    }
  }, [zoom, rows]);

  const handleZoomIn = () =>
    setZoom((z) => Math.min(2, Math.round((z + 0.1) * 10) / 10));
  const handleZoomOut = () =>
    setZoom((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10));
  const handleZoomReset = () => setZoom(1);

  const handleDragStart = (event: any) => {
    const { active } = event;
    // Si el drag es de fila
    const row = rows.find((r) => r.id === active.id);
    if (row) {
      setActiveRow(row);
      setActiveProduct(null);
      return;
    }
    // Si el drag es de producto
    if (active?.data?.current?.product) {
      setActiveProduct(active.data.current.product);
      setActiveRow(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveRow(null);
    setActiveProduct(null);
    const { active, over } = event;
    if (!over) return;

    // Drag de filas
    const activeRowId = active.id;
    const overRowId = over.id;
    const activeRowIndex = rows.findIndex((r) => r.id === activeRowId);
    const overRowIndex = rows.findIndex((r) => r.id === overRowId);
    if (
      activeRowIndex !== -1 &&
      overRowIndex !== -1 &&
      activeRowId !== overRowId
    ) {
      dispatch(
        reorderRows({ oldIndex: activeRowIndex, newIndex: overRowIndex }),
      );
      return;
    }

    // Lógica de productos (como antes)
    if (!active?.data?.current || !over?.data?.current) return;

    const fromRowId = active.data.current.rowId;
    const product = active.data.current.product;
    const slotId = active.data.current.slotId;
    const toRowId = over.data?.current?.rowId;

    // Si es el mismo row, reordenar
    if (toRowId && fromRowId === toRowId) {
      const row = rows.find((r) => r.id === fromRowId);
      if (!row) return;
      const oldIndex = row.products.findIndex((p) => p.id === active.id);
      const newIndex = row.products.findIndex((p) => p.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        dispatch(
          reorderProductsInRow({ rowId: fromRowId, oldIndex, newIndex }),
        );
      }
      return;
    }

    if (!toRowId || fromRowId === toRowId) return;

    // Asegúrate de que la fila destino tenga menos de 3
    const destinationRow = rows.find((r) => r.id === toRowId);
    if (destinationRow && destinationRow.products.length < 3) {
      dispatch(
        removeProductFromRow({
          rowId: fromRowId,
          productId: product.id,
          slotId,
        }),
      );
      // Al agregar a la nueva fila, elimina el slotId para que se genere uno nuevo
      const { slotId: _, ...productWithoutSlot } = product;
      dispatch(
        addProductToRow({ rowId: toRowId, product: productWithoutSlot }),
      );
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gestion de categorías</h2>
        <Button onClick={() => dispatch(addRow())}>
          <Plus /> Añadir categoria
        </Button>
      </div>
      <div className="flex items-center gap-2 mb-2">
        {rows.length > 0 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              aria-label="Zoom out"
            >
              -
            </Button>
            <span className="w-12 text-center select-none">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              aria-label="Zoom in"
            >
              +
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomReset}
              aria-label="Reset zoom"
            >
              Reset
            </Button>
          </>
        )}
      </div>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
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
              <div className="flex items-center justify-center text-muted-foreground text-base py-8">
                <span>
                  No hay categorías disponibles. Haz clic en "Añadir categoría"
                  para empezar
                </span>
              </div>
            ) : (
              rows.map((row) => (
                <SortableContext
                  key={row.id}
                  items={row.products.map((p) => p.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <CategoryCard row={row} />
                </SortableContext>
              ))
            )}
          </div>
        </div>
        <DragOverlay>
          {activeRow ? (
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                transition: "transform 0.2s",
                width: gridWidth,
                minWidth: 600,
                position: "absolute",
                left: 0,
                top: 0,
                pointerEvents: "none",
              }}
            >
              <CategoryCard row={activeRow} />
            </div>
          ) : null}
          {activeProduct ? (
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                transition: "transform 0.2s",
                pointerEvents: "none",
              }}
            >
              <ProductCard product={activeProduct} categoryId={""} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
