
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterForm } from './components/RegisterForm';
import { useAuth } from '@/hooks/auth';
import { Navigate, useLocation } from 'react-router-dom';

const Register = () => {
  const { session } = useAuth();
  const location = useLocation();
  
  // Verificar se há dados de onboarding
  const hasOnboardingData = location.state && location.state.onboardingData;

  // Redirect to dashboard if already logged in
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Se não tiver dados de onboarding, redirecionar para o onboarding
  if (!hasOnboardingData) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Complete seu cadastro</CardTitle>
            <CardDescription>
              Preencha os dados para finalizar seu cadastro na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
