
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  MessagesSquare, 
  Settings,
  HelpCircle,
  LifeBuoy,
  LogOut,
  RefreshCcw,
  Bell
} from 'lucide-react';
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type MenuItem = {
  path: string;
  name: string;
  icon: React.ElementType;
  badge?: number;
}

type SidebarNavigationProps = {
  activePath: string;
  onNavigate: (path: string) => void;
}

export const SidebarNavigation = ({ activePath, onNavigate }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const { session, user, logout } = useAuth();
  const { toast: toastUI } = useToast();
  const [switchingRole, setSwitchingRole] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const avatarUrl = user?.user_metadata?.avatar_url;
  
  const initials = firstName && lastName 
    ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() 
    : firstName 
      ? firstName.charAt(0).toUpperCase() 
      : 'U';
      
  const userRole = user?.user_metadata?.role || 'contractor';
  const [hasProviderRole, setHasProviderRole] = useState<boolean | null>(null);
  const [hasContractorRole, setHasContractorRole] = useState<boolean | null>(null);

  // Check if user has both roles
  useEffect(() => {
    const checkUserRoles = async () => {
      if (!user) return;
      
      try {
        // First check current user metadata
        if (user.user_metadata?.role === 'provider') {
          setHasProviderRole(true);
        } else if (user.user_metadata?.role === 'contractor') {
          setHasContractorRole(true);
        }
        
        // Check if user has a provider profile
        const { data: providerData, error: providerError } = await supabase
          .from('provider_services')
          .select('id')
          .eq('provider_id', user.id)
          .limit(1);
          
        if (!providerError && providerData && providerData.length > 0) {
          setHasProviderRole(true);
        }
        
        // Check if user has created any events as a contractor
        const { data: contractorData, error: contractorError } = await supabase
          .from('events')
          .select('id')
          .eq('contractor_id', user.id)
          .limit(1);
          
        if (!contractorError && contractorData && contractorData.length > 0) {
          setHasContractorRole(true);
        }
        
      } catch (error) {
        console.error('Error checking user roles:', error);
      }
    };
    
    checkUserRoles();
  }, [user]);
  
  // Check for unread messages
  useEffect(() => {
    const checkUnreadMessages = async () => {
      if (!user) return;
      
      try {
        // Get all conversations the user is part of
        const { data: participantData } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id);
          
        if (!participantData || participantData.length === 0) return;
        
        const conversationIds = participantData.map(p => p.conversation_id);
        
        // Get unread messages count
        const { count, error } = await supabase
          .from('chat_messages')
          .select('*', { count: 'exact' })
          .in('conversation_id', conversationIds)
          .eq('read', false)
          .neq('sender_id', user.id);
          
        if (error) {
          console.error('Error getting unread messages:', error);
          return;
        }
        
        setUnreadMessages(count || 0);
      } catch (error) {
        console.error('Error checking unread messages:', error);
      }
    };
    
    checkUnreadMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('chat_messages_changes')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        () => {
          checkUnreadMessages();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'contractor':
        return 'Contratante';
      case 'provider':
        return 'Prestador';
      default:
        return 'Usuário';
    }
  };

  const handleSwitchRole = async () => {
    if (!user) return;
    
    try {
      setSwitchingRole(true);
      
      const newRole = userRole === 'contractor' ? 'provider' : 'contractor';
      
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

  const mainMenuItems: MenuItem[] = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', name: 'Perfil', icon: User },
    { path: '/events', name: 'Eventos', icon: Calendar },
    { path: '/chat', name: 'Chat', icon: MessagesSquare, badge: unreadMessages },
    { path: '/settings', name: 'Configurações', icon: Settings },
  ];

  const supportMenuItems: MenuItem[] = [
    { path: '/help-center', name: 'Central de Ajuda', icon: HelpCircle },
    { path: '/support', name: 'Suporte', icon: LifeBuoy },
  ];

  const handleLinkClick = (path: string) => {
    console.log('Sidebar item clicked:', path);
    onNavigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toastUI({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
      navigate('/');
    } catch (error: any) {
      toastUI({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      const isActive = 
        activePath === item.path || 
        (item.path !== '/dashboard' && activePath.startsWith(item.path));
      
      const Icon = item.icon;

      return (
        <SidebarMenuItem 
          key={item.path}
          className="transition-all duration-200 ease-in-out"
        >
          <SidebarMenuButton
            aria-current={isActive ? 'page' : undefined}
            onClick={() => handleLinkClick(item.path)}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-primary/10 text-primary font-medium scale-105'
                : 'hover:bg-gray-50 text-gray-600 hover:text-primary hover:translate-x-1'
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="relative">
                <Icon className={`h-5 w-5 transition-transform duration-300 ${
                  isActive ? 'scale-110 text-primary' : 'text-gray-500'
                }`} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1">
                    <Badge className="h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px]">
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  </span>
                )}
              </div>
              <span>{item.name}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="px-6 py-4">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-3">
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
          <h3 className="font-medium text-gray-900">{firstName} {lastName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
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
                    Deseja trocar para o perfil de {userRole === 'contractor' ? 'Prestador' : 'Contratante'}?
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

      <div className="px-3 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>
      
      <SidebarMenu>
        {renderMenuItems(mainMenuItems)}
      </SidebarMenu>
      
      <div className="px-3 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>
      
      <SidebarMenu>
        {renderMenuItems(supportMenuItems)}
      </SidebarMenu>

      <div className="px-3 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-xl hover:bg-gray-50 text-red-500 hover:text-red-600 hover:translate-x-1 transition-all duration-300"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
};
