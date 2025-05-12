
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { OnboardingStepIndicator } from '@/components/onboarding/OnboardingStepIndicator';
import { PlatformUsageStep } from './components/PlatformUsageStep';
import { ProviderTypeStep } from './components/ProviderTypeStep';
import { ConfirmationStep } from './components/ConfirmationStep';
import { PhoneAndTermsStep } from './components/PhoneAndTermsStep';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from './hooks/useOnboarding';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    form,
    currentStep,
    submitting,
    goToNext,
    goBack,
    handleSubmit
  } = useOnboarding();

  // Verificar se o usuário já completou o onboarding
  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar esta página",
        variant: "destructive",
      });
      return;
    }
    
    // Se já completou o onboarding, redirecionar para o dashboard
    if (user.user_metadata?.is_onboarding_complete) {
      navigate('/dashboard');
      toast({
        title: "Cadastro já finalizado",
        description: "Seu perfil já está completo",
      });
    }
  }, [user, navigate, toast]);

  // Handler to wrap handleSubmit so it works with the PhoneAndTermsStep component
  const onSubmitForm = () => {
    const formData = form.getValues();
    handleSubmit(formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Bem-vindo(a)! Vamos finalizar seu cadastro</CardTitle>
            <CardDescription>
              Apenas mais alguns passos para você começar a usar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingStepIndicator currentStep={currentStep} totalSteps={4} />
            
            {currentStep === 1 && 
              <PlatformUsageStep form={form} onNext={goToNext} />}
              
            {currentStep === 2 && 
              <ProviderTypeStep form={form} onNext={goToNext} onBack={goBack} />}
              
            {currentStep === 3 && 
              <ConfirmationStep form={form} onNext={goToNext} onBack={goBack} />}
              
            {currentStep === 4 && 
              <PhoneAndTermsStep form={form} onSubmit={onSubmitForm} onBack={goBack} loading={submitting} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
