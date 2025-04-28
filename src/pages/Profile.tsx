
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Camera, PlusCircle, Edit } from 'lucide-react';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { EditAddressModal } from '@/components/profile/EditAddressModal';
import { ServiceCategoriesModal } from '@/components/profile/ServiceCategoriesModal';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userServices, setUserServices] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [isEditServicesOpen, setIsEditServicesOpen] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // Fetch user profile data
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
      
      // If user is a provider, fetch their services
      if (user?.user_metadata?.role === 'provider') {
        const { data: servicesData, error: servicesError } = await supabase
          .from('provider_services')
          .select('category')
          .eq('provider_id', user.id);
          
        if (servicesError) throw servicesError;
        
        setUserServices(servicesData.map(item => item.category));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do perfil.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
      const filePath = `${user?.id}/${Math.random().toString(36).slice(2)}.${fileExt}`;
      
      await supabase.storage
        .createBucket('avatars', { public: true })
        .catch(() => {
          // Bucket might already exist, continue
        });
        
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });
      
      if (updateError) throw updateError;
      
      toast({
        title: "Avatar atualizado",
        description: "Sua imagem de perfil foi atualizada com sucesso."
      });
      
      // Force refresh to show new avatar
      fetchUserProfile();
      
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar avatar",
        description: error.message,
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <p>Carregando perfil...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userMetadata = user?.user_metadata || {};
  const avatarUrl = userMetadata.avatar_url;
  const isProvider = userMetadata.role === 'provider';
  const hasServices = userServices.length > 0;
  const buttonText = hasServices ? 'Atualizar Serviços' : 'Adicionar Serviços';
  const bio = userMetadata.bio || '';

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Informações Pessoais */}
        <Card className="w-full md:w-1/2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Informações Pessoais</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditProfileOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center mb-6">
              <div className="relative mr-4">
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
                    onChange={uploadAvatar}
                    disabled={uploading}
                  />
                </label>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{userMetadata.first_name} {userMetadata.last_name}</h3>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p>{userMetadata.first_name} {userMetadata.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p>{userMetadata.phone_number || '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CPF/CNPJ</p>
                <p>{userMetadata.document_number || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Biografia</p>
                <p className="whitespace-pre-wrap">{bio || 'Sem biografia.'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card className="w-full md:w-1/2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Endereço</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditAddressOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Endereço
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Rua</p>
                <p>{userMetadata.street || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Bairro</p>
                  <p>{userMetadata.neighborhood || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CEP</p>
                  <p>{userMetadata.zipcode || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Cidade</p>
                  <p>{userMetadata.city || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <p>{userMetadata.state || '-'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Serviços (apenas para prestadores) */}
      {isProvider && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Meus Serviços</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditServicesOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {buttonText}
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {hasServices ? (
              <div className="flex flex-wrap gap-2">
                {userServices.map((service) => (
                  <div
                    key={service}
                    className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                  >
                    {service}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  Você ainda não adicionou nenhum serviço ao seu perfil.
                </p>
                <Button onClick={() => setIsEditServicesOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar Serviços
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <EditProfileModal 
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        userData={user}
        onProfileUpdate={fetchUserProfile}
      />

      <EditAddressModal
        isOpen={isEditAddressOpen}
        onClose={() => setIsEditAddressOpen(false)}
        userData={user}
        onAddressUpdate={fetchUserProfile}
      />

      <ServiceCategoriesModal
        isOpen={isEditServicesOpen}
        onClose={() => setIsEditServicesOpen(false)}
        userData={user}
        userServices={userServices}
        onServicesUpdate={fetchUserProfile}
      />
    </div>
  );
};

export default Profile;
