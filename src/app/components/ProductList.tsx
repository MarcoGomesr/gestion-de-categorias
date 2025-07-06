"use client";

import ProductCard from "@/shared/components/ProductCard";
import { fakeProducts } from "@/shared/data/FakeProducts";
import { useAppSelector } from "@/shared/store/hooks";
import type { Product } from "@/shared/types/grid";

export default function ProductList() {
  const rows = useAppSelector((state) => state.grid.rows);
  const categoryProductIds =
    rows[0]?.products.map((p: Product) => p.id).join("-") || "";

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white max-w-md">
      <h3 className="font-semibold mb-2">Lista de productos</h3>
      <div className="grid grid-cols-2 gap-4">
        {fakeProducts.map((product) => (
          <ProductCard
            key={`${product.id}-${categoryProductIds}`}
            product={product}
            isProductList
            rowId={rows[0]?.id}
            disabled={rows[0]?.products.length >= 3}
          />
        ))}
      </div>
    </div>
  );
}
