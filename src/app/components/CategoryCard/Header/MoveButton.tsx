import { Move } from "lucide-react";
import type React from "react";

interface MoveButtonProps {
  onMove: (e: React.MouseEvent) => void;
}

const MoveButton: React.FC<MoveButtonProps> = ({ onMove }) => (
  <button
    type="button"
    onClick={onMove}
    className="cursor-grab p-1 mr-2 select-none bg-gray-100 rounded hover:bg-gray-200"
    style={{ display: "inline-flex" }}
    title="Mover Categoria"
    tabIndex={0}
  >
    <Move className="w-4 h-4" />
  </button>
);

export default MoveButton;
