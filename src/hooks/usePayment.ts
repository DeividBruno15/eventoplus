
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface CreatePaymentParams {
  amount: number; // em centavos
  planId?: string;
  eventId?: string;
}

interface PaymentResult {
  success: boolean;
  clientSecret?: string;
  paymentId?: string;
  error?: string;
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Função para criar um pagamento
  const createPayment = async (params: CreatePaymentParams): Promise<PaymentResult> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para realizar um pagamento.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: params
      });
      
      if (error) throw error;
      
      return {
        success: true,
        clientSecret: data.clientSecret,
        paymentId: data.paymentId
      };
    } catch (error: any) {
      console.error('Error creating payment:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: error.message || "Não foi possível processar o pagamento. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return {
        success: false,
        error: error.message || 'Failed to create payment'
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para atualizar o status de um pagamento
  const updatePaymentStatus = async (paymentId: string, status: string): Promise<boolean> => {
    try {
      const { error } = await supabase.functions.invoke('update-payment-status', {
        body: {
          paymentId,
          status
        }
      });
      
      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      return false;
    }
  };
  
  return { 
    createPayment,
    updatePaymentStatus,
    isLoading
  };
};
