import { Button } from "@/shared/components/ui/button";
import { useAppDispatch } from "@/shared/store/hooks";
import { removeRow } from "@/shared/store/slices/gridSlice";

type RemoveButtonProps = {
  rowId: string;
};

function RemoveButton({ rowId }: RemoveButtonProps) {
  const dispatch = useAppDispatch();
  return (
    <Button
      variant="destructive"
      onClick={(e) => {
        e.stopPropagation();
        dispatch(removeRow(rowId));
      }}
    >
      Eliminar Categoria
    </Button>
  );
}

export default RemoveButton;
