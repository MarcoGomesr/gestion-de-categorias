import { Minus, Plus } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";

type ZoomControlsProps = {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
};

const ZoomControls: React.FC<ZoomControlsProps> = ({ zoom, setZoom }) => {
  const handleZoomIn = () =>
    setZoom((z) => Math.min(2, Math.round((z + 0.1) * 10) / 10));
  const handleZoomOut = () =>
    setZoom((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10));
  const handleZoomReset = () => setZoom(1);

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
