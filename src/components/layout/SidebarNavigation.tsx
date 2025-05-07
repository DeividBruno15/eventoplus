
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { UserProfile } from './sidebar/UserProfile';
import { MenuGroup } from './sidebar/MenuGroup';
import { LogoutButton } from './sidebar/LogoutButton';
import { useUnreadMessages } from './sidebar/useUnreadMessages';
import { useUserRoles } from './sidebar/useUserRoles';
import { SidebarNavigationProps } from './sidebar/types';
import { useNavigationState } from './sidebar/useNavigationState';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { getMainMenuItems, getSupportMenuItems } from './sidebar/menu-data';

export const SidebarNavigation = ({ onNavigate }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, user, logout } = useAuth();
  const { toast } = useToast();
  
  // Use our custom hooks
  const { activePath, handleLinkClick } = useNavigationState(onNavigate);
  const unreadMessages = useUnreadMessages(user?.id);
  const { hasProviderRole, hasContractorRole } = useUserRoles(user);
  
  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const userRole = user?.user_metadata?.role || 'contractor';

  // Use o caminho atual diretamente do useLocation para melhorar a navegação
  const currentPath = location.pathname;

  // Get menu items based on user role
  const mainMenuItems = getMainMenuItems(userRole);
  const supportMenuItems = getSupportMenuItems(userRole);

  // Update menu items with unread message count only if there are unread messages
  const updatedMainMenuItems = mainMenuItems.map(item => {
    if (item.notificationKey === 'messages' && unreadMessages > 0) {
      return { ...item, badge: unreadMessages };
    }
    // Remover qualquer badge que possa ter sido definido anteriormente
    if (item.badge) {
      const { badge, ...rest } = item;
      return rest;
    }
    return item;
  });

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

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex flex-col gap-8 animate-fade-in">
          <UserProfile 
            user={user}
            firstName={firstName}
            lastName={lastName}
            avatarUrl={avatarUrl}
            userRole={userRole}
            hasProviderRole={hasProviderRole}
            hasContractorRole={hasContractorRole}
          />

          <SidebarSeparator />
          
          <MenuGroup 
            items={updatedMainMenuItems} 
            activePath={currentPath} 
            onItemClick={handleLinkClick} 
          />
          
          <SidebarSeparator />
          
          <MenuGroup 
            items={supportMenuItems} 
            activePath={currentPath} 
            onItemClick={handleLinkClick} 
          />

          <SidebarSeparator />

          <LogoutButton onLogout={handleLogout} />
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

const SidebarSeparator = () => (
  <div className="px-3 py-2">
    <Separator className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
  </div>
);
