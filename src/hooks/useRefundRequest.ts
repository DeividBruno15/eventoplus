
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { usePayment } from '@/hooks/usePayment';

interface RefundRequestParams {
  paymentId: string;
  amount?: number; // Optional for partial refunds
  reason: string;
}

export const useRefundRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { requestRefund } = usePayment();
  
  const initiateRefund = async ({ paymentId, amount, reason }: RefundRequestParams): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para solicitar um reembolso.",
        variant: "destructive"
      });
      return false;
    }
    
    setIsLoading(true);
    setIsSuccess(false);
    
    try {
      // First check if payment can be refunded using database function
      const { data: canRefundCheck, error: checkError } = await supabase.rpc(
        'can_refund_payment', 
        { payment_id_param: paymentId }
      );
      
      if (checkError) {
        console.error('Error checking refund eligibility:', checkError);
        throw new Error('Erro ao verificar elegibilidade do reembolso');
      }
      
      if (!canRefundCheck) {
        throw new Error('Este pagamento não está elegível para reembolso');
      }
      
      // Use existing payment hook to process refund
      const result = await requestRefund({
        paymentId,
        amount,
        reason
      });
      
      if (!result) {
        throw new Error('Falha ao processar o reembolso');
      }
      
      // If successful
      setIsSuccess(true);
      toast({
        title: "Reembolso solicitado",
        description: "Seu pedido de reembolso foi recebido e está sendo processado."
      });
      
      return true;
    } catch (error: any) {
      console.error('Error requesting refund:', error);
      toast({
        title: "Erro no reembolso",
        description: error.message || "Não foi possível processar seu pedido de reembolso.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    initiateRefund,
    isLoading,
    isSuccess
  };
};
