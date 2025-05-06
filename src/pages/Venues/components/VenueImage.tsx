
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VenueImageProps {
  imageUrl: string | null;
  title: string;
  imageUrls?: string[]; // Array de URLs de imagens
}

export const VenueImage = ({ imageUrl, title, imageUrls = [] }: VenueImageProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Preparar array de imagens - usar imageUrls se fornecido, ou imageUrl como único item
  const images = imageUrls?.length > 0 ? imageUrls : (imageUrl ? [imageUrl] : []);
  
  if (!images.length) {
    return (
      <div className="rounded-lg overflow-hidden h-80 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">Sem imagens disponíveis</p>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative rounded-lg overflow-hidden h-80 bg-gray-100">
      <img
        src={images[currentImageIndex]}
        alt={`${title} - Imagem ${currentImageIndex + 1}`}
        className="w-full h-full object-cover"
      />
      
      {/* Mostrar controles apenas se houver múltiplas imagens */}
      {images.length > 1 && (
        <>
          <div className="absolute inset-0 flex items-center justify-between px-2">
            <button
              onClick={prevImage}
              className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-colors",
                  currentImageIndex === index ? "bg-white" : "bg-white/50"
                )}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
