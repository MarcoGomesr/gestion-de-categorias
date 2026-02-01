"use client";
import { useAppSelector } from "@/shared/store/hooks";
import type { Product } from "@/shared/types/grid";
import ProductList from "./ProductList";

export default function ProductListContainer() {
  
    const rows = useAppSelector((state) => state.grid.rows);
  const categoryProductIds =
    rows[0]?.products?.map((p: Product) => p.id).join("-") || "";
    
    
  return <ProductList rows={rows} categoryProductIds={categoryProductIds} />;
}