
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook for handling event image uploads
 */
export const useEventImageUpload = () => {
  /**
   * Uploads an image file to the Supabase storage
   * @param file The image file to upload
   * @returns The public URL of the uploaded image
   */
  const uploadEventImage = async (file: File): Promise<string> => {
    try {
      // Validate file size (max 10MB)
      if (file.size > 10485760) {
        throw new Error('Arquivo muito grande. Limite máximo: 10MB');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de arquivo não permitido. Somente JPG, PNG, GIF ou WebP.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `event-images/${fileName}`;
      
      console.log('Uploading event image to:', filePath);
      
      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('events')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Error uploading file: ${uploadError.message}`);
      }
      
      if (!data) {
        throw new Error('No data returned from upload');
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('events')
        .getPublicUrl(filePath);
        
      if (!publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      // Notify success
      toast.success('Imagem carregada com sucesso');
      
      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error('Error in uploadEventImage:', error);
      toast.error(`Erro ao fazer upload da imagem: ${error.message}`);
      throw error;
    }
  };

  return { uploadEventImage };
};
