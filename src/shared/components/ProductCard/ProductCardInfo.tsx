import type { Product } from "@/shared/types/grid";

type ProductCardInfoProps = {
  product: Product;
};

function ProductCardInfo({ product }: ProductCardInfoProps) {
  return (
    <div className="mt-2 mb-2 ml-2">
      <h4 className="text-sm font-semibold">{product.name}</h4>
      <p className="text-xs text-muted-foreground">{product.price} €</p>
    </div>
  );
}

export default ProductCardInfo;
