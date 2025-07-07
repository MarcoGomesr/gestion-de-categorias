"use client";
import { Move } from "lucide-react";
import { Button } from "../ui/button";
import useIsClient from "./useIsClient";

type ProductCardDragHandleProps = {
  dragHandleProps: any;
};

/**
 * We use isClient to avoid hydration mismatches caused by dynamic attributes
 * (e.g., from drag & drop libraries like DnD Kit) that are only stable on the client.
 * Even though this is a Client Component ("use client"), the first render may still
 * differ between SSR and client if these attributes are included.
 */
function ProductCardDragHandle({
  dragHandleProps,
}: ProductCardDragHandleProps) {
  const isClient = useIsClient();
  return (
    <Button
      type="button"
      {...(isClient ? dragHandleProps : {})}
      className="absolute top-2 left-2 z-20 p-1 w-7 h-7 flex items-center justify-center cursor-grab pointer-events-auto bg-gray-100 rounded-full hover:bg-gray-200"
      size="icon"
      tabIndex={0}
      aria-label="Arrastrar para reordenar"
      title="Arrastrar para reordenar"
      onClick={(e) => e.stopPropagation()}
    >
      <Move className="w-4 h-4 text-black" />
    </Button>
  );
}

export default ProductCardDragHandle;
