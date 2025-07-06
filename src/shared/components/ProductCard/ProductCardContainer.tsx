"use client";
import { useDragAndDrop } from "@/shared/hooks/useDragAndDrop";
import type { Product } from "@/shared/types/grid";
import ProductCard from "./ProductCard";

type ProductCardContainerProps = {
  product: Product;
  onAdd?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  rowId?: string;
  isProductList?: boolean;
};

function ProductCardContainer(props: ProductCardContainerProps) {
  const { product, rowId, isProductList = false } = props;
  const dragContext = isProductList ? "ProductList" : "CategoryCard";
  const dragData = isProductList
    ? { product, rowId }
    : { product, rowId, slotId: product.slotId };

  const dragProps = useDragAndDrop({
    id: product.id,
    context: dragContext,
    data: dragData,
  });

  return <ProductCard {...props} dragProps={dragProps} />;
}

export default ProductCardContainer;
