"use client";
import type React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Tooltip, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { useAppDispatch } from "@/shared/store/hooks";
import { setRowAlignment } from "@/shared/store/slices/gridSlice";

interface TemplateSelectorProps {
  rowId: string;
  alignment: string;
  show: boolean;
  setShow: (show: boolean) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  rowId,
  alignment,
  show,
  setShow,
}) => {
  const dispatch = useAppDispatch();

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
        <span>
          <Button
            variant="outline"
            size="sm"
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
    </Tooltip>
  );
};

export default TemplateSelector;
