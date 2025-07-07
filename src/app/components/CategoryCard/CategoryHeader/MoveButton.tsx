import { Move } from "lucide-react";
import type React from "react";
import { Button } from "@/shared/components/ui/button";
import type { UseDragAndDropProps } from "@/shared/hooks/useDragAndDrop";
import { useDragAndDrop } from "@/shared/hooks/useDragAndDrop";

type MoveButtonProps = {
  id: string;
  context?: "CategoryRow";
  data?: UseDragAndDropProps["data"];
};

const MoveButton: React.FC<MoveButtonProps> = ({
  id,
  context = "CategoryRow",
  data,
}) => {
  const dragProps = useDragAndDrop({ id, context, data });

  return (
    <Button
      type="button"
      {...dragProps.dragHandleProps}
      className="inline-flex w-7 h-7 cursor-grab p-1 mr-2 select-none bg-gray-100 rounded-full hover:bg-gray-200"
      variant="ghost"
      size="icon"
      title="Mover Categoria"
      tabIndex={0}
      onClick={(e) => e.stopPropagation()}
    >
      <Move className="w-4 h-4" />
    </Button>
  );
};

export default MoveButton;
