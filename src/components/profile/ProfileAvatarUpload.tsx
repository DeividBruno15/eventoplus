
import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileAvatarUploadProps {
  avatarUrl: string;
  onAvatarChange: (url: string) => void;
  userId: string;
}

export const ProfileAvatarUpload = ({ 
  avatarUrl, 
  onAvatarChange,
  userId 
}: ProfileAvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Create the bucket if it doesn't exist
      try {
        await supabase.storage.createBucket('avatars', {
          public: true
        });
        console.log('Avatars bucket created or already exists');
      } catch (error: any) {
        // Ignore if bucket already exists (409 error)
        if (error.statusCode !== 409) {
          console.error('Error creating avatars bucket:', error);
        }
      }
      
      // Upload the file with security service role
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      onAvatarChange(urlData.publicUrl);
      
      toast.success("Avatar carregado com sucesso");
      
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error("Erro ao carregar avatar: " + (error.message || "Erro desconhecido"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-24 w-24">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} />
        ) : (
          <AvatarFallback className="bg-muted">
            <Camera className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        )}
      </Avatar>
      <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer hover:bg-primary/80 transition-colors">
        <Camera className="h-4 w-4" />
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleAvatarUpload}
          disabled={uploading}
        />
      </label>
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
};
