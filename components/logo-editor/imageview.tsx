import React, { useRef, useEffect, useState } from 'react';
import { CutoutArea } from './cutout-area';
import { cn } from '@/lib/utils';

interface ImageViewProps {
  imageUrl: string;
  cutoutArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  onCutoutAreaChange: (area: { x: number; y: number; width: number; height: number }) => void;
  shape: 'rectangle' | 'circle';
  cornerRadius: number;
}

export function ImageView({
  imageUrl,
  cutoutArea,
  onCutoutAreaChange,
  shape,
  cornerRadius
}: ImageViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });

  // Scale factor between original and display size
  const scale = imageSize.width ? displaySize.width / imageSize.width : 1;

  // Convert original coordinates to display coordinates
  const toDisplayCoords = (rect: typeof cutoutArea) => ({
    x: rect.x * scale,
    y: rect.y * scale,
    width: rect.width * scale,
    height: rect.height * scale
  });

  // Convert display coordinates back to original coordinates
  const toOriginalCoords = (rect: typeof cutoutArea) => ({
    x: Math.round(rect.x / scale),
    y: Math.round(rect.y / scale),
    width: Math.round(rect.width / scale),
    height: Math.round(rect.height / scale)
  });

  // Update container size on mount and resize
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const padding = window.innerWidth >= 768 ? 64 : 32;
        setContainerSize({
          width: rect.width - padding,
          height: rect.height - padding
        });
      }
    };

    updateContainerSize();
    const resizeObserver = new ResizeObserver(updateContainerSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Get original image dimensions
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        setImageSize({
          width: img.width,
          height: img.height
        });
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  // Calculate display size whenever container or image size changes
  useEffect(() => {
    if (imageSize.width === 0 || containerSize.width === 0) return;

    const maxWidth = Math.min(800, containerSize.width);
    const maxHeight = containerSize.height;

    if (imageSize.width <= maxWidth && imageSize.height <= maxHeight) {
      setDisplaySize({
        width: imageSize.width,
        height: imageSize.height
      });
      return;
    }

    const aspectRatio = imageSize.width / imageSize.height;
    let newWidth = maxWidth;
    let newHeight = maxWidth / aspectRatio;

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = maxHeight * aspectRatio;
    }

    setDisplaySize({
      width: newWidth,
      height: newHeight
    });
  }, [containerSize, imageSize]);

  const handleCutoutChange = (newDisplayArea: typeof cutoutArea) => {
    onCutoutAreaChange(toOriginalCoords(newDisplayArea));
  };

  const displayCutoutArea = toDisplayCoords(cutoutArea);

  // Ensure cutout area stays within bounds
  useEffect(() => {
    if (displaySize.width === 0) return;

    const displayArea = toDisplayCoords(cutoutArea);

    // Constrain to display bounds
    const constrainedArea = {
      x: Math.max(0, Math.min(displayArea.x, displaySize.width - displayArea.width)),
      y: Math.max(0, Math.min(displayArea.y, displaySize.height - displayArea.height)),
      width: Math.min(displayArea.width, displaySize.width),
      height: Math.min(displayArea.height, displaySize.height)
    };

    // Convert back to original coordinates
    const newArea = toOriginalCoords(constrainedArea);

    // Only update if values have changed
    if (
      newArea.x !== cutoutArea.x ||
      newArea.y !== cutoutArea.y ||
      newArea.width !== cutoutArea.width ||
      newArea.height !== cutoutArea.height
    ) {
      onCutoutAreaChange(newArea);
    }
  }, [cutoutArea, displaySize, onCutoutAreaChange]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-auto p-4 md:p-8">
      {displaySize.width > 0 && (
        <div className="relative" style={{ width: `${displaySize.width}px`, height: `${displaySize.height + 100}px`, margin: 'auto' }}>
          <div
            className="relative select-none overflow-hidden"
            style={{
              width: `${displaySize.width}px`,
              height: `${displaySize.height}px`,
              margin: 'auto'
            }}
          >
            {/* Chessboard pattern background */}
            <div className={cn("absolute inset-0 w-full h-full z-0",
              "bg-[length:20px_20px]",
              "bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)]",
              "dark:bg-[linear-gradient(45deg,#374151_25%,transparent_25%,transparent_75%,#374151_75%,#374151),linear-gradient(45deg,#374151_25%,transparent_25%,transparent_75%,#374151_75%,#374151)]",
              "bg-[position:0_0,10px_10px]")} />

            <img
              src={imageUrl}
              alt="Selected"
              className="w-full h-full select-none pointer-events-none relative z-1"
              style={{
                objectFit: 'contain',
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
              draggable={false}
            />
            <CutoutArea
              x={displayCutoutArea.x}
              y={displayCutoutArea.y}
              width={displayCutoutArea.width}
              height={displayCutoutArea.height}
              containerWidth={displaySize.width}
              containerHeight={displaySize.height}
              onChange={handleCutoutChange}
              shape={shape}
              cornerRadius={cornerRadius}
            />
          </div>
        </div>
      )}
    </div>
  );
}