
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export interface CreatePaymentArgs {
  venueId: string;
  venueName: string;
  amount: number; // amount in cents
  selectedDates: Date[];
  redirectUrl?: string;
}

export const paymentsService = {
  /**
   * Create a payment session using Stripe
   */
  async createPaymentSession(args: CreatePaymentArgs): Promise<string | null> {
    try {
      const { venueId, venueName, amount, selectedDates, redirectUrl } = args;
      
      // Call our backend function to create a Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          venue_id: venueId,
          venue_name: venueName,
          amount: amount,
          dates: selectedDates.map(date => date.toISOString().split('T')[0]),
          success_url: redirectUrl || window.location.origin + `/payment-success?venue_id=${venueId}`,
          cancel_url: redirectUrl || window.location.origin + `/venues/${venueId}`,
        },
      });

      if (error) {
        console.error('Error creating payment session:', error);
        throw error;
      }

      return data.url;
    } catch (error) {
      console.error('Error in createPaymentSession:', error);
      toast.error('Falha ao criar sessão de pagamento');
      return null;
    }
  },

  /**
   * Verify a payment status after the payment process
   */
  async verifyPayment(sessionId: string): Promise<{success: boolean, paymentId?: string}> {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { session_id: sessionId }
      });
      
      if (error) throw error;
      
      return {
        success: data.success,
        paymentId: data.payment_id
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      return { success: false };
    }
  }
};
