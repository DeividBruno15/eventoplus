
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { EditAddressModal } from "@/components/profile/EditAddressModal";
import { ServiceCategoriesModal } from "@/components/profile/ServiceCategoriesModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Camera, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { UserCompanies } from "@/components/profile/UserCompanies";

type UserData = {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  avatar_url?: string | null;
  phone_number?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  street?: string | null;
  neighborhood?: string | null;
  number?: string | null;
  zipcode?: string | null;
  bio?: string | null;
  role?: string | null;
};

const Profile = () => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [isServiceCategoriesOpen, setIsServiceCategoriesOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getUserData();
    }
  }, [user]);

  const getUserData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        throw error;
      }

      const email = user.email || "";

      setUserData({
        ...data,
        email,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error fetching profile data");
    }
  };

  const handleProfileUpdated = () => {
    getUserData();
    setIsEditProfileOpen(false);
    toast.success("Profile updated successfully");
  };

  const handleAddressUpdated = () => {
    getUserData();
    setIsEditAddressOpen(false);
    toast.success("Address updated successfully");
  };

  const handleServiceCategoriesUpdated = () => {
    setIsServiceCategoriesOpen(false);
    toast.success("Service categories updated successfully");
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
      getUserData();
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar: ", error);
      toast.error("Error uploading avatar");
    } finally {
      setUploading(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mb-2.5"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    if (!userData.first_name) return "";
    return `${userData.first_name.charAt(0)}${
      userData.last_name ? userData.last_name.charAt(0) : ""
    }`.toUpperCase();
  };

  const formatAddress = () => {
    const parts = [];
    
    if (userData.street && userData.number) {
      parts.push(`${userData.street}, ${userData.number}`);
    }
    
    if (userData.neighborhood) {
      parts.push(userData.neighborhood);
    }
    
    if (userData.city && userData.state) {
      parts.push(`${userData.city}, ${userData.state}`);
    }
    
    if (userData.zipcode) {
      parts.push(`CEP ${userData.zipcode}`);
    }
    
    return parts.join(" - ");
  };

  const fullAddress = formatAddress();

  const showAddressSection = !!(
    userData.street ||
    userData.city ||
    userData.state ||
    userData.zipcode
  );

  const showContactSection = !!(userData.email || userData.phone_number);

  const isProvider = userData.role === 'provider';
  const isContractor = userData.role === 'contractor';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
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
                  {userData.role === "provider" ? "Prestador de Serviços" : "Contratante"}
                </div>

                {userData.bio && (
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    {userData.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t px-6 py-4">
            <Button
              onClick={() => setIsEditProfileOpen(true)}
              variant="outline"
              className="w-full"
            >
              Editar perfil
            </Button>
          </div>
        </div>

        {/* Contact & Address Card */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {showContactSection && (
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Contato</h3>
              <div className="space-y-3">
                {userData.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>{userData.email}</span>
                  </div>
                )}
                {userData.phone_number && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>{userData.phone_number}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {showContactSection && showAddressSection && (
            <div className="border-t mx-6"></div>
          )}

          {showAddressSection && (
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Endereço</h3>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span>{fullAddress}</span>
              </div>
            </div>
          )}

          <div className="border-t px-6 py-4">
            <Button
              onClick={() => setIsEditAddressOpen(true)}
              variant="outline"
              className="w-full"
            >
              Atualizar endereço
            </Button>
          </div>
        </div>
      </div>

      {/* Provider Services Section */}
      {isProvider && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium">Meus Serviços</h3>
              <Button 
                onClick={() => setIsServiceCategoriesOpen(true)}
                size="sm"
              >
                Gerenciar Serviços
              </Button>
            </div>

            {/* Service categories would be displayed here */}
            <div className="text-muted-foreground text-sm">
              Gerencie os serviços que você oferece como prestador.
            </div>
          </div>
        </div>
      )}

      {/* Company management for contractors */}
      {isContractor && (
        <UserCompanies />
      )}

      {/* Modals */}
      {isEditProfileOpen && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onSuccess={handleProfileUpdated}
          userData={userData}
        />
      )}

      {isEditAddressOpen && (
        <EditAddressModal
          isOpen={isEditAddressOpen}
          onClose={() => setIsEditAddressOpen(false)}
          onSuccess={handleAddressUpdated}
          userData={userData}
        />
      )}

      {isServiceCategoriesOpen && (
        <ServiceCategoriesModal
          isOpen={isServiceCategoriesOpen}
          onClose={() => setIsServiceCategoriesOpen(false)}
          onSuccess={handleServiceCategoriesUpdated}
        />
      )}
    </div>
  );
};

export default Profile;
