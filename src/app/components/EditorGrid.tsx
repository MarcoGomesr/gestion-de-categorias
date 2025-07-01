"use client";

import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addProductToRow,
  addRow,
  removeProductFromRow,
  reorderProductsInRow,
} from "@/store/slices/gridSlice";
import RowCard from "./RowCard";

export default function EditorGrid() {
  const rows = useAppSelector((state) => state.grid.rows);
  const dispatch = useAppDispatch();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active?.data?.current) return;

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

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          {rows.map((row) => (
            <SortableContext
              key={row.id}
              items={row.products.map((p) => p.id)}
              strategy={horizontalListSortingStrategy}
            >
              <RowCard row={row} />
            </SortableContext>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
