import React, { useState, useCallback } from 'react';

interface CutoutAreaProps {
  x: number;
  y: number;
  width: number;
  height: number;
  containerWidth: number;
  containerHeight: number;
  onChange: (values: { x: number; y: number; width: number; height: number }) => void;
  shape: 'rectangle' | 'circle';
  cornerRadius: number;
}

type HandlePosition = 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left';

export function CutoutArea({ x, y, width, height, containerWidth, containerHeight, onChange, shape, cornerRadius }: CutoutAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<HandlePosition | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startRect, setStartRect] = useState({ x, y, width, height });

  const constrainRect = (rect: { x: number; y: number; width: number; height: number }) => {
    let newRect = { ...rect };

    // Minimum size in display coordinates (20px)
    const minSize = 20;

    // Constrain width and height to minimum size
    newRect.width = Math.max(minSize, newRect.width);
    newRect.height = Math.max(minSize, newRect.height);

    // Constrain position to container bounds
    newRect.x = Math.max(0, Math.min(newRect.x, containerWidth - newRect.width));
    newRect.y = Math.max(0, Math.min(newRect.y, containerHeight - newRect.height));

    // Constrain width and height to container
    newRect.width = Math.min(newRect.width, containerWidth - newRect.x);
    newRect.height = Math.min(newRect.height, containerHeight - newRect.y);

    return newRect;
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartRect({ x, y, width, height });
  }, [x, y, width, height]);

  const handleResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement>, position: HandlePosition) => {
    e.stopPropagation();
    setIsResizing(position);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartRect({ x, y, width, height });
  }, [x, y, width, height]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return;

    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    if (isDragging) {
      const newRect = constrainRect({
        x: startRect.x + dx,
        y: startRect.y + dy,
        width,
        height
      });
      onChange(newRect);
    } else if (isResizing) {
      let newRect = { ...startRect };

      switch (isResizing) {
        case 'top-left':
          newRect.x = startRect.x + dx;
          newRect.y = startRect.y + dy;
          newRect.width = startRect.width - dx;
          newRect.height = startRect.height - dy;
          break;
        case 'top':
          newRect.y = startRect.y + dy;
          newRect.height = startRect.height - dy;
          break;
        case 'top-right':
          newRect.y = startRect.y + dy;
          newRect.width = startRect.width + dx;
          newRect.height = startRect.height - dy;
          break;
        case 'right':
          newRect.width = startRect.width + dx;
          break;
        case 'bottom-right':
          newRect.width = startRect.width + dx;
          newRect.height = startRect.height + dy;
          break;
        case 'bottom':
          newRect.height = startRect.height + dy;
          break;
        case 'bottom-left':
          newRect.x = startRect.x + dx;
          newRect.width = startRect.width - dx;
          newRect.height = startRect.height + dy;
          break;
        case 'left':
          newRect.x = startRect.x + dx;
          newRect.width = startRect.width - dx;
          break;
      }

      onChange(constrainRect(newRect));
    }
  }, [isDragging, isResizing, startPos, startRect, width, height, onChange, constrainRect]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(null);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleStyle = "w-3 h-3 bg-white border-2 border-blue-500 rounded-full absolute select-none";
  
  return (
    <div
      className="absolute border-2 border-white/80 cursor-move select-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="w-full h-full" 
        style={{ 
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          borderRadius: shape === 'circle' ? '50%' : `${cornerRadius}px`
        }} 
      />
      <div className={`${handleStyle} -top-1.5 -left-1.5 cursor-nw-resize`} onMouseDown={(e) => handleResizeStart(e, 'top-left')} />
      <div className={`${handleStyle} -top-1.5 left-1/2 -translate-x-1/2 cursor-n-resize`} onMouseDown={(e) => handleResizeStart(e, 'top')} />
      <div className={`${handleStyle} -top-1.5 -right-1.5 cursor-ne-resize`} onMouseDown={(e) => handleResizeStart(e, 'top-right')} />
      <div className={`${handleStyle} top-1/2 -right-1.5 -translate-y-1/2 cursor-e-resize`} onMouseDown={(e) => handleResizeStart(e, 'right')} />
      <div className={`${handleStyle} -bottom-1.5 -right-1.5 cursor-se-resize`} onMouseDown={(e) => handleResizeStart(e, 'bottom-right')} />
      <div className={`${handleStyle} -bottom-1.5 left-1/2 -translate-x-1/2 cursor-s-resize`} onMouseDown={(e) => handleResizeStart(e, 'bottom')} />
      <div className={`${handleStyle} -bottom-1.5 -left-1.5 cursor-sw-resize`} onMouseDown={(e) => handleResizeStart(e, 'bottom-left')} />
      <div className={`${handleStyle} top-1/2 -left-1.5 -translate-y-1/2 cursor-w-resize`} onMouseDown={(e) => handleResizeStart(e, 'left')} />
    </div>
  );
}