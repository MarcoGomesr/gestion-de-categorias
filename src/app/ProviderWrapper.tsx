"use client";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/shared/store";
import { hydrate } from "@/shared/store/slices/gridSlice";

export default function ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const persisted = localStorage.getItem("gridState");
    if (persisted) {
      store.dispatch(hydrate(JSON.parse(persisted)));
    }
  }, []);
  return <Provider store={store}>{children}</Provider>;
}
