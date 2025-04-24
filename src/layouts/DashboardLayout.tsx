
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
import { UserMenu } from '@/components/layout/UserMenu';
import { SidebarNavigation } from '@/components/layout/SidebarNavigation';

const DashboardLayout = () => {
  const { session, loading: sessionLoading } = useSession();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  // Atualizar o caminho ativo quando a localização mudar
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  // Verificar a autenticação
  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate('/login');
    }
  }, [session, sessionLoading, navigate]);

  const getUserInitials = () => {
    if (!user) return "?";
    const firstName = user.user_metadata?.first_name as string | undefined;
    const lastName = user.user_metadata?.last_name as string | undefined;
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const userName = user?.user_metadata?.first_name || 'Usuário';

  const handleNavigation = (path: string) => {
    console.log('Navegando para o caminho:', path);
    setActivePath(path);
    navigate(path);
  };

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const getPageTitle = () => {
    const route = location.pathname;
    
    if (route.startsWith('/dashboard')) return 'Dashboard';
    if (route.startsWith('/profile')) return 'Perfil';
    if (route.startsWith('/events')) return 'Eventos';
    if (route.startsWith('/chat')) return 'Chat';
    if (route.startsWith('/settings')) return 'Configurações';
    if (route.startsWith('/service-providers')) return 'Prestadores de Serviços';
    
    return 'Dashboard';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="px-6 py-8">
            <div className="font-bold text-2xl text-primary">
              Evento<span className="text-secondary">+</span>
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
              <UserMenu 
                userName={userName}
                userInitials={getUserInitials()}
                onNavigate={handleNavigation}
              />
            </div>
          </header>

          <main className="flex-1 p-8 bg-gray-50">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
