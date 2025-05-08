
import { Outlet, useLocation } from "react-router-dom";
import { SidebarNavigation } from "@/components/layout/SidebarNavigation";
import { UserMenu } from "@/components/layout/UserMenu";
import { NotificationsMenu } from "@/components/layout/notifications/NotificationsMenu";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2, Menu } from "lucide-react";
import { PageTransition } from "@/components/ui/page-transition";
import { AnimatePresence } from "framer-motion";
import { SidebarProvider } from "@/components/ui/sidebar/context";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const DashboardLayout = () => {
  // Inicialmente, defina como null para não redirecionar imediatamente durante a verificação
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint('md');

  // Verificar status de autenticação
  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      // Pequeno delay para verificar se o usuário está realmente deslogado
      // ou se apenas está carregando a sessão ainda
      const timer = setTimeout(() => {
        setIsLoggedIn(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Função para navegação
  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Estado de carregamento
  if (isLoggedIn === null) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirecionar se não estiver logado
  if (isLoggedIn === false) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex flex-col md:flex-row min-h-screen w-full">
        <div 
          className={`fixed inset-0 bg-black/50 z-30 transition-opacity md:hidden ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        
        <div 
          className={`fixed top-0 left-0 h-full w-[240px] bg-background z-40 transform transition-transform md:relative md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarNavigation onNavigate={handleNavigate} />
        </div>
        
        <div className="flex-grow flex flex-col min-h-screen">
          {/* Header com menu do usuário */}
          <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="mr-2"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              )}
              
              <div className="ml-auto flex items-center gap-4">
                <ThemeToggle />
                <NotificationsMenu />
                <UserMenu />
              </div>
            </div>
          </header>

          {/* Conteúdo principal com transição de página animada */}
          <main className="flex-1 p-2 sm:p-4 pb-20">
            <AnimatePresence mode="wait">
              <PageTransition>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;
