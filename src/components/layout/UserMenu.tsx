
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/contexts/SessionContext";
import { useToast } from "@/components/ui/use-toast";
import { Camera, LogOut, Settings, User } from "lucide-react";

export function UserMenu() {
  const { logout } = useAuth();
  const { session } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const user = session?.user;
  const firstName = user?.user_metadata?.first_name || "";
  const lastName = user?.user_metadata?.last_name || "";
  const avatarUrl = user?.user_metadata?.avatar_url;

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-10 w-10 rounded-full overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all">
          <Avatar className="h-10 w-10">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} />
            ) : (
              <AvatarFallback>
                {firstName && lastName ? `${firstName[0]}${lastName[0]}` : <Camera className="h-5 w-5 text-muted-foreground" />}
              </AvatarFallback>
            )}
          </Avatar>
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              className="sr-only" 
              onChange={uploadAvatar}
              disabled={uploading}
            />
            <Camera className="h-5 w-5 text-white" />
          </label>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{firstName} {lastName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
