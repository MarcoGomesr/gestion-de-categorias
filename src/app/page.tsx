"use client";

import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { useState } from "react";
import ProductCard from "@/shared/components/ProductCard";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import {
  addProductToRow,
  moveProductBetweenRows,
  reorderProductsBySlots,
  reorderRows,
} from "@/shared/store/slices/gridSlice";
import type { Product, Row } from "@/shared/types/grid";
import CategoryCard from "./components/CategoryCard";
import CategoryList from "./components/CategoryList";
import ProductList from "./components/ProductList";

export default function Home() {
  const rows = useAppSelector((state) => state.grid.rows);
  const dispatch = useAppDispatch();
  const [activeRow, setActiveRow] = useState<Row | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const zoom = useAppSelector((state) => state.grid.zoom);

  const handleDragStart = (event: any) => {
    const { active } = event;
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

  const handleDragEnd = (event: any) => {
    setActiveRow(null);
    setActiveProduct(null);
    const { active, over } = event;
    if (!over) return;

    // Drop validation: prevent dropping a category onto a product/slot and vice versa
    const isDraggingRow = rows.some((r) => r.id === active.id);
    const isOverRow = rows.some((r) => r.id === over.id);

    // If dragging a category, only allow drop on another category
    if (isDraggingRow && !isOverRow) {
      return;
    }
    // If dragging a product, do not allow drop on a category
    if (!isDraggingRow && isOverRow) {
      return;
    }

    // Drag de filas
    const activeRowId = active.id;
    const overRowId = over.id;
    const activeRowIndex = rows.findIndex((r) => r.id === activeRowId);
    const overRowIndex = rows.findIndex((r) => r.id === overRowId);
    const isRowReorder =
      activeRowIndex !== -1 && overRowIndex !== -1 && activeRowId !== overRowId;
    if (isRowReorder) {
      dispatch(
        reorderRows({ oldIndex: activeRowIndex, newIndex: overRowIndex }),
      );
      return;
    }

    // Lógica de productos
    if (!active?.data?.current || !over?.data?.current) return;
    const fromRowId = active.data.current.rowId;
    const product = active.data.current.product;
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
        (p: Product) => (p.slotId || p.id) === active.id,
      );
      let newIndex = row.products.findIndex(
        (p: Product) => (p.slotId || p.id) === over.id,
      );
      if (isOverEmptySlot && emptySlotIndex !== -1) {
        newIndex = row.products.length;
      }
      if (oldIndex !== -1 && oldIndex !== newIndex && row.products.length > 1) {
        const productsCopy = [...row.products];
        const [moved] = productsCopy.splice(oldIndex, 1);
        productsCopy.splice(newIndex, 0, moved);
        const newSlotIds = productsCopy.map((p: Product) => p.slotId || p.id);
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
        let toIndex = destinationRow.products.length;
        if (isOverEmptySlot && emptySlotIndex !== -1) {
          toIndex = emptySlotIndex;
        } else if (over.data?.current?.product) {
          toIndex = destinationRow.products.findIndex(
            (p: Product) => (p.slotId || p.id) === over.id,
          );
          if (toIndex === -1) toIndex = destinationRow.products.length;
        }
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
    // Si es un producto nuevo desde ProductList, agregarlo a la categoría
    if (fromRowId === "ProductList" && toRowId) {
      const destinationRow = rows.find((r) => r.id === toRowId);
      if (destinationRow && destinationRow.products.length < 3) {
        let toIndex = destinationRow.products.length;
        if (isOverEmptySlot && emptySlotIndex !== -1) {
          toIndex = emptySlotIndex;
        } else if (over.data?.current?.product) {
          toIndex = destinationRow.products.findIndex(
            (p: Product) => (p.slotId || p.id) === over.id,
          );
          if (toIndex === -1) toIndex = destinationRow.products.length;
        }
        dispatch(
          addProductToRow({
            rowId: toRowId,
            product,
            source: "dnd",
          }),
        );
      }
      return;
    }
  };

  return (
    <main className="w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <DndContext
        collisionDetection={pointerWithin}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
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
}
