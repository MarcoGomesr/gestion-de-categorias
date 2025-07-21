"use client";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import {
  addProductToRow,
  moveProductBetweenRows,
  reorderProductsBySlots,
  reorderRows,
} from "@/shared/store/slices/gridSlice";
import type { Product, Row } from "@/shared/types/grid";
import HomeView from "./HomeView";

export default function Page() {
  const rows = useAppSelector((state) => state.grid.rows);
  const dispatch = useAppDispatch();
  const [activeRow, setActiveRow] = useState<Row | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const zoom = useAppSelector((state) => state.grid.zoom);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const row = rows.find((r) => r.id === active.id);
    if (row) {
      setActiveRow(row);
      setActiveProduct(null);
      return;
    }
    // If dragging a product
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

    if (!active?.data?.current || !over?.data?.current) return;
    const fromRowId = active.data.current.rowId;
    const product = active.data.current.product;
    const toRowId = over.data?.current?.rowId;
    const overId = over.id;

    // Detect if the drop was on an empty slot
    const isOverEmptySlot =
      typeof overId === "string" && overId.startsWith("empty-");
    let emptySlotIndex = -1;
    if (isOverEmptySlot) {
      // El id es 'empty-<rowId>-<idx>'
      const parts = overId.split("-");
      emptySlotIndex = parseInt(parts[2], 10);
    }
    // If it's the same row, reorder products (including drop on empty slot)
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

    // If it's a new product from ProductList, add it to the category
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

    // Move between rows (including drop on empty slot)
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
  };

  return (
    <HomeView
      zoom={zoom}
      activeRow={activeRow}
      activeProduct={activeProduct}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    />
  );
}
