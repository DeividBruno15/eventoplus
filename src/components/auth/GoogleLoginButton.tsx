
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

interface GoogleLoginButtonProps {
  loading: boolean;
  onLogin: () => void;
}

export const GoogleLoginButton = ({ loading, onLogin }: GoogleLoginButtonProps) => {
  return (
    <Button 
      type="button" 
      variant="outline" 
      className="w-full"
      onClick={onLogin}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        <>
          <FcGoogle className="w-5 h-5 mr-2" />
          Entrar com Google
        </>
      )}
    </Button>
  );
};
