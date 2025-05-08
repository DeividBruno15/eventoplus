
import { useState } from "react";

interface VenueImageProps {
  imageUrl: string | null;
  title: string;
  imageUrls: string[];
}

export const VenueImage = ({ imageUrl, title, imageUrls }: VenueImageProps) => {
  const [selectedImage, setSelectedImage] = useState(imageUrls.length > 0 ? imageUrls[0] : null);
  
  // If there are no images, display a default/placeholder
  if (imageUrls.length === 0 && !imageUrl) {
    return (
      <div className="rounded-lg overflow-hidden bg-gray-100 h-64 flex items-center justify-center">
        <p className="text-gray-400">Nenhuma imagem disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main large image */}
      <div 
        className="rounded-lg overflow-hidden bg-cover bg-center h-96"
        style={{ 
          backgroundImage: `url(${selectedImage || imageUrl})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
        aria-label={title}
      />
      
      {/* Thumbnail gallery */}
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
              onClick={() => setSelectedImage(img)}
              role="button"
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
