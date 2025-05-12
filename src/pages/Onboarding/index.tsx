
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { OnboardingStepIndicator } from '@/components/onboarding/OnboardingStepIndicator';
import { PlatformUsageStep } from './components/PlatformUsageStep';
import { ProviderTypeStep } from './components/ProviderTypeStep';
import { ConfirmationStep } from './components/ConfirmationStep';
import { PhoneAndTermsStep } from './components/PhoneAndTermsStep';
import { useAuth } from '@/hooks/auth';
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

  useEffect(() => {
    // If the user is already registered and has completed onboarding, redirect to dashboard
    if (user?.user_metadata?.is_onboarding_complete) {
      navigate('/dashboard');
      toast({
        title: "Onboarding já concluído",
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
        <Card className="w-full max-w-4xl shadow-lg">
          <CardHeader className="text-center p-8">
            <CardTitle className="text-2xl md:text-3xl font-bold">Bem-vindo(a)! Vamos configurar sua conta</CardTitle>
            <CardDescription className="text-base mt-2">
              Conte-nos como você deseja utilizar nossa plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <OnboardingStepIndicator currentStep={currentStep} totalSteps={4} />
            
            <div className="mt-8">
              {currentStep === 1 && 
                <PlatformUsageStep form={form} onNext={goToNext} />}
                
              {currentStep === 2 && 
                <ProviderTypeStep form={form} onNext={goToNext} onBack={goBack} />}
                
              {currentStep === 3 && 
                <ConfirmationStep form={form} onNext={goToNext} onBack={goBack} />}
                
              {currentStep === 4 && 
                <PhoneAndTermsStep form={form} onSubmit={onSubmitForm} onBack={goBack} loading={submitting} />}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
