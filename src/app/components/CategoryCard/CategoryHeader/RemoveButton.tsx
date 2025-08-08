import { Button } from "@/shared/components/ui/button";
import { useAppDispatch } from "@/shared/store/hooks";
import { removeRow } from "@/shared/store/slices/gridSlice";
import type { RowIdOnly } from "@/shared/types/grid";

const RemoveButton = ({ id }: RowIdOnly) => {
  const dispatch = useAppDispatch();
  return (
    <Button
      variant="destructive"
      onClick={(e) => {
        e.stopPropagation();
        dispatch(removeRow(id));
      }}
    >
      Eliminar Categoria
    </Button>
  );
};

export default RemoveButton;
