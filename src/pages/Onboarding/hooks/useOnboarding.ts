
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, OnboardingFormData } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const useOnboarding = () => {
  const { user, updateOnboardingStatus, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      phone_number: '',
      accept_whatsapp: true,
      accept_terms: false,
    },
  });

  const handleSubmit = async (data: OnboardingFormData) => {
    if (step === 1) {
      try {
        // Atualiza o número de telefone no perfil do usuário
        const { error } = await supabase
          .from('user_profiles')
          .update({ 
            phone_number: data.phone_number 
          })
          .eq('id', user?.id);
          
        if (error) throw error;
        
        // Avança para o próximo passo
        setStep(2);
      } catch (error: any) {
        console.error('Erro ao atualizar telefone:', error);
        toast({
          title: "Erro ao atualizar dados",
          description: error.message || 'Ocorreu um erro ao atualizar seus dados',
          variant: "destructive",
        });
      }
    } else if (step === 2) {
      // Finaliza o onboarding
      await updateOnboardingStatus(true);
    }
  };

  return {
    user,
    form,
    step,
    loading,
    handleSubmit,
  };
};
