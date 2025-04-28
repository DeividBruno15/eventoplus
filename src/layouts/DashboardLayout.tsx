
import { useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset
} from '@/components/ui/sidebar';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { NotificationsMenu } from '@/components/layout/NotificationsMenu';
import { SidebarNavigation } from '@/components/layout/SidebarNavigation';
import { UserMenu } from '@/components/layout/UserMenu';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { session, loading: sessionLoading } = useSession();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    setActivePath(location.pathname);
    console.log('Current path:', location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    // Only redirect to login if there's no session and not already redirected
    if (!redirected && !sessionLoading && !session) {
      console.log('No session found, redirecting to login');
      setRedirected(true);
      navigate('/login');
      return;
    }
  }, [session, sessionLoading, navigate, redirected]);

  const handleNavigation = (path: string) => {
    console.log('Navigation triggered to:', path);
  };

  if (sessionLoading && !session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Carregando sua experiência...</p>
        </div>
      </div>
    );
  }

  if (!sessionLoading && !session) {
    return null;
  }

  const getPageTitle = () => {
    const route = location.pathname;
    
    if (route.startsWith('/dashboard')) return 'Dashboard';
    if (route.startsWith('/profile')) return 'Perfil';
    if (route.startsWith('/events')) return 'Eventos';
    if (route.startsWith('/chat')) return 'Chat';
    if (route.startsWith('/settings')) return 'Configurações';
    if (route.startsWith('/service-providers')) return 'Prestadores de Serviços';
    if (route.startsWith('/help-center')) return 'Central de Ajuda';
    if (route.startsWith('/support')) return 'Suporte';
    
    return 'Dashboard';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-100 shadow-sm bg-white">
          <SidebarHeader className="px-6 py-8">
            <div className="font-bold text-2xl bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Evento<span className="text-accent">+</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-4">
            <SidebarNavigation 
              activePath={activePath} 
              onNavigate={handleNavigation} 
            />
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 w-full bg-white border-b px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
            
            <div className="flex items-center gap-4">
              <NotificationsMenu />
              <UserMenu />
            </div>
          </header>

          <main className="flex-1 p-8 bg-gray-50">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
