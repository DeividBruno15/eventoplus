
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { ProfileAvatarUpload } from './ProfileAvatarUpload';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  phone_number: string;
  document_number: string;
  bio: string;
}

interface ProfileFormProps {
  userData: any;
  onSubmit: (values: ProfileFormData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  uploading: boolean;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
}

export const ProfileForm = ({
  userData,
  onSubmit,
  onCancel,
  loading,
  uploading,
  avatarUrl,
  setAvatarUrl
}: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    phone_number: '',
    document_number: '',
    bio: '',
  });
  
  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone_number: userData.phone_number || '',
        document_number: userData.document_number || '',
        bio: userData.bio || '',
      });
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="flex justify-center mb-4">
        <ProfileAvatarUpload 
          avatarUrl={avatarUrl}
          onAvatarChange={setAvatarUrl}
          userId={userData?.id}
        />
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
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading || uploading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading ? "Salvando..." : "Salvar perfil"}
        </Button>
      </DialogFooter>
    </form>
  );
};
