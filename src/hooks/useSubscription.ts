
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
      
      const response = await fetch('/api/create-subscription', {
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

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao processar assinatura');
      }

      toast({
        title: "Assinatura realizada",
        description: `Você assinou o plano ${planName} com sucesso!`,
      });
      
      // Refresh subscription data
      await subscriptionQuery.refetch();
      
      return result.subscription;
    } catch (error: any) {
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

  return {
    subscription: subscriptionQuery.data,
    isLoading: subscriptionQuery.isLoading,
    isError: subscriptionQuery.isError,
    isSubscribing,
    subscribeToPlan,
    refetch: subscriptionQuery.refetch
  };
};
