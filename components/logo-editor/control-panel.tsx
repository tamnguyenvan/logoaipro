import { ImageIcon, Scissors, Trash2, Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface ControlPanelProps {
  cutoutArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  shape: 'rectangle' | 'circle';
  cornerRadius: number;
  imageInfo?: {
    width: number;
    height: number;
  };
  onChange: (key: string, value: number) => void;
  onShapeChange: (shape: 'rectangle' | 'circle') => void;
  onCornerRadiusChange: (value: number) => void;
  onCutout: () => void;
  onClear?: () => void;
  onCropChange: (value: boolean) => void;
  crop: boolean;
}

export default function ControlPanel({
  cutoutArea,
  shape,
  cornerRadius,
  imageInfo,
  onChange,
  onShapeChange,
  onCornerRadiusChange,
  onCutout,
  onClear,
  onCropChange,
  crop,
}: ControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(key, Number(e.target.value));
  };

  return (
    <>
      {/* Float Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-white/80 dark:bg-background/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 shadow-lg flex items-center justify-center lg:hidden hover:bg-white/90 dark:hover:bg-background/90 active:bg-white dark:active:bg-background transition-colors z-50 border border-gray-200 dark:border-gray-800"
      >
        <Settings2 size={24} />
      </button>

      {/* Overlay - Only visible on mobile when drawer is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Control Panel / Drawer */}
      <div className={`
        fixed lg:relative inset-y-0 right-0 w-[300px] lg:w-[360px] 
        bg-white dark:bg-background border-l border-t-0 dark:border-gray-800 flex flex-col h-full z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex-1 p-4 lg:p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 text-center">Cutout Options</h2>
            {imageInfo && (
              <div className="mt-2 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                <ImageIcon size={14} className="mr-1.5" />
                <span>{imageInfo.width} × {imageInfo.height}px</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Position and Size Controls */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Position & Size</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-1">
                  <Label htmlFor="x" className="text-xs font-medium text-gray-600 dark:text-gray-400">X Position (px)</Label>
                  <Input
                    id="x"
                    type="number"
                    value={cutoutArea.x}
                    onChange={handleChange('x')}
                    className="h-8 border-gray-200 dark:border-gray-800 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="y" className="text-xs font-medium text-gray-600 dark:text-gray-400">Y Position (px)</Label>
                  <Input
                    id="y"
                    type="number"
                    value={cutoutArea.y}
                    onChange={handleChange('y')}
                    className="h-8 border-gray-200 dark:border-gray-800 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="width" className="text-xs font-medium text-gray-600 dark:text-gray-400">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={cutoutArea.width}
                    onChange={handleChange('width')}
                    className="h-8 border-gray-200 dark:border-gray-800 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="height" className="text-xs font-medium text-gray-600 dark:text-gray-400">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={cutoutArea.height}
                    onChange={handleChange('height')}
                    className="h-8 border-gray-200 dark:border-gray-800 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Shape Selection */}
            <div className="space-y-3">
              <div className="pb-1.5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Shape</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onShapeChange('rectangle')}
                  className={`flex items-center justify-center rounded-md border-2 p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors ${
                    shape === 'rectangle' 
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/50' 
                      : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
                  }`}
                >
                  <div className="w-5 h-5 border-2 border-current" />
                  <span className="ml-2 text-xs font-medium">Rectangle</span>
                </button>

                <button
                  onClick={() => onShapeChange('circle')}
                  className={`flex items-center justify-center rounded-md border-2 p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors ${
                    shape === 'circle' 
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/50' 
                      : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border-2 border-current" />
                  <span className="ml-2 text-xs font-medium">Circle</span>
                </button>
              </div>
            </div>

            {/* Crop to Selection */}
            <div className="space-y-3">
              <div className="pb-1.5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Output Options</h3>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="crop" className="text-sm text-gray-700 dark:text-gray-300">Crop to Selection</Label>
                <Switch
                  id="crop"
                  checked={crop}
                  onCheckedChange={onCropChange}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>

            {/* Corner Radius (only for rectangle) */}
            {shape === 'rectangle' && (
              <div className="space-y-4">
                <div className="pb-2 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Corner Radius</h3>
                </div>
                <div className="space-y-1">
                  <Input
                    id="cornerRadius"
                    type="number"
                    min="0"
                    value={cornerRadius}
                    onChange={(e) => onCornerRadiusChange(Number(e.target.value))}
                    className="h-8 border-gray-200 dark:border-gray-800 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Only visible on desktop */}
          <div className="hidden lg:block space-y-4">
            <button
              onClick={onCutout}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors h-12 px-6 rounded-md text-base font-medium flex items-center justify-center space-x-3 shadow-sm"
            >
              <Scissors size={20} strokeWidth={2.5} />
              <span>Cut out Image</span>
            </button>

            {onClear && (
              <button
                onClick={onClear}
                className="w-full bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 border border-gray-300 dark:border-gray-700 transition-colors h-12 px-6 rounded-md text-base font-medium flex items-center justify-center space-x-3"
              >
                <Trash2 size={20} />
                <span>Clear Image</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}