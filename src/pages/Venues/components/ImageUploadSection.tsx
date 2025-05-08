
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ImageFile {
  file: File;
  preview: string;
  uploading?: boolean;
  url?: string;
}

interface ImageUploadSectionProps {
  venueImages: ImageFile[];
  setVenueImages: React.Dispatch<React.SetStateAction<ImageFile[]>>;
  maxImages?: number;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({ 
  venueImages, 
  setVenueImages,
  maxImages = 5 
}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if max image limit is reached
    if (venueImages.length + files.length > maxImages) {
      toast.error(`Você pode adicionar no máximo ${maxImages} imagens`);
      return;
    }
    
    const newImages: ImageFile[] = [];
    
    Array.from(files).forEach(file => {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error(`Arquivo ${file.name} não é uma imagem válida`);
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Imagem ${file.name} excede o tamanho máximo de 5MB`);
        return;
      }
      
      // Create preview URL
      const preview = URL.createObjectURL(file);
      
      newImages.push({
        file,
        preview
      });
    });
    
    setVenueImages(prev => [...prev, ...newImages]);
    e.target.value = ''; // Reset input for future uploads
  };
  
  const handleRemoveImage = (index: number) => {
    setVenueImages(prev => {
      const newImages = [...prev];
      // Release object URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };
  
  const uploadImages = async (): Promise<string[]> => {
    if (!user) {
      toast.error('É necessário estar logado para fazer upload de imagens');
      return [];
    }
    
    const uploadedUrls: string[] = [];
    setIsUploading(true);
    
    try {
      // Upload each image to Supabase storage
      for (let i = 0; i < venueImages.length; i++) {
        const img = venueImages[i];
        
        // Skip already uploaded images
        if (img.url) {
          uploadedUrls.push(img.url);
          continue;
        }
        
        // Update image status
        setVenueImages(prev => {
          const newImages = [...prev];
          newImages[i] = { ...newImages[i], uploading: true };
          return newImages;
        });
        
        // Upload to Supabase storage
        const fileName = `${Date.now()}-${img.file.name.replace(/\s/g, '_')}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('venue_images')
          .upload(filePath, img.file);
        
        if (error) throw error;
        
        // Get public URL
        const { data: publicData } = supabase.storage
          .from('venue_images')
          .getPublicUrl(data.path);
          
        const url = publicData.publicUrl;
        
        // Update with URL
        setVenueImages(prev => {
          const newImages = [...prev];
          newImages[i] = { 
            ...newImages[i], 
            uploading: false,
            url 
          };
          return newImages;
        });
        
        uploadedUrls.push(url);
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Falha ao fazer upload das imagens');
      return [];
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium">Fotos do Local</h3>
        <p className="text-sm text-muted-foreground">
          Adicione fotos para destacar seu espaço (máximo {maxImages} fotos, 5MB cada)
        </p>
      </div>
      
      <div className="border rounded-md p-4 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
          {venueImages.map((image, i) => (
            <div key={i} className="relative group aspect-square rounded-md overflow-hidden border">
              <img 
                src={image.preview} 
                alt={`Preview ${i+1}`} 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={() => handleRemoveImage(i)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {image.uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          ))}
          
          {venueImages.length < maxImages && (
            <label className="border border-dashed rounded-md cursor-pointer h-full min-h-40 flex flex-col items-center justify-center p-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center gap-2">
                <UploadCloud className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500 text-center">
                  Clique para adicionar fotos
                </span>
              </div>
              <input 
                type="file" 
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
          )}
        </div>
        
        {venueImages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500 mb-4 text-center">
              Adicione fotos do seu espaço para atrair mais reservas
            </p>
            <label className="cursor-pointer">
              <Button 
                variant="outline" 
                type="button" 
                disabled={isUploading}
              >
                <UploadCloud className="h-4 w-4 mr-2" />
                Selecionar imagens
              </Button>
              <input 
                type="file" 
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadSection;
