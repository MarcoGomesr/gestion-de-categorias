"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fakeProducts } from "@/data/FakeProducts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addProductToRow } from "@/store/slices/gridSlice";
import type { Product } from "@/types/grid";

export default function ProductLibrary() {
  const dispatch = useAppDispatch();
  const rows = useAppSelector((state) => state.grid.rows);

  const handleAddProduct = (product: Product) => {
    if (!rows.length) return alert("No hay filas disponibles.");
    const firstRowId = rows[0].id;
    dispatch(addProductToRow({ rowId: firstRowId, product }));
  };

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white max-w-md">
      <h3 className="font-semibold mb-2">Lista de productos</h3>

      <Label htmlFor="product" className="mb-2 text-xs">
        Buscar producto
      </Label>

      <Input placeholder="Camiseta..." id="producto" className="mb-2" />

      <div className="grid grid-cols-2 gap-4">
        {fakeProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-2 text-sm shadow-sm"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-20 object-cover rounded"
            />
            <div className="mt-1 font-medium">{product.name}</div>
            <div className="text-muted-foreground text-xs">
              {product.price} €
            </div>
            <Button
              className="mt-2 w-full"
              onClick={() => handleAddProduct(product)}
            >
              Añadir
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
