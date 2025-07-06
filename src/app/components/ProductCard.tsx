"use client";
import { CSS } from "@dnd-kit/utilities";
import { Move, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { useDragAndDrop } from "@/shared/hooks/useDragAndDrop";
import { cn } from "@/shared/lib/utils";
import type { Product } from "@/shared/types/grid";

type ProductCardProps = {
  product: Product;
  onAdd?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  rowId?: string;
  isProductList?: boolean;
};

export default function ProductCard({
  product,
  onAdd,
  onRemove,
  disabled = false,
  rowId,
  isProductList = false,
}: ProductCardProps) {
  const dragContext = isProductList ? "ProductList" : "CategoryCard";
  const dragData = isProductList
    ? { product, rowId }
    : { product, rowId, slotId: product.slotId };

  const dragProps = useDragAndDrop({
    id: product.id,
    context: dragContext,
    data: dragData,
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
      <button
        type="button"
        {...dragProps.dragHandleProps}
        className="absolute top-2 left-2 z-20 bg-gray-200 rounded-full p-1 w-7 h-7 flex items-center justify-center cursor-grab"
        style={{ pointerEvents: "auto" }}
        tabIndex={0}
        aria-label="Arrastrar para reordenar"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Move className="w-4 h-4" />
      </button>
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
          sizes="(max-width: 768px) 100vw, 250px"
          priority
          className="object-cover rounded"
        />
        {!isProductList && (
          <button
            type="button"
            className="absolute top-2 right-2 z-20 pointer-events-auto bg-red-500 rounded-full p-1 w-7 h-7 flex items-center justify-center shadow opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-red-700 hover:cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (onRemove) {
                onRemove();
              }
            }}
            aria-label="Remove product"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
      <div className="mt-2 mb-2 ml-2">
        <h4 className="text-sm font-semibold">{product.name}</h4>
        <p className="text-xs text-muted-foreground">{product.price} €</p>
      </div>
      {/* Only show add button if it is ProductList */}
      {isProductList && (
        <Button className="mt-2 w-full" onClick={onAdd} disabled={disabled}>
          Añadir
        </Button>
      )}
    </div>
  );
}
