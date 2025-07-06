import { Move } from "lucide-react";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";

interface MoveButtonProps {
  id: string;
  context: "CategoryRow" | "CategoryCard" | "ProductList";
  data?: any;
}

function MoveButton({ id, context, data }: MoveButtonProps) {
  const dragProps = useDragAndDrop({ id, context, data });

  return (
    <button
      type="button"
      {...dragProps.dragHandleProps}
      className="cursor-grab p-1 mr-2 select-none bg-gray-100 rounded hover:bg-gray-200"
      style={{ display: "inline-flex" }}
      title="Mover Categoria"
      tabIndex={0}
      onClick={(e) => e.stopPropagation()}
    >
      <Move className="w-4 h-4" />
    </button>
  );
}

export default MoveButton;
