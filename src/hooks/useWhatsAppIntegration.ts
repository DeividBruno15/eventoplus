
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useWhatsAppIntegration() {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('phone_number, whatsapp_opt_in, whatsapp_verified')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setPhoneNumber(data.phone_number);
        setIsEnabled(data.whatsapp_opt_in ?? true);
        setIsVerified(data.whatsapp_verified ?? false);
      } catch (error) {
        console.error('Error fetching WhatsApp integration status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const updatePhoneNumber = async (newPhoneNumber: string) => {
    if (!user?.id) return false;

    try {
      // Remove any non-digit characters
      const formattedNumber = newPhoneNumber.replace(/\D/g, '');
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          phone_number: formattedNumber,
          whatsapp_verified: false // Reset verification status
        })
        .eq('id', user.id);

      if (error) throw error;

      setPhoneNumber(formattedNumber);
      setIsVerified(false);
      
      toast({
        title: "Número atualizado",
        description: "Seu número de WhatsApp foi atualizado. É necessário verificá-lo."
      });
      
      return true;
    } catch (error) {
      console.error('Error updating phone number:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o número de telefone",
        variant: "destructive"
      });
      return false;
    }
  };

  const toggleWhatsAppNotifications = async () => {
    if (!user?.id) return false;

    try {
      const newValue = !isEnabled;
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ whatsapp_opt_in: newValue })
        .eq('id', user.id);

      if (error) throw error;

      setIsEnabled(newValue);
      
      toast({
        title: newValue ? "WhatsApp ativado" : "WhatsApp desativado",
        description: newValue 
          ? "Você receberá notificações via WhatsApp" 
          : "Você não receberá mais notificações via WhatsApp"
      });
      
      return true;
    } catch (error) {
      console.error('Error toggling WhatsApp notifications:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as configurações do WhatsApp",
        variant: "destructive"
      });
      return false;
    }
  };

  const sendVerificationCode = async () => {
    if (!phoneNumber || !user?.id) return false;
    
    setIsVerifying(true);
    try {
      // Gerar um código de verificação de 6 dígitos
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Salvar o código temporariamente no perfil do usuário
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          whatsapp_verification_code: verificationCode,
          whatsapp_verification_sent_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Enviar o código via WhatsApp usando a função Edge
      const { data, error } = await supabase.functions.invoke('send-whatsapp-notification', {
        body: {
          user_id: user.id,
          phone_number: phoneNumber,
          message: `Seu código de verificação é: ${verificationCode}. Este código expira em 10 minutos.`,
          type: 'verification'
        }
      });

      if (error || !data.success) {
        throw new Error(error?.message || data?.error || 'Falha ao enviar código de verificação');
      }

      toast({
        title: "Código enviado",
        description: "Um código de verificação foi enviado para o seu WhatsApp"
      });
      
      return true;
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar o código de verificação",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyCode = async (code: string) => {
    if (!user?.id || !code) return false;
    
    setIsVerifying(true);
    try {
      // Verificar se o código corresponde ao armazenado
      const { data, error } = await supabase
        .from('user_profiles')
        .select('whatsapp_verification_code, whatsapp_verification_sent_at')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      const storedCode = data.whatsapp_verification_code;
      const sentAt = new Date(data.whatsapp_verification_sent_at);
      const now = new Date();
      const tenMinutesMs = 10 * 60 * 1000;
      
      // Verificar se o código é válido e não expirou (10 minutos)
      if (!storedCode || code !== storedCode || (now.getTime() - sentAt.getTime() > tenMinutesMs)) {
        toast({
          title: "Código inválido",
          description: "O código de verificação é inválido ou expirou",
          variant: "destructive"
        });
        return false;
      }
      
      // Atualizar o status de verificação
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          whatsapp_verified: true,
          whatsapp_verification_code: null,
          whatsapp_verified_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      setIsVerified(true);
      
      toast({
        title: "WhatsApp verificado",
        description: "Seu número de WhatsApp foi verificado com sucesso"
      });
      
      return true;
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: "Erro",
        description: "Não foi possível verificar o código",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    phoneNumber,
    isVerified,
    isEnabled,
    isLoading,
    isVerifying,
    updatePhoneNumber,
    toggleWhatsAppNotifications,
    sendVerificationCode,
    verifyCode
  };
}
