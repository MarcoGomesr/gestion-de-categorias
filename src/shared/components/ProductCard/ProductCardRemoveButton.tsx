import { X } from "lucide-react";

type ProductCardRemoveButtonProps = {
  onRemove?: () => void;
};

function ProductCardRemoveButton({ onRemove }: ProductCardRemoveButtonProps) {
  return (
    <button
      type="button"
      className="absolute top-2 right-2 z-20 pointer-events-auto bg-red-500 rounded-full p-1 w-7 h-7 flex items-center justify-center shadow opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-red-700 hover:cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        if (onRemove) onRemove();
      }}
      aria-label="Remove product"
    >
      <X className="w-4 h-4 text-white" />
    </button>
  );
}

export default ProductCardRemoveButton;
