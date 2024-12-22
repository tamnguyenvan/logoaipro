'use client';
import React, { useState, useEffect } from 'react';
import { ImageView } from './imageview';
import ControlPanel from './control-panel';
import { Scissors, Trash2 } from 'lucide-react';

interface EditorProps {
  file: File | null;
  onClear?: () => void;
}

export default function LogoEditor({ file, onClear }: EditorProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number } | undefined>();
  const [cutoutArea, setCutoutArea] = useState({
    x: 100,
    y: 100,
    width: 200,
    height: 200
  });
  const [shape, setShape] = useState<'rectangle' | 'circle'>('rectangle');
  const [cornerRadius, setCornerRadius] = useState(0);
  const [crop, setCrop] = useState(false);

  const handleCutout = async () => {
    const img = new Image();
    img.src = imageUrl;
    await new Promise((resolve) => (img.onload = resolve));

    // Create main canvas for the image
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;

    // Draw original image
    ctx.drawImage(img, 0, 0);

    // Create mask canvas
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = img.width;
    maskCanvas.height = img.height;
    const maskCtx = maskCanvas.getContext('2d')!;

    // Create the mask shape
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    // Draw white shape for the cutout area
    maskCtx.fillStyle = 'white';
    maskCtx.beginPath();
    if (shape === 'circle') {
      const centerX = cutoutArea.x + cutoutArea.width / 2;
      const centerY = cutoutArea.y + cutoutArea.height / 2;
      const radiusX = cutoutArea.width / 2;
      const radiusY = cutoutArea.height / 2;
      maskCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    } else {
      if (cornerRadius > 0) {
        const radius = Math.min(cornerRadius, cutoutArea.width / 2, cutoutArea.height / 2);
        maskCtx.roundRect(
          cutoutArea.x,
          cutoutArea.y,
          cutoutArea.width,
          cutoutArea.height,
          radius
        );
      } else {
        maskCtx.rect(
          cutoutArea.x,
          cutoutArea.y,
          cutoutArea.width,
          cutoutArea.height
        );
      }
    }
    maskCtx.fill();

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);

    // Apply alpha mask while preserving original alpha
    for (let i = 0; i < imageData.data.length; i += 4) {
      // Original alpha value (0-255)
      const originalAlpha = imageData.data[i + 3];
      // Mask alpha value (using red channel, 0-255)
      const maskAlpha = maskData.data[i];
      // Final alpha is the minimum of original and mask alpha
      imageData.data[i + 3] = Math.min(originalAlpha, maskAlpha);
    }

    // Put modified image data back
    ctx.putImageData(imageData, 0, 0);

    // Crop image
    if (crop) {
      const cropX = cutoutArea.x;
      const cropY = cutoutArea.y;
      const cropWidth = cutoutArea.width;
      const cropHeight = cutoutArea.height;
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = cropWidth;
      cropCanvas.height = cropHeight;
      const cropCtx = cropCanvas.getContext('2d')!;
      cropCtx.drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      ctx.drawImage(cropCanvas, 0, 0);
    }

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Get original filename without extension
      const originalName = file?.name.replace(/\.[^/.]+$/, '');
      a.download = `${originalName}-LogoAIPro.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    // Get image dimensions
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageInfo({
        width: img.width,
        height: img.height
      });
    };

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="bg-muted/50 flex flex-col h-screen lg:flex-row relative">
      <ControlPanel
        cutoutArea={cutoutArea}
        onChange={(key, value) => {
          setCutoutArea(prev => ({ ...prev, [key]: value }));
        }}
        shape={shape}
        cornerRadius={cornerRadius}
        onShapeChange={setShape}
        onCornerRadiusChange={setCornerRadius}
        onCutout={handleCutout}
        onClear={onClear}
        onCropChange={setCrop}
        crop={crop}
        imageInfo={imageInfo}
      />
      <div className="h-[80vh] lg:h-screen lg:flex-1 lg:min-w-0">
        <ImageView 
          imageUrl={imageUrl} 
          cutoutArea={cutoutArea} 
          onCutoutAreaChange={setCutoutArea}
          shape={shape}
          cornerRadius={cornerRadius}
        />
      </div>

      {/* Float Action Buttons - Only visible on mobile */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3 lg:hidden">
        <button
          onClick={handleCutout}
          className="w-12 h-12 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors rounded-full shadow-lg flex items-center justify-center"
        >
          <Scissors size={24} strokeWidth={2.5} />
        </button>

        {onClear && (
          <button
            onClick={onClear}
            className="w-12 h-12 bg-card text-muted-foreground hover:bg-muted active:bg-muted/80 border border-border transition-colors rounded-full shadow-lg flex items-center justify-center"
          >
            <Trash2 size={24} />
          </button>
        )}
      </div>
    </div>
  );
}