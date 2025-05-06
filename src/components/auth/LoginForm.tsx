
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { LoginDivider } from './LoginDivider';
import { GoogleLoginButton } from './GoogleLoginButton';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
});

interface LoginFormProps {
  loading: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleLogin: () => void;
}

export const LoginForm = ({ loading, onSubmit, onGoogleLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateForm = () => {
    try {
      loginSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field as 'email' | 'password'] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!validateForm()) return;
    
    try {
      await onSubmit(email, password);
    } catch (error: any) {
      console.error('Login error details:', error);
      
      // Default message
      let errorMessage = 'E-mail ou senha incorretos';
      
      // Handle specific error codes from Supabase
      if (error.error?.message) {
        if (error.error.message.includes('Email not confirmed')) {
          errorMessage = 'Verifique seu e-mail para ativar a conta';
        } else if (error.error.message.includes('locked')) {
          errorMessage = 'Sua conta está bloqueada';
        } else if (error.error.message.includes('rate limit')) {
          errorMessage = 'Muitas tentativas. Aguarde e tente novamente';
        }
      }
      
      setFormError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: errorMessage
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          disabled={loading}
          className={`w-full ${errors.email ? 'border-destructive' : ''}`}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <Link 
            to="/forgot-password" 
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Esqueceu a senha?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={loading}
          className={`w-full ${errors.password ? 'border-destructive' : ''}`}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : 'Entrar'}
      </Button>

      <LoginDivider />
      
      <GoogleLoginButton loading={loading} onLogin={onGoogleLogin} />
    </form>
  );
};
