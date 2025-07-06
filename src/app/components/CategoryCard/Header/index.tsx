import type React from "react";
import { Button } from "@/components/ui/button";
import MoveButton from "./MoveButton";
import TemplateSelector from "./TemplateSelector";

interface HeaderProps {
  rowId: string;
  alignment: string;
  showTemplateSelector: boolean;
  setShowTemplateSelector: (show: boolean) => void;
  onMove: (e: React.MouseEvent) => void;
  onRemove: (e: React.MouseEvent) => void;
}

const Header: React.FC<HeaderProps> = ({
  rowId,
  alignment,
  showTemplateSelector,
  setShowTemplateSelector,
  onMove,
  onRemove,
}) => (
  <div className="flex justify-between items-center mb-3">
    <div className="flex items-center gap-2">
      <MoveButton onMove={onMove} />
      <TemplateSelector
        rowId={rowId}
        alignment={alignment}
        show={showTemplateSelector}
        setShow={setShowTemplateSelector}
      />
    </div>
    <Button variant="destructive" onClick={onRemove}>
      Eliminar fila
    </Button>
  </div>
);

export default Header;
