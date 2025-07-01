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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addProductToRow,
  addRow,
  removeProductFromRow,
  reorderProductsInRow,
  reorderRows,
} from "@/store/slices/gridSlice";
import ProductCard from "./ProductCard";
import RowCard from "./RowCard";

export default function EditorGrid() {
  const rows = useAppSelector((state) => state.grid.rows);
  const dispatch = useAppDispatch();
  const [activeRow, setActiveRow] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () =>
    setZoom((z) => Math.min(2, Math.round((z + 0.1) * 10) / 10));
  const handleZoomOut = () =>
    setZoom((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10));
  const handleZoomReset = () => setZoom(1);

  const handleDragStart = (event) => {
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
        removeProductFromRow({ rowId: fromRowId, productId: product.id }),
      );
      dispatch(addProductToRow({ rowId: toRowId, product }));
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Editor de categorías</h2>
        <Button onClick={() => dispatch(addRow())}>➕ Añadir fila</Button>
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
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              transition: "transform 0.2s",
              width: "100%",
              minWidth: 600,
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {rows.length === 0 ? (
              <div className="flex items-center justify-center text-muted-foreground text-base py-8">
                <span>No hay filas. Agrega una o arrastra aquí.</span>
              </div>
            ) : (
              rows.map((row) => (
                <SortableContext
                  key={row.id}
                  items={row.products.map((p) => p.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <RowCard row={row} />
                </SortableContext>
              ))
            )}
          </div>
        </div>
        <DragOverlay>
          {activeRow ? <RowCard row={activeRow} /> : null}
          {activeProduct ? (
            <ProductCard product={activeProduct} rowId={""} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
