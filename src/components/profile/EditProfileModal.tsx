
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useProfileUpdate } from '@/hooks/useProfileUpdate';
import { ProfileForm } from './ProfileForm';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  onSuccess: () => void;
}

export const EditProfileModal = ({ isOpen, onClose, userData, onSuccess }: EditProfileModalProps) => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(userData?.avatar_url || '');
  const { loading, handleProfileUpdate } = useProfileUpdate(userData, avatarUrl, onSuccess);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        
        <ProfileForm
          userData={userData}
          onSubmit={handleProfileUpdate}
          onCancel={onClose}
          loading={loading}
          uploading={uploading}
          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}
        />
      </DialogContent>
    </Dialog>
  );
};
