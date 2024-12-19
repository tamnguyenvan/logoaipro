import { useState } from "react";

export const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadImage = async (imageId: string) => {
    try {
      setIsDownloading(true);
      const response = await fetch(`/api/logo/${imageId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to download image');
      }

      const blob = await response.blob();

      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'generated-logo.png';
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    downloadImage
  }
}