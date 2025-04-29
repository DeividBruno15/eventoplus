
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  phone_number: string;
  document_number: string;
  bio: string;
}

export const useProfileUpdate = (
  userData: any,
  avatarUrl: string,
  onSuccess: () => void
) => {
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (formData: ProfileFormData) => {
    setLoading(true);
    
    try {
      console.log('Updating profile with avatar:', avatarUrl);
      
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          document_number: formData.document_number,
          bio: formData.bio,
          avatar_url: avatarUrl,
        }
      });
      
      if (error) throw error;
      
      // Update the user_profiles table as well
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          bio: formData.bio,
          avatar_url: avatarUrl,
        })
        .eq('id', userData.id);
        
      if (profileError) throw profileError;
      
      toast.success("Perfil atualizado");
      onSuccess();
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error("Erro ao atualizar perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleProfileUpdate };
};
