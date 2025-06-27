"use client";

import RowCard from "@/app/components/RowCard";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addRow, removeRow, setRowAlignment } from "@/store/slices/gridSlice";

export default function EditorGrid() {
  const rows = useAppSelector((state) => state.grid.rows);
  const dispatch = useAppDispatch();

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Editor de categorías</h2>
        <Button onClick={() => dispatch(addRow())}>➕ Añadir fila</Button>
      </div>

      <div className="space-y-6">
        {rows.map((row) => (
          <RowCard key={row.id} row={row} />
        ))}
      </div>
    </div>
  );
}
