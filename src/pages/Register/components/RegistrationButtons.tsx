
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';

interface RegistrationButtonsProps {
  isSubmitting: boolean;
  onGoogleLogin: () => void;
}

export const RegistrationButtons = ({ isSubmitting, onGoogleLogin }: RegistrationButtonsProps) => {
  return (
    <>
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processando...' : 'Finalizar Cadastro'}
      </Button>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <GoogleLoginButton 
            loading={isSubmitting} 
            onLogin={onGoogleLogin} 
            text="Cadastrar com Google"
          />
          
          <div className="text-center text-sm mt-4">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary/80"
            >
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
