
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { UserProfile } from './sidebar/UserProfile';
import { MenuGroup } from './sidebar/MenuGroup';
import { LogOut, Settings } from 'lucide-react';
import { useUnreadMessages } from './sidebar/useUnreadMessages';
import { useUserRoles } from './sidebar/useUserRoles';
import { SidebarNavigationProps } from './sidebar/types';
import { Sidebar, SidebarContent, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { getMainMenuItems, getSupportMenuItems } from './sidebar/menu-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useSidebar } from '@/components/ui/sidebar/context';
import { useState } from 'react';
import { useHover } from '@/hooks/useHover';

export const SidebarNavigation = ({ onNavigate }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, user, logout } = useAuth();
  const { toast } = useToast();
  const { isDesktop } = useBreakpoint('md');
  const { isMobile } = useSidebar();
  const [logoutHover, logoutHoverRef] = useHover();
  
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
      // Explicitly redirect to login page after logout
      navigate('/login');
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

  if (isMobile) {
    return null;
  }

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col px-3 py-2 h-full">
        {/* Fixed content - Logo and User Profile */}
        <div className="flex-shrink-0 mb-4">
          {/* Logo */}
          <div className="flex justify-center items-center py-4">
            <img src="/lovable-uploads/a4f48969-d51e-49f4-a9f0-dff6cf208b26.png" alt="Evento+" className="h-8" />
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
          
          <SidebarSeparator className="mt-4" />
        </div>

        {/* Scrollable menu items */}
        <ScrollArea className="flex-grow overflow-hidden pr-1">
          <div className="py-2 space-y-6">
            <MenuGroup 
              items={updatedMainMenuItems} 
              activePath={currentPath} 
              onItemClick={handleItemClick} 
            />
            
            <SidebarSeparator className="my-4" />
            
            <div className="space-y-6">
              <MenuGroup 
                items={supportMenuItems} 
                activePath={currentPath} 
                onItemClick={handleItemClick} 
              />
              
              {/* Adicionar apenas botão de logout - Removendo configurações duplicadas */}
              <div className="px-1 mt-6 space-y-2">
                <SidebarMenuItem>
                  <div ref={logoutHoverRef} className="w-full">
                    <SidebarMenuButton
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-all duration-300 ${
                        logoutHover ? 'translate-x-1' : ''
                      }`}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sair</span>
                    </SidebarMenuButton>
                  </div>
                </SidebarMenuItem>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
};

const SidebarSeparator = ({ className = "" }) => (
  <div className={`${className}`}>
    <Separator className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
  </div>
);
