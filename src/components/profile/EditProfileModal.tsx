
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  onSuccess: () => void;
}

export const EditProfileModal = ({ isOpen, onClose, userData, onSuccess }: EditProfileModalProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: userData?.first_name || '',
    last_name: userData?.last_name || '',
    phone_number: userData?.phone_number || '',
    document_number: userData?.document_number || '',
    bio: userData?.bio || '',
  });
  
  const [avatarUrl, setAvatarUrl] = useState(userData?.avatar_url || '');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
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
      
      // Update user_profiles table as well
      await supabase
        .from('user_profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
        })
        .eq('id', userData.id);
      
      toast.success("Perfil atualizado");
      onSuccess();
    } catch (error: any) {
      toast.error("Erro ao atualizar perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userData?.id}/${Math.random().toString(36).slice(2)}.${fileExt}`;
      
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
      
      setAvatarUrl(publicUrl);
      
      toast.success("Avatar carregado");
      
    } catch (error: any) {
      toast.error("Erro ao carregar avatar: " + error.message);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
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
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Nome</Label>
              <Input 
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Seu nome"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Sobrenome</Label>
              <Input 
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Seu sobrenome"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone_number">Telefone</Label>
            <Input 
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              placeholder="Seu número de telefone"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document_number">CPF/CNPJ</Label>
            <Input 
              id="document_number"
              name="document_number"
              value={formData.document_number}
              onChange={handleInputChange}
              placeholder="Seu CPF ou CNPJ"
              disabled={!!formData.document_number}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea 
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Conte um pouco sobre você"
              rows={4}
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading || uploading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Salvando..." : "Salvar perfil"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
