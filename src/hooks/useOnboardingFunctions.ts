
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { OnboardingFunctionsData } from '@/pages/Onboarding/types';

export const useOnboardingFunctions = () => {
  const { user, updateOnboardingStatus } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const saveUserFunctions = async (data: OnboardingFunctionsData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Salvar dados na tabela user_profiles
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_contratante: data.is_contratante,
          is_prestador: data.is_prestador,
          candidata_eventos: data.candidata_eventos,
          divulga_servicos: data.divulga_servicos,
          divulga_eventos: data.divulga_eventos,
          divulga_locais: data.divulga_locais,
          phone_number: data.phone_number,
          whatsapp_opt_in: data.accept_whatsapp,
          is_onboarding_complete: true
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Atualizar o status de onboarding
      await updateOnboardingStatus(true);
      
      // Mostrar toast de sucesso
      toast({
        title: "Cadastro concluído com sucesso!",
        description: "Bem-vindo à plataforma. Você já pode começar a usar!",
      });
      
      // Redirecionar para o dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro ao salvar preferências de uso:', error);
      toast({
        title: "Erro ao finalizar o cadastro",
        description: error.message || "Ocorreu um erro ao salvar suas preferências",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    saveUserFunctions,
    loading
  };
};
