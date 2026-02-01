"use client";

import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { resetZoom, zoomIn, zoomOut } from "@/shared/store/slices/gridSlice";
import ZoomControls from "./ZoomControls";

export default function ZoomControlsContainer() {
  const zoom = useAppSelector((state) => state.grid.zoom);
  const rows = useAppSelector((state) => state.grid.rows);
  const dispatch = useAppDispatch();

  // Handlers for zoom actions
  function handleZoomIn() {
    dispatch(zoomIn());
  }

  function handleZoomOut() {
    dispatch(zoomOut());
  }

  function handleZoomReset() {
    dispatch(resetZoom());
  }

  return (
    <ZoomControls
      zoom={zoom}
      rows={rows}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onZoomReset={handleZoomReset}
    />
  );
}
