import { configureStore } from "@reduxjs/toolkit";
import gridReducer from "./slices/gridSlice";

export const store = configureStore({
  reducer: {
    grid: gridReducer,
  },
});

// Guardar en localStorage cada vez que cambie el store
if (typeof window !== "undefined") {
  store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem("gridState", JSON.stringify(state.grid));
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
