
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

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
      
      // Check if events bucket exists
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const eventsBucketExists = buckets?.some(bucket => bucket.name === 'events');
        
        if (!eventsBucketExists) {
          await supabase.storage.createBucket('events', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
          });
        }
      } catch (error) {
        console.log('Bucket check/creation info:', error);
      }

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
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadEventImage:', error);
      throw error;
    }
  };

  return { uploadEventImage };
};
