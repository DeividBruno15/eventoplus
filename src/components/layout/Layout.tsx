
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarNavigation } from './SidebarNavigation';
import { useNavigationState } from './sidebar/useNavigationState';
import { NotificationsMenu } from './notifications/NotificationsMenu';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { SidebarProvider } from '@/components/ui/sidebar/context';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';

export default function Layout() {
  const navigate = useNavigate();
  const { isOpen, toggleSidebar } = useNavigationState();
  const { isDesktop } = useBreakpoint('md');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Detectar scroll para adicionar efeito de sombra no header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <SidebarNavigation onNavigate={handleNavigate} />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <header className={`h-16 border-b z-10 bg-background/95 backdrop-blur-sm px-4 flex items-center justify-between sticky top-0 transition-shadow duration-300 ${
            isScrolled ? 'shadow-sm' : ''
          }`}>
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
              <ThemeToggle />
              {/* Removido NotificationSettings, mantendo apenas NotificationsMenu */}
              <NotificationsMenu />
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
