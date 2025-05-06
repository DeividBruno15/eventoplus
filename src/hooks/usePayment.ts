
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { sendPaymentNotification } from '@/hooks/useEventNotifications';

interface CreatePaymentParams {
  amount: number; // em centavos
  planId?: string;
  eventId?: string;
  description?: string;
}

interface PaymentResult {
  success: boolean;
  clientSecret?: string;
  paymentId?: string;
  error?: string;
}

interface RefundParams {
  paymentId: string;
  amount?: number; // opcional, para reembolsos parciais
  reason?: string;
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);
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
  
  // Nova função para solicitar reembolso
  const requestRefund = async ({ paymentId, amount, reason }: RefundParams): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para solicitar um reembolso.",
        variant: "destructive",
      });
      return false;
    }
    
    setIsRefunding(true);
    try {
      const { data, error } = await supabase.functions.invoke('refund-payment', {
        body: {
          paymentId,
          amount,
          reason
        }
      });
      
      if (error) throw error;
      
      if (data.success) {
        toast({
          title: "Reembolso processado",
          description: "Seu reembolso foi processado com sucesso.",
        });
        
        // Enviar notificação de reembolso
        if (user.id) {
          await sendPaymentNotification(
            user.id, 
            amount ? amount / 100 : data.refundAmount / 100, 
            undefined, 
            true
          );
        }
        
        return true;
      } else {
        throw new Error(data.error || 'Falha ao processar reembolso');
      }
    } catch (error: any) {
      console.error('Error requesting refund:', error);
      toast({
        title: "Erro ao processar reembolso",
        description: error.message || "Não foi possível processar o reembolso. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsRefunding(false);
    }
  };
  
  // Função para buscar histórico de pagamentos do usuário
  const fetchPaymentHistory = async () => {
    if (!user) {
      return { data: [], error: 'User not authenticated' };
    }
    
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching payment history:', error);
      return { data: [], error: error.message };
    }
  };
  
  return { 
    createPayment,
    updatePaymentStatus,
    requestRefund,
    fetchPaymentHistory,
    isLoading,
    isRefunding
  };
};
