import { CSS } from "@dnd-kit/utilities";
import { Move, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/grid";

interface ProductCardProps {
  product: Product;
  onAdd?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  rowId?: string;
  isProductList?: boolean;
}

export default function ProductCard({
  product,
  onAdd,
  onRemove,
  disabled = false,
  rowId,
  isProductList = false,
}: ProductCardProps) {
  // Log de depuración de props
  console.log("[ProductCard] Render", { product, rowId, isProductList });

  // Usar el hook unificado para drag & drop
  const dragContext = isProductList ? "ProductList" : "CategoryCard";
  const dragProps = useDragAndDrop({
    id: product.id,
    context: dragContext,
    data: { product, rowId, slotId: product.slotId },
  });

  const style = dragProps.transform
    ? {
        transform: CSS.Transform.toString(dragProps.transform),
        transition: dragProps.transition,
      }
    : undefined;

  return (
    <div
      ref={dragProps.setNodeRef}
      {...dragProps.attributes}
      style={style}
      className={cn(
        "relative group hover:shadow-md transition-all bg-white",
        isProductList ? "" : "w-[250px]",
        dragProps.isDragging ? "opacity-0" : "",
      )}
    >
      {/* Drag handle siempre visible, sin tooltip */}
      <Button
        variant="ghost"
        {...dragProps.dragHandleProps}
        className="absolute top-2 left-2 z-20 p-1 bg-gray-200 rounded-full cursor-grab"
        style={{ pointerEvents: "auto" }}
        tabIndex={0}
        aria-label="Arrastrar para reordenar"
        onClick={(e) => {
          e.stopPropagation();
          // Log de depuración del botón de mover
          console.log("[ProductCard] Click en mover", {
            isProductList,
            dragHandleProps: dragProps.dragHandleProps,
            product,
            rowId,
          });
        }}
      >
        <Move className="w-4 h-4" />
      </Button>
      <div
        className={cn(
          "relative",
          isProductList
            ? "w-full h-[230px] min-w-[100px] group/image"
            : "w-[250px] h-[377px] group/image",
        )}
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover rounded"
        />
        {/* Solo mostrar botón eliminar si NO es ProductList */}
        {!isProductList && (
          <Button
            variant="ghost"
            className="absolute top-2 right-2 z-20 pointer-events-auto bg-red-500 rounded-full p-1 w-7 h-7 flex items-center justify-center shadow opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-red-700"
            onClick={(e) => {
              e.stopPropagation();
              if (onRemove) {
                onRemove();
              }
            }}
            aria-label="Remove product"
          >
            <X className="w-4 h-4 text-white" />
          </Button>
        )}
      </div>
      <div className="mt-2 mb-2 ml-2">
        <h4 className="text-sm font-semibold">{product.name}</h4>
        <p className="text-xs text-muted-foreground">{product.price} €</p>
      </div>
      {/* Solo mostrar botón añadir si es ProductList */}
      {isProductList && (
        <Button className="mt-2 w-full" onClick={onAdd} disabled={disabled}>
          Añadir
        </Button>
      )}
    </div>
  );
}
