import type { Row } from "@/shared/types/grid";
import MoveButton from "./MoveButton";
import RemoveButton from "./RemoveButton";
import TemplateSelector from "./TemplateSelector";

export default function CategoryHeader({ id, alignment }: Row) {
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        <MoveButton id={id} context="CategoryRow" data={{ rowId: id }} />
        <TemplateSelector id={id} alignment={alignment} />
      </div>
      <RemoveButton id={id} />
    </div>
  );
}
