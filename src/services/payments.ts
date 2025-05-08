
import { supabase } from "@/integrations/supabase/client";

interface CreatePaymentSessionParams {
  venueId: string;
  venueName: string;
  amount: number; // in cents
  selectedDates: Date[];
}

export const paymentsService = {
  async createPaymentSession({ 
    venueId, 
    venueName, 
    amount, 
    selectedDates 
  }: CreatePaymentSessionParams): Promise<string | null> {
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          venue_id: venueId,
          venue_name: venueName,
          amount: amount,
          dates: selectedDates.map(date => date.toISOString().split('T')[0]),
          success_url: `${window.location.origin}/payment-success`,
          cancel_url: window.location.href,
        }
      });
      
      if (error) throw error;
      
      return data.url;
    } catch (error) {
      console.error("Error creating payment session:", error);
      return null;
    }
  },
  
  async verifyPayment(sessionId: string): Promise<{
    success: boolean;
    paymentId?: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: { session_id: sessionId }
      });
      
      if (error) throw error;
      
      return {
        success: data.success,
        paymentId: data.payment_id
      };
    } catch (error) {
      console.error("Error verifying payment:", error);
      return { success: false };
    }
  }
};
