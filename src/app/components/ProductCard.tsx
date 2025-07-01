import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { removeProductFromRow } from "@/store/slices/gridSlice";
import type { Product } from "@/types/grid";

interface Props {
  product: Product;
  rowId: string;
}

export default function ProductCard({ product, rowId }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: product.id,
    data: {
      rowId,
      product,
    },
  });

  const dispatch = useAppDispatch();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn(
        "w-[230px] h-[377px] cursor-grab relative group",
        "hover:shadow-md transition-all",
        isDragging ? "opacity-0" : "",
      )}
    >
      <button
        type="button"
        className="absolute top-2 right-2 z-10 bg-red-500 rounded-full p-1 w-7 h-7 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(removeProductFromRow({ rowId, productId: product.id }));
        }}
        aria-label="Remove product"
      >
        <X className="w-4 h-4 text-white" />
      </button>
      <div className="w-[230px] h-[377px]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          className="object-cover"
          fill
        />
      </div>
      <div className="mt-2">
        <h4 className="text-sm font-semibold">{product.name}</h4>
        <p className="text-xs text-muted-foreground">{product.price} €</p>
      </div>
    </div>
  );
}
