
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "lucide-react";

interface VenueImageProps {
  imageUrl: string | null;
  title: string;
  imageUrls: string[];
}

export const VenueImage = ({ imageUrl, title, imageUrls }: VenueImageProps) => {
  const [selectedImage, setSelectedImage] = useState(imageUrls.length > 0 ? imageUrls[0] : imageUrl);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Se não há imagens, exibir um placeholder
  if ((imageUrls.length === 0 && !imageUrl) || imageError) {
    return (
      <div className="rounded-lg overflow-hidden bg-gray-100 h-64 flex flex-col items-center justify-center">
        <Image className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-gray-400 text-sm">Nenhuma imagem disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Imagem principal grande */}
      <div className="relative rounded-lg overflow-hidden bg-cover bg-center h-96">
        {!imageLoaded && (
          <Skeleton className="absolute inset-0 z-0 w-full h-full" />
        )}
        <img
          src={selectedImage || imageUrl || ''}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      </div>
      
      {/* Galeria de miniaturas */}
      {imageUrls.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
          {imageUrls.map((img, index) => (
            <div
              key={index}
              className={`
                rounded cursor-pointer h-16 sm:h-20 bg-cover bg-center 
                ${selectedImage === img ? 'ring-2 ring-primary' : 'opacity-80 hover:opacity-100'}
              `}
              style={{ backgroundImage: `url(${img})` }}
              onClick={() => {
                setSelectedImage(img);
                setImageLoaded(false); // Reset loading state for main image
              }}
              role="button"
              aria-label={`Ver imagem ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
