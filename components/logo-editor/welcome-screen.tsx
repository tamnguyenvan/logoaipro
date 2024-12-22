import React, { useCallback, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WelcomeScreenProps {
  onFileSelect: (file: File | null) => void;
}

export default function WelcomeScreen({ onFileSelect }: WelcomeScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    } else {
      onFileSelect(null);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    } else {
      onFileSelect(null);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Chỉ set isDragging = false khi rời khỏi vùng drop thực sự
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDragging(false);
    }
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={cn(
        "w-full flex flex-col items-center py-24 px-4 relative",
        "transition-colors duration-200",
        isDragging 
          ? "bg-primary/5 dark:bg-primary/10" 
          : "bg-gradient-to-b from-background to-muted/50"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {isDragging && (
        <div className="absolute inset-0 border-2 border-primary border-dashed rounded-lg flex items-center justify-center bg-primary/5 dark:bg-primary/10 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div className="text-primary text-2xl font-medium text-center">
              <div>Drop image here</div>
            </div>
          </div>
        </div>
      )}
      
      <div className={cn(
        "flex flex-col items-center justify-center max-w-6xl mx-auto w-full space-y-8",
        isDragging ? "opacity-50" : "opacity-100"
      )}>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground">
          Make{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Background Transparent</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-4 text-center max-w-2xl">
          Do you want to remove the background from your image but don&apos;t have Canva Pro? Use our free tool to create pixel-perfect transparent backgrounds.
          Perfect for logos, product shots, and more.
        </p>

        <div className="flex flex-col items-center mb-12 w-full max-w-md">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <Button 
            onClick={handleButtonClick}
            className="bg-blue-500 hover:bg-blue-600 text-white py-8 px-12 text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            <Plus className="mr-2 w-6 h-6" />
            Select images
          </Button>
          <p className="text-center text-muted-foreground mt-4 text-lg">
            or drop images here
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-16">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 bg-card border-2 border-violet-200 dark:border-violet-900 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center text-xl font-semibold mb-4 shadow-sm">1</div>
            <h3 className="text-lg font-medium text-foreground mb-2">Upload Image</h3>
            <p className="text-muted-foreground">Drop your image or click to upload. Support PNG, JPG, and WEBP up to 10MB</p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 bg-card border-2 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xl font-semibold mb-4 shadow-sm">2</div>
            <h3 className="text-lg font-medium text-foreground mb-2">Choose Shape</h3>
            <p className="text-muted-foreground">Select shape type and customize options for perfect results</p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 bg-card border-2 border-cyan-200 dark:border-cyan-900 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center text-xl font-semibold mb-4 shadow-sm">3</div>
            <h3 className="text-lg font-medium text-foreground mb-2">Boom! Download</h3>
            <p className="text-muted-foreground">Cut out image instantly and download with transparent background</p>
          </div>
        </div>
      </div>
    </div>
  );
}