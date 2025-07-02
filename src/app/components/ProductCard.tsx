import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { removeProductFromRow } from "@/store/slices/gridSlice";
import type { Product } from "@/types/grid";

interface ProductCardProps {
  product: Product;
  onAdd?: () => void;
  isDraggable?: boolean;
  onRemove?: () => void;
  categoryId?: string;
  disabled?: boolean;
}

export default function ProductCard({
  product,
  onAdd,
  isDraggable = false,
  onRemove,
  categoryId,
  disabled = false,
}: ProductCardProps) {
  const dispatch = useAppDispatch();

  // Always call useSortable, but only use its values if draggable
  const sortable = useSortable({
    id: product.slotId || product.id,
    data: { categoryId, product, slotId: product.slotId },
  });

  const style =
    isDraggable && sortable.transform
      ? {
          transform: CSS.Transform.toString(sortable.transform),
          transition: sortable.transition,
        }
      : undefined;

  return (
    <div
      ref={isDraggable ? sortable.setNodeRef : undefined}
      {...(isDraggable ? sortable.attributes : {})}
      style={style}
      className={cn(
        isDraggable
          ? "w-[250px] cursor-grab relative group hover:shadow-md transition-all"
          : onAdd
            ? "border rounded-lg p-2 text-sm shadow-sm"
            : "text-sm p-4",
        isDraggable && sortable.isDragging ? "opacity-0" : "",
      )}
    >
      {isDraggable && (
        <div
          {...sortable.listeners}
          className="absolute inset-0 cursor-grab"
          style={{ background: "transparent" }}
          tabIndex={-1}
        />
      )}
      <div
        className={cn(
          "relative",
          isDraggable
            ? "w-[250px] h-[377px] group/image"
            : "w-full h-[230px] min-w-[100px]",
        )}
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover rounded"
        />
        {isDraggable && (
          <button
            type="button"
            className="absolute top-2 right-2 z-20 pointer-events-auto bg-red-500 rounded-full p-1 w-7 h-7 flex items-center justify-center shadow opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-red-700"
            onClick={(e) => {
              e.stopPropagation();
              if (onRemove) {
                onRemove();
              } else if (categoryId) {
                dispatch(
                  removeProductFromRow({
                    rowId: categoryId,
                    productId: product.id,
                    slotId: product.slotId,
                  }),
                );
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
      {onAdd && !isDraggable && (
        <Button className="mt-2 w-full" onClick={onAdd} disabled={disabled}>
          Añadir
        </Button>
      )}
    </div>
  );
}
