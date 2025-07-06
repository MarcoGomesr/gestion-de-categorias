import type React from "react";
import { Button } from "@/shared/components/ui/button";
import MoveButton from "./MoveButton";
import TemplateSelector from "./TemplateSelector";

interface HeaderProps {
  rowId: string;
  alignment: string;
  showTemplateSelector: boolean;
  setShowTemplateSelector: (show: boolean) => void;
  onRemove: (e: React.MouseEvent) => void;
}

const CategoryHeader: React.FC<HeaderProps> = ({
  rowId,
  alignment,
  showTemplateSelector,
  setShowTemplateSelector,
  onRemove,
}) => (
  <div className="flex justify-between items-center mb-3">
    <div className="flex items-center gap-2">
      <MoveButton id={rowId} context="CategoryRow" data={{ rowId }} />
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

export default CategoryHeader;
