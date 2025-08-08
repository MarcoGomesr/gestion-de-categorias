import type { HeaderProps } from "./CategoryHeader.types";
import MoveButton from "./MoveButton";
import RemoveButton from "./RemoveButton";
import TemplateSelector from "./TemplateSelector";

export default function CategoryHeader({ rowId, alignment }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        <MoveButton id={rowId} context="CategoryRow" data={{ rowId }} />
        <TemplateSelector rowId={rowId} alignment={alignment} />
      </div>
      <RemoveButton rowId={rowId} />
    </div>
  );
}
