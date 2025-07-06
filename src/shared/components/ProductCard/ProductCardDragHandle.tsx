import { Move } from "lucide-react";

type ProductCardDragHandleProps = {
  dragHandleProps: any;
};

function ProductCardDragHandle({
  dragHandleProps,
}: ProductCardDragHandleProps) {
  return (
    <button
      type="button"
      {...dragHandleProps}
      className="absolute top-2 left-2 z-20 bg-gray-200 rounded-full p-1 w-7 h-7 flex items-center justify-center cursor-grab"
      style={{ pointerEvents: "auto" }}
      tabIndex={0}
      aria-label="Arrastrar para reordenar"
      title="Arrastrar para reordenar"
      onClick={(e) => e.stopPropagation()}
    >
      <Move className="w-4 h-4" />
    </button>
  );
}

export default ProductCardDragHandle;
