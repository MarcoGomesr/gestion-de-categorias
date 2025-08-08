import CategoryHeader from "./CategoryHeader";
import type { HeaderProps } from "./CategoryHeader.types";

function CategoryHeaderContainer({ rowId, alignment }: HeaderProps) {
  return <CategoryHeader rowId={rowId} alignment={alignment} />;
}

export default CategoryHeaderContainer;
