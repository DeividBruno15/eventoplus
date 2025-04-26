
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordStrengthMeter } from '../Register/components/PasswordStrengthMeter';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    // Check if we have a session with a valid recovery token
    const checkRecoveryToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/login');
        toast({
          title: "Link inválido ou expirado",
          description: "Por favor, solicite um novo link de recuperação de senha.",
          variant: "destructive",
        });
      }
    };
    
    checkRecoveryToken();
  }, [navigate, toast]);

  useEffect(() => {
    // Check password requirements
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    });
  }, [password]);

  const allRequirementsMet = Object.values(passwordRequirements).every(req => req === true);

  const validatePassword = () => {
    if (!allRequirementsMet) {
      setError('A senha não atende aos requisitos de segurança');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso. Você pode fazer login agora.",
      });
      
      // Redireciona após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar senha",
        description: error.message || "Ocorreu um erro ao tentar atualizar sua senha",
        variant: "destructive",
      });
      setError(error.message || "Ocorreu um erro ao tentar atualizar sua senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Redefinir senha</CardTitle>
            <CardDescription className="text-gray-600">
              {!success ? "Digite sua nova senha segura" : "Senha redefinida com sucesso!"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-sm text-blue-700">
                      Sua senha deve conter:
                    </AlertDescription>
                    <ul className="mt-2 text-sm space-y-1">
                      <li className={`flex items-center ${passwordRequirements.length ? 'text-green-600' : 'text-gray-600'}`}>
                        <span className={`mr-2 text-lg ${passwordRequirements.length ? '✓' : '•'}`}></span>
                        Pelo menos 8 caracteres
                      </li>
                      <li className={`flex items-center ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-600'}`}>
                        <span className={`mr-2 text-lg ${passwordRequirements.uppercase ? '✓' : '•'}`}></span>
                        Uma letra maiúscula
                      </li>
                      <li className={`flex items-center ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-600'}`}>
                        <span className={`mr-2 text-lg ${passwordRequirements.lowercase ? '✓' : '•'}`}></span>
                        Uma letra minúscula
                      </li>
                      <li className={`flex items-center ${passwordRequirements.number ? 'text-green-600' : 'text-gray-600'}`}>
                        <span className={`mr-2 text-lg ${passwordRequirements.number ? '✓' : '•'}`}></span>
                        Um número
                      </li>
                      <li className={`flex items-center ${passwordRequirements.special ? 'text-green-600' : 'text-gray-600'}`}>
                        <span className={`mr-2 text-lg ${passwordRequirements.special ? '✓' : '•'}`}></span>
                        Um caractere especial (!@#$%^&*()_+...)
                      </li>
                    </ul>
                  </Alert>
                  
                  <Label htmlFor="password" className="text-gray-700">Nova senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full p-3"
                    minLength={8}
                  />
                  <PasswordStrengthMeter password={password} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirme a senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full p-3"
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 p-3 rounded-md flex items-center gap-2 text-red-700 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full py-2.5 bg-primary hover:bg-primary/90 transition-all duration-200" 
                  disabled={loading || !allRequirementsMet}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Atualizando...
                    </>
                  ) : 'Atualizar senha'}
                </Button>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-700 mb-6">
                  Sua senha foi redefinida com sucesso. Você será redirecionado para a página de login em instantes.
                </p>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="bg-primary hover:bg-primary/90"
                >
                  Ir para o login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
