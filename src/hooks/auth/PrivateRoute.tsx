
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { useEffect } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Effect to check and redirect to onboarding if necessary
  useEffect(() => {
    if (user && !user.user_metadata?.is_onboarding_complete && window.location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [user, navigate]);

  // If loading, show a spinner or loading component
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated user
  return <>{children}</>;
};

export default PrivateRoute;
