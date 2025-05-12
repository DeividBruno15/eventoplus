
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { OnboardingStepIndicator } from '@/components/onboarding/OnboardingStepIndicator';
import { PlatformUsageStep } from './components/PlatformUsageStep';
import { ProviderTypeStep } from './components/ProviderTypeStep';
import { ConfirmationStep } from './components/ConfirmationStep';
import { PhoneAndTermsStep } from './components/PhoneAndTermsStep';
import { useAuth } from '@/hooks/useAuth';
import { OnboardingStep, OnboardingFunctionsData } from './types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingFunctionsSchema } from './types';
import { useOnboardingFunctions } from '@/hooks/useOnboardingFunctions';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveUserFunctions, loading: submitting } = useOnboardingFunctions();
  
  const form = useForm<OnboardingFunctionsData>({
    resolver: zodResolver(onboardingFunctionsSchema),
    defaultValues: {
      is_contratante: false,
      is_prestador: false,
      candidata_eventos: false,
      divulga_servicos: false,
      divulga_eventos: false,
      divulga_locais: false,
      phone_number: '',
      accept_whatsapp: true,
      accept_terms: false,
    },
  });
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.PLATFORM_USAGE);

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

  const goToNext = () => {
    const { is_prestador } = form.getValues();
    
    if (currentStep === OnboardingStep.PLATFORM_USAGE) {
      if (is_prestador) {
        setCurrentStep(OnboardingStep.PROVIDER_TYPE);
      } else {
        setCurrentStep(OnboardingStep.CONFIRMATION);
      }
    } else if (currentStep === OnboardingStep.PROVIDER_TYPE) {
      setCurrentStep(OnboardingStep.CONFIRMATION);
    } else if (currentStep === OnboardingStep.CONFIRMATION) {
      setCurrentStep(OnboardingStep.PHONE_TERMS);
    }
  };

  const goBack = () => {
    const { is_prestador } = form.getValues();
    
    if (currentStep === OnboardingStep.PROVIDER_TYPE) {
      setCurrentStep(OnboardingStep.PLATFORM_USAGE);
    } else if (currentStep === OnboardingStep.CONFIRMATION) {
      if (is_prestador) {
        setCurrentStep(OnboardingStep.PROVIDER_TYPE);
      } else {
        setCurrentStep(OnboardingStep.PLATFORM_USAGE);
      }
    } else if (currentStep === OnboardingStep.PHONE_TERMS) {
      setCurrentStep(OnboardingStep.CONFIRMATION);
    }
  };

  const handleSubmit = () => {
    saveUserFunctions(form.getValues());
  };

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
              <PhoneAndTermsStep form={form} onSubmit={handleSubmit} onBack={goBack} loading={submitting} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
