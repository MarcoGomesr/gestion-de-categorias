import { Button } from "@/shared/components/ui/button";

type ProductCardAddButtonProps = {
  onAdd?: () => void;
  disabled?: boolean;
};

function ProductCardAddButton({ onAdd, disabled }: ProductCardAddButtonProps) {
  return (
    <Button className="mt-2 w-full" onClick={onAdd} disabled={disabled}>
      Añadir
    </Button>
  );
}

export default ProductCardAddButton;
