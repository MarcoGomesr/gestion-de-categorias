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
import type { Alignment, RowWithAlignment } from "@/shared/types/grid";

const TemplateSelector = ({ id, alignment }: RowWithAlignment) => {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);

  // Get the row from the store using id
  const row = useAppSelector((state) =>
    state.grid.rows.find((r) => r.id === id),
  );
  // Check if the category has products
  const hasProducts = (row?.products ?? []).length > 0;

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
                dispatch(setRowAlignment({ id, alignment: val as Alignment }))
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
            dispatch(setRowAlignment({ id, alignment: "left" }));
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
                dispatch(setRowAlignment({ id, alignment: "left" }));
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
