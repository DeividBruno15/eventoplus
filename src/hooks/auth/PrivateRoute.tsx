
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { useEffect } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Efeito para verificar e redirecionar para o onboarding se necessário
  useEffect(() => {
    if (user && !user.user_metadata?.is_onboarding_complete) {
      navigate('/onboarding');
    }
  }, [user, navigate]);

  // Se estiver carregando, mostrar um spinner ou componente de loading
  if (loading) {
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

  // Usuário autenticado
  return <>{children}</>;
};

export default PrivateRoute;
