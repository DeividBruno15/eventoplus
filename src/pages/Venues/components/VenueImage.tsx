
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VenueImageProps {
  imageUrl: string | null;
  title: string;
  imageUrls?: string[];
}

export const VenueImage = ({
  imageUrl,
  title,
  imageUrls = []
}: VenueImageProps) => {
  // Use imageUrl as fallback if imageUrls is empty
  const allImages = imageUrls?.length > 0 
    ? imageUrls 
    : imageUrl ? [imageUrl] : [];
    
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };
  
  // If there are no images
  if (allImages.length === 0) {
    return (
      <Card className="w-full h-96 flex items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageIcon size={48} />
          <span>Nenhuma imagem disponível</span>
        </div>
      </Card>
    );
  }
  
  // If there's only one image
  if (allImages.length === 1) {
    return (
      <div className="w-full h-96 relative rounded-lg overflow-hidden">
        <img 
          src={allImages[0]}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  
  // If there are multiple images
  return (
    <div className="w-full relative">
      <div className="w-full h-96 relative rounded-lg overflow-hidden">
        <img 
          src={allImages[currentImageIndex]}
          alt={`${title} - Imagem ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
          onClick={handlePrevImage}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Imagem anterior</span>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
          onClick={handleNextImage}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Próxima imagem</span>
        </Button>
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {allImages.length}
        </div>
      </div>
      
      {/* Thumbnail navigation */}
      <div className="flex gap-2 mt-2 overflow-x-auto py-2">
        {allImages.map((img, index) => (
          <div
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={cn(
              "h-16 w-24 rounded-md overflow-hidden cursor-pointer border-2",
              currentImageIndex === index ? "border-primary" : "border-transparent"
            )}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
