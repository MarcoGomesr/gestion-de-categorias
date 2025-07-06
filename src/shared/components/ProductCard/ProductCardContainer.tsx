"use client";
import { useDragAndDrop } from "@/shared/hooks/useDragAndDrop";
import { useAppDispatch } from "@/shared/store/hooks";
import { removeProductFromRow } from "@/shared/store/slices/gridSlice";
import type { Product } from "@/shared/types/grid";
import ProductCard from "./ProductCard";

type ProductCardContainerProps = {
  product: Product;
  rowId?: string;
  slotId?: string;
  onAdd?: () => void;
  disabled?: boolean;
  isProductList?: boolean;
};

function ProductCardContainer({
  product,
  rowId,
  slotId,
  onAdd,
  disabled,
  isProductList = false,
}: ProductCardContainerProps) {
  const dispatch = useAppDispatch();
  const handleRemove = () => {
    if (rowId) {
      dispatch(removeProductFromRow({ rowId, productId: product.id, slotId }));
    }
  };
  const dragContext = isProductList ? "ProductList" : "CategoryCard";
  const dragData = isProductList
    ? { product, rowId }
    : { product, rowId, slotId };

  const dragProps = useDragAndDrop({
    id: product.id,
    context: dragContext,
    data: dragData,
  });

  return (
    <ProductCard
      product={product}
      onAdd={onAdd}
      onRemove={handleRemove}
      disabled={disabled}
      isProductList={isProductList}
      dragProps={dragProps}
    />
  );
}

export default ProductCardContainer;
