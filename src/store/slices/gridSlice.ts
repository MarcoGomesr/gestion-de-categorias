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
        if (row.products.length === 0) {
          row.alignment = "";
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
    reorderProductsBySlots: (
      state,
      action: PayloadAction<{ rowId: string; slotIds: string[] }>,
    ) => {
      const row = state.rows.find((r) => r.id === action.payload.rowId);
      if (row) {
        const newProducts: typeof row.products = [];
        action.payload.slotIds.forEach((slotId) => {
          const found = row.products.find((p) => (p.slotId || p.id) === slotId);
          if (found) newProducts.push(found);
        });
        row.products = newProducts;
      }
    },
    moveProductBetweenRows: (
      state,
      action: PayloadAction<{
        fromRowId: string;
        toRowId: string;
        product: Product;
        toIndex: number;
      }>,
    ) => {
      const { fromRowId, toRowId, product, toIndex } = action.payload;
      const fromRow = state.rows.find((r) => r.id === fromRowId);
      const toRow = state.rows.find((r) => r.id === toRowId);
      if (!fromRow || !toRow) return;
      // Elimina el producto de la fila original
      fromRow.products = fromRow.products.filter(
        (p) => (p.slotId || p.id) !== (product.slotId || product.id),
      );
      // Inserta el producto en la posición deseada de la nueva fila, con nuevo slotId
      const productWithSlot = { ...product, slotId: nanoid() };
      toRow.products.splice(toIndex, 0, productWithSlot);
    },
    moveProductInRow: (
      state,
      action: PayloadAction<{
        rowId: string;
        fromIndex: number;
        toIndex: number;
      }>,
    ) => {
      const { rowId, fromIndex, toIndex } = action.payload;
      const row = state.rows.find((r) => r.id === rowId);
      if (!row) return;
      const [moved] = row.products.splice(fromIndex, 1);
      row.products.splice(toIndex, 0, moved);
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
  reorderProductsBySlots,
  moveProductBetweenRows,
  moveProductInRow,
} = gridSlice.actions;

export default gridSlice.reducer;
