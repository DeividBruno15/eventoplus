
import { useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar,
  SidebarContent,
  SidebarHeader
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { NotificationsMenu } from '@/components/layout/NotificationsMenu';
import { SidebarNavigation } from '@/components/layout/SidebarNavigation';
import { UserMenu } from '@/components/layout/UserMenu';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { session, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    // Only redirect to login if there's no session and loading is complete
    if (!loading && !session) {
      console.log('No session found, redirecting to login');
      navigate('/login');
    }
  }, [session, loading, navigate]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Carregando sua experiência...</p>
        </div>
      </div>
    );
  }

  if (!session) {
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
    <SidebarProvider defaultOpen={true}>
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

        <div className="flex flex-col flex-1 min-w-0">
          <header className="sticky top-0 z-40 w-full bg-white border-b px-8 py-4 flex justify-between items-center">
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
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
