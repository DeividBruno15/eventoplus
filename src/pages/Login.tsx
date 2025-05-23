
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from '@/hooks/auth';
import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  const { login, signInWithGoogle, loading, session } = useAuth();
  
  // Redirect to dashboard if user is already logged in
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Acesse sua conta</CardTitle>
            <CardDescription>
              Entre com seus dados para acessar a plataforma
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <LoginForm 
              loading={loading}
              onSubmit={login}
              onGoogleLogin={signInWithGoogle}
            />
          </CardContent>
          
          <CardFooter className="text-center">
            <div className="w-full text-sm">
              Ainda não tem uma conta?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Cadastre-se
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
