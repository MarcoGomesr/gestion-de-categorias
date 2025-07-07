import type React from "react";
import MoveButton from "./MoveButton";
import RemoveButton from "./RemoveButton";
import TemplateSelector from "./TemplateSelector";

interface HeaderProps {
  rowId: string;
  alignment: string;
  showTemplateSelector: boolean;
  setShowTemplateSelector: (show: boolean) => void;
}

const CategoryHeader: React.FC<HeaderProps> = ({
  rowId,
  alignment,
  showTemplateSelector,
  setShowTemplateSelector,
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
    <RemoveButton rowId={rowId} />
  </div>
);

export default CategoryHeader;
