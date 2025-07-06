"use client";

import { cn } from "@/shared/lib/utils";
import type { Product } from "@/shared/types/grid";
import ProductCardAddButton from "./ProductCardAddButton";
import ProductCardDragHandle from "./ProductCardDragHandle";
import ProductCardImage from "./ProductCardImage";
import ProductCardInfo from "./ProductCardInfo";
import ProductCardRemoveButton from "./ProductCardRemoveButton";

type ProductCardProps = {
  product: Product;
  onAdd?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  isProductList?: boolean;
  dragProps: any;
};

function ProductCard({
  product,
  onAdd,
  onRemove,
  disabled = false,
  isProductList = false,
  dragProps,
}: ProductCardProps) {
  const style = dragProps.transform
    ? {
        transform: dragProps.transform
          ? `translate3d(${dragProps.transform.x}px, ${dragProps.transform.y}px, 0)`
          : undefined,
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
      <ProductCardDragHandle dragHandleProps={dragProps.dragHandleProps} />
      <div
        className={cn(
          "relative",
          isProductList
            ? "w-full h-[230px] min-w-[100px] group/image"
            : "w-[250px] h-[377px] group/image",
        )}
      >
        <ProductCardImage product={product} />
        {!isProductList && <ProductCardRemoveButton onRemove={onRemove} />}
      </div>
      <ProductCardInfo product={product} />
      {isProductList && (
        <ProductCardAddButton onAdd={onAdd} disabled={disabled} />
      )}
    </div>
  );
}

export default ProductCard;
