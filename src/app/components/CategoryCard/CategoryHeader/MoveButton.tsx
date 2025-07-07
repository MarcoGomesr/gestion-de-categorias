import { Move } from "lucide-react";
import type React from "react";
import { useDragAndDrop } from "@/shared/hooks/useDragAndDrop";

type MoveButtonProps = {
  id: string;
  context?: "CategoryRow"; // optional, defaults to 'CategoryRow' if not provided
  data?: any;
};

const MoveButton: React.FC<MoveButtonProps> = ({
  id,
  context = "CategoryRow",
  data,
}) => {
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
};

export default MoveButton;
