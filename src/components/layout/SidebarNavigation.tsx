
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
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { getMainMenuItems, getSupportMenuItems } from './sidebar/menu-data';

export const SidebarNavigation = ({ onNavigate }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, user, logout } = useAuth();
  const { toast } = useToast();
  
  const unreadMessages = useUnreadMessages(user?.id);
  const { hasProviderRole, hasContractorRole } = useUserRoles(user);
  
  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const userRole = user?.user_metadata?.role || 'contractor';

  // Get the current path directly from location
  const currentPath = location.pathname;

  // Get menu items based on user role
  const mainMenuItems = getMainMenuItems(userRole);
  const supportMenuItems = getSupportMenuItems(userRole);

  // Update menu items with unread message count only if there are unread messages
  const updatedMainMenuItems = mainMenuItems.map(item => {
    if (item.notificationKey === 'messages' && unreadMessages > 0) {
      return { ...item, badge: unreadMessages };
    }
    // Remove any badge that might have been set previously if the count is 0
    if (item.badge !== undefined && item.badge <= 0) {
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

  const handleItemClick = (path: string) => {
    onNavigate(path);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex flex-col gap-8 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center items-center pt-6 pb-2">
            <h1 className="text-2xl font-bold text-primary">Evento+</h1>
          </div>
          
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
            onItemClick={handleItemClick} 
          />
          
          <SidebarSeparator />
          
          <MenuGroup 
            items={supportMenuItems} 
            activePath={currentPath} 
            onItemClick={handleItemClick} 
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
