
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `event-images/${fileName}`;
      
      // Create events bucket if it doesn't exist
      try {
        const { data: bucketList } = await supabase.storage.listBuckets();
        const eventsBucketExists = bucketList?.some(bucket => bucket.name === 'events');
        
        if (!eventsBucketExists) {
          await supabase.storage.createBucket('events', { 
            public: true,
            fileSizeLimit: 10485760 // 10MB
          });
        }
      } catch (error) {
        // Log error but continue, as the bucket might already exist
        console.log('Bucket check/creation info:', error);
      }

      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('events')
        .upload(filePath, file);
        
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
