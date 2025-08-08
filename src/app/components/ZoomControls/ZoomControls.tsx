import { Minus, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { Row } from "@/shared/types/grid";

// Props for the presentational ZoomControls component
type ZoomControlsProps = {
  zoom: number;
  rows: Row[]; // Replace 'any' with your actual Row type
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
};

// Presentational component: receives all data and handlers as props
function ZoomControls({
  zoom,
  rows,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: ZoomControlsProps) {
  // Show only if there are categories
  if (rows.length === 0) return null;

  return (
    <div className="flex items-center gap-2" data-testid="zoom-controls">
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
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
        onClick={onZoomIn}
        aria-label="Zoom in"
      >
        <Plus className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomReset}
        aria-label="Reset zoom"
      >
        Reset
      </Button>
    </div>
  );
}

export default ZoomControls;
