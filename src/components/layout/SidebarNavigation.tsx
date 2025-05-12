
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { UserProfile } from './sidebar/UserProfile';
import { MenuGroup } from './sidebar/MenuGroup';
import { LogOut } from 'lucide-react';
import { useUnreadMessages } from './sidebar/useUnreadMessages';
import { SidebarNavigationProps } from './sidebar/types';
import { Sidebar, SidebarContent, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { getMainMenuItems, getSupportMenuItems } from './sidebar/menu-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useSidebar } from '@/components/ui/sidebar/context';

export const SidebarNavigation = ({ onNavigate }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, user, logout } = useAuth();
  const { toast } = useToast();
  const { isDesktop } = useBreakpoint('md');
  const { isMobile } = useSidebar();
  
  const unreadMessages = useUnreadMessages(user?.id);
  
  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const userRole = user?.user_metadata?.role || 'contractor';

  // Get the current path directly from location
  const currentPath = location.pathname;

  // Get menu items based on user preferences from onboarding
  const mainMenuItems = getMainMenuItems(user);
  const supportMenuItems = getSupportMenuItems();

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
            <h1 className="text-2xl font-bold text-primary">Evento+</h1>
          </div>
          
          <UserProfile 
            user={user}
            firstName={firstName}
            lastName={lastName}
            avatarUrl={avatarUrl}
            userRole={userRole}
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
              
              {/* Adicionar botão de logout aqui, após os itens de suporte */}
              <div className="px-1 mt-6">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-red-500 hover:text-red-600 hover:translate-x-1 transition-all duration-300"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                  </SidebarMenuButton>
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
