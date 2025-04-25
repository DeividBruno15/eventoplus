
import { useState, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Image, Upload, X } from 'lucide-react';
import { CreateEventFormData } from '../schema';

interface ImageUploadFieldProps {
  form: UseFormReturn<CreateEventFormData>;
  defaultImage?: string;
}

export const ImageUploadField = ({ form, defaultImage }: ImageUploadFieldProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Update form value with the file object
    form.setValue('image', file);

    // Create preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setPreviewUrl(null);
    form.setValue('image', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label>Imagem do Evento (opcional)</Label>
      
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors hover:border-primary/50 bg-gray-50">
        {previewUrl ? (
          <div className="relative w-full">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="rounded-md max-h-64 mx-auto object-cover" 
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
              onClick={handleClearImage}
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Image className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <div className="flex text-sm text-gray-600 mb-3">
              <label 
                htmlFor="event-image" 
                className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
              >
                <span>Carregar imagem</span>
                <input
                  id="event-image"
                  name="event-image"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">ou arrastar e soltar</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG ou WEBP até 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};
