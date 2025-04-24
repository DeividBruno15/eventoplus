
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { LoginDivider } from './LoginDivider';
import { GoogleLoginButton } from './GoogleLoginButton';

interface LoginFormProps {
  loading: boolean;
  onSubmit: (email: string, password: string) => void;
  onGoogleLogin: () => void;
}

export const LoginForm = ({ loading, onSubmit, onGoogleLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="label">E-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="seu@email.com"
          required
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="label">Senha</label>
          <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
            Esqueceu a senha?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="••••••••"
          required
        />
      </div>
      
      <Button type="submit" className="w-full bg-primary" disabled={loading}>
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
