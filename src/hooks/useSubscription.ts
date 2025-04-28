
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
      const { data: clientToken } = await supabase.auth.getSession();
      
      console.log("Creating subscription with:", {
        planId,
        planName,
        role
      });
      
      // First create the subscription in the database
      const response = await fetch(`${window.location.origin}/api/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${clientToken.session?.access_token}`
        },
        body: JSON.stringify({
          planId,
          planName,
          role
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Subscription error:", errorData);
        throw new Error(errorData.error || 'Erro ao processar assinatura');
      }
      
      const subscriptionResult = await response.json();
      console.log("Subscription result:", subscriptionResult);
      
      // Now create a payment intent with Stripe
      const paymentResponse = await fetch(`${window.location.origin}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${clientToken.session?.access_token}`
        },
        body: JSON.stringify({
          amount: getPlanPrice(planId),
          planId
        })
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        console.error("Payment error:", errorData);
        throw new Error(errorData.error || 'Erro ao processar pagamento');
      }
      
      const paymentResult = await paymentResponse.json();
      console.log("Payment result:", paymentResult);
      
      // Redirect to Stripe Checkout
      window.location.href = paymentResult.url;
      
      toast({
        title: "Redirecionando para o pagamento",
        description: "Você será redirecionado para a página de pagamento do Stripe.",
      });
      
      // Refresh subscription data
      await subscriptionQuery.refetch();
      
      return subscriptionResult.subscription;
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

  // Helper function to get the price of a plan based on its ID
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
