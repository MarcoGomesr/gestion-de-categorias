import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import type { Alignment, Product, Row } from "@/types/grid";

interface GridState {
  rows: Row[];
}

const initialState: GridState = {
  rows: [],
};

const gridSlice = createSlice({
  name: "grid",
  initialState,
  reducers: {
    addRow: (state) => {
      state.rows.push({
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
        row.products.push(action.payload.product);
      }
    },
    removeProductFromRow: (
      state,
      action: PayloadAction<{ rowId: string; productId: string }>,
    ) => {
      const row = state.rows.find((r) => r.id === action.payload.rowId);
      if (row) {
        row.products = row.products.filter(
          (p) => p.id !== action.payload.productId,
        );
      }
    },
  },
});

export const {
  addRow,
  removeRow,
  setRowAlignment,
  addProductToRow,
  removeProductFromRow,
} = gridSlice.actions;

export default gridSlice.reducer;
