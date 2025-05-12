
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { OnboardingStepIndicator } from '@/components/onboarding/OnboardingStepIndicator';
import { PlatformUsageStep } from './components/PlatformUsageStep';
import { ProviderTypeStep } from './components/ProviderTypeStep';
import { ConfirmationStep } from './components/ConfirmationStep';
import { WhatsAppStep } from '@/components/onboarding/WhatsAppStep';
import { TermsStep } from '@/components/onboarding/TermsStep';
import { useOnboarding } from './hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';
import { OnboardingStep } from './types';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { form, currentStep, submitting, goToNext, goBack, handleSubmit } = useOnboarding();

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
            <OnboardingStepIndicator currentStep={currentStep} totalSteps={4} />
            
            {currentStep === OnboardingStep.PLATFORM_USAGE && 
              <PlatformUsageStep form={form} onNext={goToNext} />}
              
            {currentStep === OnboardingStep.PROVIDER_TYPE && 
              <ProviderTypeStep form={form} onNext={goToNext} onBack={goBack} />}
              
            {currentStep === OnboardingStep.CONFIRMATION && 
              <ConfirmationStep form={form} onNext={goToNext} onBack={goBack} />}
              
            {currentStep === OnboardingStep.PHONE_TERMS && 
              <WhatsAppStep form={form} onSubmit={handleSubmit} onBack={goBack} loading={submitting} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
