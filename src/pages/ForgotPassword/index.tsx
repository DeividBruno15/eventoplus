
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, MailCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  // Redirect if user is already logged in
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Ocorreu um erro ao tentar enviar o email de recuperação",
        variant: "destructive",
      });
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
            <CardTitle className="text-2xl font-bold text-gray-800">Recuperar senha</CardTitle>
            <CardDescription className="text-gray-600">
              {!submitted
                ? "Digite seu email para receber instruções de recuperação de senha"
                : "Verifique seu email para as instruções de recuperação de senha"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    disabled={loading}
                    className="w-full p-3 border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-2.5 bg-primary hover:bg-primary/90 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : 'Recuperar senha'}
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <MailCheck className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Se existir uma conta com este email, você receberá um link para redefinir sua senha.
                  Verifique também sua pasta de spam.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="hover:bg-gray-100">
                  Tentar novamente
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

export default ForgotPassword;
