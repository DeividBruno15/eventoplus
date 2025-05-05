
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { UserProfile } from './sidebar/UserProfile';
import { MenuGroup } from './sidebar/MenuGroup';
import { LogoutButton } from './sidebar/LogoutButton';
import { mainMenuItems, supportMenuItems } from './sidebar/menu-data';
import { useUnreadMessages } from './sidebar/useUnreadMessages';
import { useUserRoles } from './sidebar/useUserRoles';
import { SidebarNavigationProps } from './sidebar/types';

export const SidebarNavigation = ({ activePath, onNavigate }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const { session, user, logout } = useAuth();
  const { toast: toastUI } = useToast();
  
  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const userRole = user?.user_metadata?.role || 'contractor';

  // Use our custom hooks
  const unreadMessages = useUnreadMessages(user?.id);
  const { hasProviderRole, hasContractorRole } = useUserRoles(user);
  
  // Update menu items with unread message count
  const updatedMainMenuItems = mainMenuItems.map(item => {
    if (item.path === '/chat' && unreadMessages > 0) {
      return { ...item, badge: unreadMessages };
    }
    return item;
  });

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

  return (
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

      <div className="px-3 py-2">
        <Separator className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>
      
      <MenuGroup 
        items={updatedMainMenuItems} 
        activePath={activePath} 
        onItemClick={handleLinkClick} 
      />
      
      <div className="px-3 py-2">
        <Separator className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>
      
      <MenuGroup 
        items={supportMenuItems} 
        activePath={activePath} 
        onItemClick={handleLinkClick} 
      />

      <div className="px-3 py-2">
        <Separator className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <LogoutButton onLogout={handleLogout} />
    </div>
  );
};
