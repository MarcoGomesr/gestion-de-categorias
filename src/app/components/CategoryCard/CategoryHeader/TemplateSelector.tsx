"use client";
import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { setRowAlignment } from "@/shared/store/slices/gridSlice";

type TemplateSelectorProps = {
  rowId: string;
  alignment: string;
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  rowId,
  alignment,
}) => {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);

  // Get the row from the store using rowId
  const row = useAppSelector((state) =>
    state.grid.rows.find((r) => r.id === rowId),
  );
  // Check if the category has products
  const hasProducts = row.products.length > 0;

  useEffect(() => {
    if (!hasProducts && show) {
      setShow(false);
    }
  }, [hasProducts, show]);

  if (show) {
    return (
      <>
        <span className="text-sm text-muted-foreground">Plantilla:</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Select
              value={alignment}
              onValueChange={(val) =>
                dispatch(setRowAlignment({ rowId, alignment: val as any }))
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Izquierda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Derecha</SelectItem>
              </SelectContent>
            </Select>
          </TooltipTrigger>
        </Tooltip>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setShow(false);
            dispatch(setRowAlignment({ rowId, alignment: "" as string }));
          }}
        >
          Eliminar plantilla
        </Button>
      </>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={hasProducts ? -1 : 0}>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasProducts}
            onClick={(e) => {
              e.stopPropagation();
              if (!alignment) {
                dispatch(setRowAlignment({ rowId, alignment: "left" }));
              }
              setShow(true);
            }}
          >
            Añadir plantilla
          </Button>
        </span>
      </TooltipTrigger>
      {!hasProducts && (
        <TooltipContent className="text-center">
          Debes Agregar un producto
          <br />
          para habilitar la plantilla
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export default TemplateSelector;
