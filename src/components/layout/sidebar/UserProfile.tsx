
import React, { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type UserProfileProps = {
  user: any;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  userRole: string;
  hasProviderRole: boolean | null;
  hasContractorRole: boolean | null;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  user,
  firstName,
  lastName,
  avatarUrl,
  userRole,
  hasProviderRole,
  hasContractorRole
}) => {
  const [switchingRole, setSwitchingRole] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  
  const initials = firstName && lastName 
    ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() 
    : firstName 
      ? firstName.charAt(0).toUpperCase() 
      : 'U';

  const handleSwitchRole = async () => {
    if (!user) return;
    
    try {
      setSwitchingRole(true);
      
      // Determine new role based on current role
      let newRole;
      if (userRole === 'contractor') {
        newRole = 'provider';
      } else if (userRole === 'provider') {
        newRole = 'advertiser';
      } else {
        newRole = 'contractor';
      }
      
      // Update role in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: { role: newRole }
      });
      
      if (error) throw error;
      
      // Update role in profile if needed
      await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', user.id);
      
      toast.success(`Perfil alterado para ${getRoleLabel(newRole)}`);
      
      // Refresh page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      console.error('Error switching role:', error);
      toast.error('Erro ao trocar o tipo de conta');
    } finally {
      setSwitchingRole(false);
      setShowRoleDialog(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'contractor':
        return 'Contratante';
      case 'provider':
        return 'Prestador';
      case 'advertiser':
        return 'Anunciante';
      default:
        return 'Usuário';
    }
  };

  return (
    <div className="px-4 py-3">
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-16 w-16 mb-2">
          {avatarUrl ? (
            <AvatarImage 
              src={avatarUrl} 
              alt={`${firstName} ${lastName}`} 
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
          )}
        </Avatar>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate max-w-full">{firstName} {lastName}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded truncate max-w-[80%]">
            {getRoleLabel(userRole)}
          </span>
          
          <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0 rounded-full"
                title="Trocar tipo de conta"
              >
                <RefreshCcw className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Trocar tipo de conta</DialogTitle>
                <DialogDescription>
                  Deseja trocar para o perfil de {
                    userRole === 'contractor' ? 'Prestador' : 
                    userRole === 'provider' ? 'Anunciante' : 'Contratante'
                  }?
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col gap-4 py-4">
                {userRole === 'contractor' && !hasProviderRole && (
                  <p className="text-amber-600 text-sm">
                    Você ainda não tem um perfil de prestador configurado. 
                    Será necessário completar seu cadastro após a troca.
                  </p>
                )}
                
                {userRole === 'provider' && !hasContractorRole && (
                  <p className="text-amber-600 text-sm">
                    Você ainda não tem um perfil de contratante configurado. 
                    Será necessário completar seu cadastro após a troca.
                  </p>
                )}
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSwitchRole} 
                  disabled={switchingRole}
                >
                  {switchingRole ? 'Trocando...' : 'Trocar perfil'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
