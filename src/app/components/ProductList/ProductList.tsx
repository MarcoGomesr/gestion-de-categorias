"use client";

import ProductCard from "@/shared/components/ProductCard";
import { fakeProducts } from "@/shared/data/FakeProducts";
import type { Row } from "@/shared/types/grid";

type ProductListProps = {
  rows: Row[];
  categoryProductIds: string;
};

export default function ProductList({
  rows,
  categoryProductIds,
}: ProductListProps) {

  

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white max-w-md">
      <h3 className="font-semibold mb-2">Lista de productos</h3>
      <div className="grid grid-cols-2 gap-4">
        {
          fakeProducts.map((product) => (
            <ProductCard
              key={`${product.id}-${categoryProductIds}`}
              product={product}
              isProductList
              rowId={rows[0]?.id}
              disabled={Boolean((rows[0]?.products ?? []).length >= 3)}
            />
          ))
        }
      </div>
    </div>
  )
}
