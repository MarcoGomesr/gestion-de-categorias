"use client";

import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { addRow } from "@/shared/store/slices/gridSlice";
import CategoryList from "./CategoryList";

// Container component: handles state and logic, passes data/handlers as props
function CategoryListContainer() {
  const rows = useAppSelector((state) => state.grid.rows);
  const zoom = useAppSelector((state) => state.grid.zoom);
  const dispatch = useAppDispatch();
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Handler for adding a new category row
  function handleAddCategory() {
    dispatch(addRow());
  }

  return (
    <CategoryList
      rows={rows}
      zoom={zoom}
      onAddCategory={handleAddCategory}
      gridRef={gridRef}
    />
  );
}

export default CategoryListContainer;
