
import { Outlet, useLocation } from "react-router-dom";
import { SidebarNavigation } from "@/components/layout/SidebarNavigation";
import { UserMenu } from "@/components/layout/UserMenu";
import { NotificationsMenu } from "@/components/layout/notifications/NotificationsMenu";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PageTransition } from "@/components/ui/page-transition";
import { AnimatePresence } from "framer-motion";

const DashboardLayout = () => {
  // Inicialmente, defina como null para não redirecionar imediatamente durante a verificação
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
    <div className="flex flex-col md:flex-row min-h-screen">
      <SidebarNavigation 
        activePath={location.pathname} 
        onNavigate={handleNavigate}
      />
      <div className="flex-grow">
        {/* Header com menu do usuário */}
        <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-end px-4">
            <div className="flex items-center gap-4">
              <NotificationsMenu />
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Conteúdo principal com transição de página animada */}
        <main className="flex-1 p-4 pb-20">
          <AnimatePresence mode="wait">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
