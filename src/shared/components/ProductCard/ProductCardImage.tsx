import Image from "next/image";
import type { Product } from "@/shared/types/grid";

type ProductCardImageProps = {
  product: Product;
};

function ProductCardImage({ product }: ProductCardImageProps) {
  return (
    <Image
      src={product.imageUrl}
      alt={product.name}
      fill
      sizes="(max-width: 768px) 100vw, 250px"
      priority
      className="object-cover rounded"
    />
  );
}

export default ProductCardImage;
