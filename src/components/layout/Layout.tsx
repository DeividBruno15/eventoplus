
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarNavigation } from './SidebarNavigation';
import { useNavigationState } from './sidebar/useNavigationState';
import { NotificationsMenu } from './notifications/NotificationsMenu';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { NotificationSettings } from './notifications/NotificationSettings';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { SidebarProvider } from '@/components/ui/sidebar/context';

export default function Layout() {
  const navigate = useNavigate();
  const { isOpen, toggleSidebar } = useNavigationState();
  const { isDesktop } = useBreakpoint('md');
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        <SidebarNavigation onNavigate={handleNavigate} />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="h-16 border-b bg-white px-4 flex items-center justify-between">
            <div className="flex items-center">
              {!isDesktop && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSidebar}
                  className="mr-2"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <NotificationSettings />
              <NotificationsMenu />
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
