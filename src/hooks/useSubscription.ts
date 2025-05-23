
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
      console.log("Creating subscription with:", {
        planId,
        planName,
        role
      });
      
      // Create payment checkout session using the edge function
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-checkout',
        {
          body: {
            planId,
            role,
            paymentMethod: 'card'
          }
        }
      );

      if (checkoutError) {
        console.error("Checkout error:", checkoutError);
        throw new Error(checkoutError.message || 'Erro ao processar checkout');
      }
      
      console.log("Checkout result:", checkoutData);
      
      // Redirect to Stripe Checkout
      if (checkoutData.url) {
        // Stripe checkout sessions cannot be displayed in an iframe
        // Open in top-level window
        window.top.location.href = checkoutData.url;
      } else {
        throw new Error('URL de checkout não retornada');
      }
      
      toast({
        title: "Redirecionando para o pagamento",
        description: "Você será redirecionado para a página de pagamento.",
      });
      
      // Update subscription data
      await subscriptionQuery.refetch();
      
      return true;
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

  const subscribeWithPix = async (planId: string, planName: string, role: string) => {
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
      console.log("Creating PIX subscription with:", {
        planId,
        planName,
        role
      });
      
      // Fall back to card payment as PIX is not enabled in Stripe yet
      return await subscribeToPlan(planId, planName, role);
    } catch (error: any) {
      console.error("PIX Subscription error:", error);
      toast({
        title: "Erro na assinatura via PIX",
        description: error.message || "Não foi possível processar sua assinatura via PIX",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSubscribing(false);
    }
  };

  return {
    subscription: subscriptionQuery.data,
    isLoading: subscriptionQuery.isLoading,
    isError: subscriptionQuery.isError,
    isSubscribing,
    subscribeToPlan,
    subscribeWithPix,
    refetch: subscriptionQuery.refetch
  };
};
