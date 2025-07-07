"use client";

import { cn } from "@/shared/lib/utils";
import type { Product } from "@/shared/types/grid";
import ProductCardAddButton from "./ProductCardAddButton";
import ProductCardDragHandle from "./ProductCardDragHandle";
import ProductCardImage from "./ProductCardImage";
import ProductCardInfo from "./ProductCardInfo";
import ProductCardRemoveButton from "./ProductCardRemoveButton";
import useIsClient from "./useIsClient";

type ProductCardProps = {
  product: Product;
  onAdd?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  isProductList?: boolean;
  dragProps: any;
};

/**
 * We use isClient to avoid hydration mismatches caused by dynamic attributes
 * (e.g., from drag & drop libraries like DnD Kit) that are only stable on the client.
 * Even though this is a Client Component ("use client"), the first render may still
 * differ between SSR and client if these attributes are included.
 */
function ProductCard({
  product,
  onAdd,
  onRemove,
  disabled = false,
  isProductList = false,
  dragProps,
}: ProductCardProps) {
  const isClient = useIsClient();
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
      {...(isClient ? dragProps.attributes : {})}
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
