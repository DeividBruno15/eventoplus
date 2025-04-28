
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface Subscription {
  id: string;
  plan_id: string;
  plan_name: string;
  status: string;
  expires_at: string;
  role: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubscribing, setIsSubscribing] = useState(false);

  const subscriptionQuery = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      return data as Subscription | null;
    },
    enabled: !!user,
  });

  const subscribeToPlan = async (planId: string, planName: string, role: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para assinar um plano.",
        variant: "destructive"
      });
      return null;
    }

    setIsSubscribing(true);
    try {
      // First, create the subscription record in the database
      console.log("Creating subscription with:", {
        planId,
        planName,
        role
      });
      
      // Use Supabase edge function to create subscription
      const { data: subscriptionResult, error: subscriptionError } = await supabase.functions.invoke(
        'create-subscription',
        {
          body: {
            planId,
            planName,
            role
          }
        }
      );

      if (subscriptionError) {
        console.error("Subscription error:", subscriptionError);
        throw new Error(subscriptionError.message || 'Erro ao processar assinatura');
      }
      
      console.log("Subscription result:", subscriptionResult);
      
      // Create payment intent using the Edge Function
      const { data: paymentResult, error: paymentError } = await supabase.functions.invoke(
        'create-payment-intent',
        {
          body: {
            amount: getPlanPrice(planId),
            planId
          }
        }
      );

      if (paymentError) {
        console.error("Payment error:", paymentError);
        throw new Error(paymentError.message || 'Erro ao processar pagamento');
      }
      
      console.log("Payment result:", paymentResult);
      
      // Redirect to Stripe Checkout
      if (paymentResult.url) {
        window.location.href = paymentResult.url;
      } else {
        throw new Error('URL de checkout não retornada');
      }
      
      toast({
        title: "Redirecionando para o pagamento",
        description: "Você será redirecionado para a página de pagamento do Stripe.",
      });
      
      // Update subscription data
      await subscriptionQuery.refetch();
      
      return subscriptionResult?.subscription || null;
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast({
        title: "Erro na assinatura",
        description: error.message || "Não foi possível processar sua assinatura",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSubscribing(false);
    }
  };

  // Helper function to get price based on plan ID
  const getPlanPrice = (planId: string): number => {
    // Provider plans
    if (planId === 'provider-essential') return 0;
    if (planId === 'provider-professional') return 1490; // R$ 14.90
    if (planId === 'provider-premium') return 2990; // R$ 29.90
    
    // Contractor plans
    if (planId === 'contractor-discover') return 0;
    if (planId === 'contractor-connect') return 1490; // R$ 14.90
    if (planId === 'contractor-management') return 2990; // R$ 29.90
    
    // Default price for unknown plans
    return 0;
  };

  return {
    subscription: subscriptionQuery.data,
    isLoading: subscriptionQuery.isLoading,
    isError: subscriptionQuery.isError,
    isSubscribing,
    subscribeToPlan,
    refetch: subscriptionQuery.refetch
  };
};
