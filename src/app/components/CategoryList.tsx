"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addRow,
  moveProductBetweenRows,
  reorderProductsBySlots,
  reorderRows,
} from "@/store/slices/gridSlice";
import type { Product, Row } from "@/types/grid";
import CategoryCard from "./CategoryCard";
import ProductCard from "./ProductCard";
import ZoomControls from "./ZoomControls";

export default function CategoryList() {
  const rows = useAppSelector((state) => state.grid.rows);
  const dispatch = useAppDispatch();
  const [activeRow, setActiveRow] = useState<Row | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [zoom, setZoom] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  // Removed unused gridWidth state

  const handleDragStart = (event: DragStartEvent) => {
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

    const isDraggingRow =
      activeRowIndex !== -1 && overRowIndex !== -1 && activeRowId !== overRowId;

    if (isDraggingRow) {
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
    const overId = over.id;

    // Detectar si el drop fue sobre un slot vacío
    const isOverEmptySlot =
      typeof overId === "string" && overId.startsWith("empty-");
    let emptySlotIndex = -1;
    if (isOverEmptySlot) {
      // El id es 'empty-<rowId>-<idx>'
      const parts = overId.split("-");
      emptySlotIndex = parseInt(parts[2], 10);
    }

    // Si es el mismo row, reordenar (incluyendo drop sobre slot vacío)
    if (toRowId && fromRowId === toRowId) {
      const row = rows.find((r) => r.id === fromRowId);
      if (!row) return;
      const oldIndex = row.products.findIndex(
        (p) => (p.slotId || p.id) === active.id,
      );
      let newIndex = row.products.findIndex(
        (p) => (p.slotId || p.id) === over.id,
      );
      if (isOverEmptySlot && emptySlotIndex !== -1) {
        newIndex = row.products.length; // Siempre al final (puedes ajustar si quieres en el slot exacto)
      }

      // Solo reordenar si la posición cambia y hay más de un producto
      if (oldIndex !== -1 && oldIndex !== newIndex && row.products.length > 1) {
        // Construir el nuevo orden de slotIds
        const productsCopy = [...row.products];
        const [moved] = productsCopy.splice(oldIndex, 1);
        productsCopy.splice(newIndex, 0, moved);
        const newSlotIds = productsCopy.map((p) => p.slotId || p.id);
        dispatch(
          reorderProductsBySlots({
            rowId: fromRowId,
            slotIds: newSlotIds,
          }),
        );
      }
      return;
    }

    // Mover entre filas (incluyendo drop sobre slot vacío)
    if (
      toRowId &&
      fromRowId !== toRowId &&
      (over.data?.current?.product || isOverEmptySlot)
    ) {
      const destinationRow = rows.find((r) => r.id === toRowId);
      if (destinationRow && destinationRow.products.length < 3) {
        // Calcula el índice de inserción
        let toIndex = destinationRow.products.length;
        if (isOverEmptySlot && emptySlotIndex !== -1) {
          toIndex = emptySlotIndex;
        } else if (over.data?.current?.product) {
          toIndex = destinationRow.products.findIndex(
            (p) => (p.slotId || p.id) === over.id,
          );
          if (toIndex === -1) toIndex = destinationRow.products.length;
        }
        // Asegura que toIndex siempre sea un número válido
        if (typeof toIndex !== "number" || isNaN(toIndex)) {
          toIndex = destinationRow.products.length;
        }
        dispatch(
          moveProductBetweenRows({
            fromRowId,
            toRowId,
            product,
            toIndex,
          }),
        );
      }
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
        {rows.length > 0 && <ZoomControls zoom={zoom} setZoom={setZoom} />}
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
                  items={row.products.map((p) => p.slotId || p.id)}
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
              <ProductCard product={activeProduct} isDraggable />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
