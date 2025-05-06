
import { useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 10;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploadSectionProps {
  venueImages: ImageFile[];
  setVenueImages: React.Dispatch<React.SetStateAction<ImageFile[]>>;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({ 
  venueImages, 
  setVenueImages 
}) => {
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Create URL previews and cleanup on unmount
  useEffect(() => {
    // Cleanup function to revoke object URLs to avoid memory leaks
    return () => {
      venueImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [venueImages]);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadError(null);
    
    const selectedFiles = Array.from(e.target.files);
    
    if (venueImages.length + selectedFiles.length > MAX_IMAGES) {
      setUploadError(`Você pode enviar no máximo ${MAX_IMAGES} imagens`);
      return;
    }
    
    const newImages: ImageFile[] = [];
    
    selectedFiles.forEach(file => {
      // Validate file size
      if (file.size > MAX_IMAGE_SIZE) {
        setUploadError(`A imagem ${file.name} excede o tamanho máximo de 5MB`);
        return;
      }
      
      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setUploadError(`Tipo de arquivo não suportado: ${file.type}`);
        return;
      }
      
      const imageId = uuidv4();
      newImages.push({
        id: imageId,
        file,
        preview: URL.createObjectURL(file)
      });
    });
    
    if (newImages.length > 0) {
      setVenueImages(prev => [...prev, ...newImages]);
    }
    
    // Reset the input
    e.target.value = '';
  };
  
  const removeImage = (imageId: string) => {
    setVenueImages(venueImages.filter(image => {
      if (image.id === imageId) {
        URL.revokeObjectURL(image.preview);
        return false;
      }
      return true;
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium mb-2">Imagens do espaço</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Adicione até 10 imagens do seu espaço (máximo 5MB por imagem)
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <label
          htmlFor="image-upload"
          className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col items-center gap-1">
            <Camera className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-500">Adicionar</span>
          </div>
          <input
            type="file"
            id="image-upload"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImageUpload}
            multiple
          />
        </label>
        
        {venueImages.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {venueImages.map(image => (
              <div key={image.id} className="relative flex-shrink-0">
                <img
                  src={image.preview}
                  alt="Venue preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
                {venueImages[0].id === image.id && (
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Principal
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {uploadError && (
        <p className="text-sm text-red-500">{uploadError}</p>
      )}
      
      <p className="text-xs text-muted-foreground">
        {venueImages.length} de {MAX_IMAGES} imagens
      </p>
    </div>
  );
};

export default ImageUploadSection;
