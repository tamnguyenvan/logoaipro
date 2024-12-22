'use client';

import { useState, useEffect } from 'react';
import WelcomeScreen from './welcome-screen';
import Editor from './workspace';
import { useSearchParams } from 'next/navigation';

export default function LogoEditor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('imageUrl');

  useEffect(() => {
    if (imageUrl) {
      // Fetch the image URL and set it as the selected file
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], 'image.jpg', { type: blob.type });
          setSelectedFile(file);
        })
        .catch((error) => {
          console.error('Error fetching image:', error);
        });
    }
  }, [imageUrl]);

  return (
    <section className="flex flex-col min-h-screen">
      {!selectedFile && <WelcomeScreen onFileSelect={setSelectedFile} />}
      {selectedFile && <Editor file={selectedFile} onClear={() => setSelectedFile(null)} />}
    </section>
  );
}