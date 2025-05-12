
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, isLoadingAuth } = useAuth();

  // Se estiver carregando, poderia mostrar um spinner ou componente de loading
  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado mas não completou o onboarding
  if (user && !user.user_metadata?.is_onboarding_complete) {
    return <>{children}</>; // Permitir acesso à página de onboarding
  }

  // Usuário autenticado e com onboarding completo
  return <>{children}</>;
};

export default PrivateRoute;
