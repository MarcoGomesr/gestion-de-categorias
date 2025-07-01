import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import type { Alignment, Product, Row } from "@/types/grid";

export interface GridState {
  rows: Row[];
}

export const initialState: GridState = {
  rows: [],
};

const gridSlice = createSlice({
  name: "grid",
  initialState,
  reducers: {
    addRow: (state) => {
      state.rows.unshift({
        id: nanoid(),
        alignment: "left",
        products: [],
      });
    },
    removeRow: (state, action: PayloadAction<string>) => {
      state.rows = state.rows.filter((row) => row.id !== action.payload);
    },
    setRowAlignment: (
      state,
      action: PayloadAction<{ rowId: string; alignment: Alignment }>,
    ) => {
      const row = state.rows.find((r) => r.id === action.payload.rowId);
      if (row) row.alignment = action.payload.alignment;
    },
    addProductToRow: (
      state,
      action: PayloadAction<{ rowId: string; product: Product }>,
    ) => {
      const row = state.rows.find((r) => r.id === action.payload.rowId);
      if (row && row.products.length < 3) {
        const productWithSlot = { ...action.payload.product, slotId: nanoid() };
        row.products.push(productWithSlot);
      }
    },
    removeProductFromRow: (
      state,
      action: PayloadAction<{
        rowId: string;
        productId: string;
        slotId?: string;
      }>,
    ) => {
      const row = state.rows.find((r) => r.id === action.payload.rowId);
      if (row) {
        if (action.payload.slotId) {
          row.products = row.products.filter(
            (p) => p.slotId !== action.payload.slotId,
          );
        } else {
          row.products = row.products.filter(
            (p) => p.id !== action.payload.productId,
          );
        }
      }
    },
    reorderProductsInRow: (
      state,
      action: PayloadAction<{
        rowId: string;
        oldIndex: number;
        newIndex: number;
      }>,
    ) => {
      const row = state.rows.find((r) => r.id === action.payload.rowId);
      if (row) {
        const [moved] = row.products.splice(action.payload.oldIndex, 1);
        row.products.splice(action.payload.newIndex, 0, moved);
      }
    },
    reorderRows: (
      state,
      action: PayloadAction<{ oldIndex: number; newIndex: number }>,
    ) => {
      const [moved] = state.rows.splice(action.payload.oldIndex, 1);
      state.rows.splice(action.payload.newIndex, 0, moved);
    },
    hydrate: (state, action: PayloadAction<GridState>) => {
      return action.payload;
    },
  },
});

export const {
  addRow,
  removeRow,
  setRowAlignment,
  addProductToRow,
  removeProductFromRow,
  reorderProductsInRow,
  reorderRows,
  hydrate,
} = gridSlice.actions;

export default gridSlice.reducer;
