import type { Row } from "@/shared/types/grid";
import CategoryHeader from "./CategoryHeader";

function CategoryHeaderContainer({ id, alignment }: Row) {
  return <CategoryHeader id={id} alignment={alignment} />;
}

export default CategoryHeaderContainer;
