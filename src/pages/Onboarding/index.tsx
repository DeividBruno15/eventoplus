
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';

import { OnboardingStepIndicator } from './components/OnboardingStepIndicator';
import { WhatsAppStep } from './components/WhatsAppStep';
import { TermsStep } from './components/TermsStep';
import { useOnboarding } from './hooks/useOnboarding';

const Onboarding = () => {
  const { user, form, step, loading, handleSubmit } = useOnboarding();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar esta página",
        variant: "destructive",
      });
    }
  }, [user, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Bem-vindo(a)! Vamos finalizar seu cadastro</CardTitle>
            <CardDescription>
              Apenas mais alguns passos para você começar a usar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingStepIndicator currentStep={step} />
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {step === 1 && <WhatsAppStep form={form} />}
                {step === 2 && <TermsStep form={form} loading={loading} />}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
