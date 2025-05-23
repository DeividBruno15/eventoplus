import { Outlet, useLocation } from "react-router-dom";
import { SidebarNavigation } from "@/components/layout/SidebarNavigation";
import { UserMenu } from "@/components/layout/UserMenu";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PageTransition } from "@/components/ui/page-transition";
import { AnimatePresence } from "framer-motion";
import { SidebarProvider } from "@/components/ui/sidebar/context";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import MobileNavigation from "@/components/layout/MobileNavigation";

const DashboardLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
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
  }, [user, navigate]);

  // Função para navegação
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Estado de carregamento
  if (isLoggedIn === null) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin mb-3 text-primary" />
          <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirecionar se não estiver logado
  if (isLoggedIn === false) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row min-h-screen w-full bg-background">
        {/* Sidebar for desktop */}
        {!isMobile && <SidebarNavigation onNavigate={handleNavigate} />}
        
        <div className="flex-grow flex flex-col">
          {/* Header with user menu for desktop */}
          <header className="hidden md:flex sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-end px-4 w-full">
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </header>

          {/* Main content with page transition animation */}
          <main className="flex-1 p-3 md:p-4 pb-24 md:pb-4">
            <AnimatePresence mode="wait">
              <PageTransition>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </main>
          
          {/* Mobile navigation */}
          {isMobile && <MobileNavigation />}
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;
