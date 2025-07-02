import { useDroppable } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { Move } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppDispatch } from "@/store/hooks";
import { removeRow, setRowAlignment } from "@/store/slices/gridSlice";
import type { Row } from "@/types/grid";
import ProductCard from "./ProductCard";

interface Props {
  row: Row;
}

export default function CategoryCard({ row }: Props) {
  const dispatch = useAppDispatch();
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: row.id,
    data: { rowId: row.id },
  });
  const {
    setNodeRef: setSortableRef,
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: row.id,
    data: { rowId: row.id },
  });
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Combina refs para sortable y droppable
  const setCombinedRef = (node: HTMLElement | null) => {
    setDroppableRef(node);
    setSortableRef(node);
  };

  // Lógica para mapear productos a slots según la alineación
  function getSlotIndexes(alignment: string, numProducts: number) {
    if (numProducts === 0) return [null, null, null];
    if (numProducts === 1) {
      switch (alignment) {
        case "center":
          return [null, 0, null];
        case "right":
          return [null, null, 0];
        default:
          return [0, null, null];
      }
    }
    if (numProducts === 2) {
      switch (alignment) {
        case "center":
          return [null, 0, 1];
        case "right":
          return [null, 0, 1];
        default:
          return [0, 1, null];
      }
    }
    // 3 productos
    return [0, 1, 2];
  }

  const slotIndexes = getSlotIndexes(row.alignment, row.products.length);
  const slotIds = slotIndexes.map((productIdx, idx) =>
    productIdx !== null
      ? row.products[productIdx]?.id
      : `empty-${row.id}-${idx}`,
  );

  return (
    <div
      ref={setCombinedRef}
      style={{
        transition,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.5 : 1,
      }}
      className={`border rounded-xl p-4 shadow-sm bg-white`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab p-1 mr-2 select-none bg-gray-100 rounded hover:bg-gray-200"
            style={{ display: "inline-flex" }}
            title="Mover fila"
            tabIndex={0}
          >
            <Move className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            {showTemplateSelector ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Plantilla:
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Select
                      value={row.alignment}
                      onValueChange={(val) =>
                        dispatch(
                          setRowAlignment({
                            rowId: row.id,
                            alignment: val as any,
                          }),
                        )
                      }
                    >
                      <SelectTrigger
                        className="w-[120px]"
                        disabled={row.products.length === 0}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Izquierda</SelectItem>
                        <SelectItem value="center">Centro</SelectItem>
                        <SelectItem value="right">Derecha</SelectItem>
                      </SelectContent>
                    </Select>
                  </TooltipTrigger>
                  {row.products.length === 0 && (
                    <TooltipContent sideOffset={8}>
                      Agrega al menos un producto para poder alinear la fila
                    </TooltipContent>
                  )}
                </Tooltip>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTemplateSelector(false);
                    dispatch(
                      setRowAlignment({ rowId: row.id, alignment: "" as any }),
                    );
                  }}
                  disabled={row.products.length === 0}
                >
                  Eliminar plantilla
                </Button>
              </>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!row.alignment) {
                          dispatch(
                            setRowAlignment({
                              rowId: row.id,
                              alignment: "left",
                            }),
                          );
                        }
                        setShowTemplateSelector(true);
                      }}
                      disabled={row.products.length === 0}
                    >
                      Añadir plantilla
                    </Button>
                  </span>
                </TooltipTrigger>
                {row.products.length === 0 && (
                  <TooltipContent sideOffset={8}>
                    Agrega un producto
                    <br />
                    para asociar una plantilla
                  </TooltipContent>
                )}
              </Tooltip>
            )}
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(removeRow(row.id));
          }}
        >
          Eliminar fila
        </Button>
      </div>

      <SortableContext items={slotIds} strategy={horizontalListSortingStrategy}>
        <div
          className={`grid grid-cols-3 gap-6  w-full p-6 border-2 border-dashed border-gray-400 rounded-xl min-h-[320px] bg-gray-50`}
          style={{ transition: "background 0.2s, border 0.2s" }}
        >
          {slotIndexes.map((productIdx, idx) =>
            productIdx !== null && row.products[productIdx] ? (
              <ProductCard
                key={row.products[productIdx].slotId}
                product={row.products[productIdx]}
                categoryId={row.id}
                isDraggable
              />
            ) : (
              <div
                key={slotIds[idx]}
                data-id={slotIds[idx]}
                className="w-[250px] h-[377px] rounded bg-gray-100 border border-dashed border-gray-300 opacity-50"
              />
            ),
          )}
        </div>
      </SortableContext>
    </div>
  );
}
