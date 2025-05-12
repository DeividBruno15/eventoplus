
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OnboardingStep, OnboardingFunctionsData, onboardingFunctionsSchema } from '../types';
import { useAuth } from '@/hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useOnboarding = () => {
  const { user, updateOnboardingStatus, updateUserPreferences } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.PLATFORM_USAGE);
  const [submitting, setSubmitting] = useState(false);

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

  const saveUserPreferences = async (data: OnboardingFunctionsData) => {
    if (!user) return;
    
    setSubmitting(true);
    
    try {
      // Update user preferences
      await updateUserPreferences({
        is_contratante: data.is_contratante,
        is_prestador: data.is_prestador,
        candidata_eventos: data.candidata_eventos,
        divulga_servicos: data.divulga_servicos,
        divulga_eventos: data.divulga_eventos,
        divulga_locais: data.divulga_locais,
      });
      
      // Update user profile
      await updateOnboardingStatus(true);
      
      toast({
        title: "Cadastro finalizado!",
        description: "Bem-vindo à plataforma! Seu perfil está pronto para uso.",
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Erro ao salvar preferências:', error);
      toast({
        title: "Erro ao finalizar cadastro",
        description: error.message || "Ocorreu um erro ao salvar suas preferências",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (formData: OnboardingFunctionsData) => {
    saveUserPreferences(formData);
  };

  return {
    form,
    currentStep,
    submitting,
    goToNext,
    goBack,
    handleSubmit
  };
};
