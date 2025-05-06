
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";
import { useAuth } from "@/hooks/useAuth";

interface ProfileCardProps {
  userData: UserProfile;
  onAvatarUpdated: () => void;
  onEditProfile: () => void;
}

export const ProfileCard = ({ userData, onAvatarUpdated, onEditProfile }: ProfileCardProps) => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const getInitials = () => {
    if (!userData.first_name) return "";
    return `${userData.first_name.charAt(0)}${
      userData.last_name ? userData.last_name.charAt(0) : ""
    }`.toUpperCase();
  };
  
  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'contractor':
        return "Contratante";
      case 'provider':
        return "Prestador de Serviços";
      case 'advertiser':
        return "Anunciante";
      default:
        return "Usuário";
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Create bucket if it doesn't exist (will be ignored if it does)
      await supabase.storage
        .createBucket('avatars', { public: true })
        .catch(() => {
          // Bucket might already exist - continue
        });
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update the user_metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl }
      });
      
      if (updateError) throw updateError;
      
      // Also update the profile table
      await supabase
        .from('user_profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user?.id);
      
      // Refresh user data
      onAvatarUpdated();
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar: ", error);
      toast.error("Error uploading avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              {userData?.avatar_url ? (
                <AvatarImage
                  src={userData.avatar_url}
                  alt={`${userData.first_name} ${userData.last_name}`}
                />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
            >
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={uploading}
              />
              {uploading ? (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </label>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">
              {userData.first_name} {userData.last_name}
            </h3>
            <div className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
              {getRoleLabel(userData.role)}
            </div>

            {userData.bio && (
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                {userData.bio}
              </p>
            )}
            
            {userData.document_number && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">CPF/CNPJ:</span> {userData.document_number}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t px-6 py-4">
        <Button
          onClick={onEditProfile}
          variant="outline"
          className="w-full"
        >
          Editar perfil
        </Button>
      </div>
    </div>
  );
};
