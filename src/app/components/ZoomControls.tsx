import { Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/store";
import { resetZoom, zoomIn, zoomOut } from "@/store/slices/gridSlice";

const ZoomControls: React.FC = () => {
  const zoom = useSelector((state: RootState) => state.grid.zoom);
  const rows = useSelector((state: RootState) => state.grid.rows);
  const dispatch = useDispatch();

  const handleZoomIn = () => dispatch(zoomIn());
  const handleZoomOut = () => dispatch(zoomOut());
  const handleZoomReset = () => dispatch(resetZoom());

  // No mostrar controles si no hay filas
  if (rows.length === 0) return null;

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomOut}
        aria-label="Zoom out"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <span className="w-12 text-center select-none">
        {Math.round(zoom * 100)}%
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomIn}
        aria-label="Zoom in"
      >
        <Plus className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomReset}
        aria-label="Reset zoom"
      >
        Reset
      </Button>
    </>
  );
};

export default ZoomControls;
