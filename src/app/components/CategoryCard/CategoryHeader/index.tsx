import MoveButton from "./MoveButton";
import RemoveButton from "./RemoveButton";
import TemplateSelector from "./TemplateSelector";

type HeaderProps = {
  rowId: string;
  alignment: string;
};

const CategoryHeader: React.FC<HeaderProps> = ({ rowId, alignment }) => (
  <div className="flex justify-between items-center mb-3">
    <div className="flex items-center gap-2">
      <MoveButton id={rowId} context="CategoryRow" data={{ rowId }} />
      <TemplateSelector rowId={rowId} alignment={alignment} />
    </div>
    <RemoveButton rowId={rowId} />
  </div>
);

export default CategoryHeader;
