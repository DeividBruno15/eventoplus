
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { OnboardingStepIndicator } from './OnboardingStepIndicator';
import { UserTypeSelectionStep } from './UserTypeSelectionStep';
import { RegistrationDataStep } from './RegistrationDataStep';
import { ServicesSelectionStep } from './ServicesSelectionStep';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OnboardingFunctionsData, onboardingFunctionsSchema } from '@/pages/Onboarding/types';
import { useNavigate } from 'react-router-dom';

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingModal({ open, onOpenChange }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  
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

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    const formData = form.getValues();
    onOpenChange(false);
    navigate('/register', { 
      state: { 
        onboardingData: formData 
      } 
    });
  };

  const shouldShowServicesStep = () => {
    const { is_prestador } = form.watch();
    return is_prestador;
  };

  const getMaxSteps = () => {
    return shouldShowServicesStep() ? 3 : 2;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <h2 className="text-2xl font-bold mb-2">Bem-vindo(a)! Vamos configurar sua conta</h2>
          <p className="text-muted-foreground">
            Conte-nos como você deseja utilizar nossa plataforma
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          <OnboardingStepIndicator currentStep={currentStep} totalSteps={getMaxSteps()} />
          
          {currentStep === 1 && (
            <UserTypeSelectionStep 
              form={form} 
              onNext={handleNext}
            />
          )}
          
          {currentStep === 2 && (
            <RegistrationDataStep 
              form={form} 
              onNext={shouldShowServicesStep() ? handleNext : handleComplete}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 3 && shouldShowServicesStep() && (
            <ServicesSelectionStep 
              form={form} 
              onComplete={handleComplete}
              onBack={handleBack}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
