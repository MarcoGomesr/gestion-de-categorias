"use client";

import { toast } from "sonner";

import { fakeProducts } from "@/data/FakeProducts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addProductToRow } from "@/store/slices/gridSlice";
import type { Product } from "@/types/grid";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const dispatch = useAppDispatch();
  const rows = useAppSelector((state) => state.grid.rows);

  const categoryProductIds = rows[0]?.products.map((p) => p.id).join("-") || "";

  const handleAddProduct = (product: Product) => {
    if (rows.length === 0) {
      toast.error("No hay categorías disponibles.");
      return;
    }
    const firstRowId = rows[0].id;
    dispatch(addProductToRow({ rowId: firstRowId, product, source: "click" }));
  };

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white max-w-md">
      <h3 className="font-semibold mb-2">Lista de productos</h3>

      <div className="grid grid-cols-2 gap-4">
        {fakeProducts.map((product) => (
          <ProductCard
            key={product.id + "-" + categoryProductIds}
            product={product}
            isProductList
            onAdd={() => handleAddProduct(product)}
            disabled={rows.length > 0 && rows[0].products.length >= 3}
          />
        ))}
      </div>
    </div>
  );
}
