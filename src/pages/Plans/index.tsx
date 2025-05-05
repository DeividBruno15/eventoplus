
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/contexts/SessionContext';
import { useSubscription } from '@/hooks/useSubscription';
import { providerPlans, contractorPlans, advertiserPlans } from "./data/plans";
import { PlansHeader } from './components/PlansHeader';
import { ProviderPlans } from './components/ProviderPlans';
import { ContractorPlans } from './components/ContractorPlans';
import { AdvertiserPlans } from './components/AdvertiserPlans';
import { NotLoggedInPlans } from './components/NotLoggedInPlans';

const Plans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { session } = useSession();
  const { subscription, subscribeToPlan, isSubscribing } = useSubscription();
  const [userRole, setUserRole] = useState<'provider' | 'contractor' | 'advertiser' | null>(null);

  useEffect(() => {
    if (user) {
      const role = user.user_metadata?.role as 'provider' | 'contractor' | 'advertiser' || null;
      setUserRole(role);
    }
  }, [user]);

  const handleSubscribe = async (planId: string) => {
    if (!userRole) {
      toast({
        title: "Erro",
        description: "Seu tipo de conta não está definido. Por favor, atualize seu perfil.",
        variant: "destructive"
      });
      return;
    }

    if (planId.includes('essential') || planId.includes('discover') || planId.includes('basic')) {
      toast({
        title: "Plano Gratuito",
        description: "Você selecionou um plano gratuito. Não é necessário pagamento.",
      });
      await subscribeToPlan(planId, getPlanName(planId), userRole);
      return;
    }

    try {
      console.log("Subscribing to plan:", planId);
      await subscribeToPlan(planId, getPlanName(planId), userRole);
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Erro na assinatura",
        description: "Não foi possível processar a assinatura. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const getPlanName = (planId: string): string => {
    const allPlans = [...providerPlans, ...contractorPlans, ...advertiserPlans];
    const plan = allPlans.find(p => p.id === planId);
    return plan ? plan.name : "Plano";
  };

  return (
    <div className="min-h-screen bg-page">
      <main className="container py-12">
        <PlansHeader subscription={subscription} userRole={userRole} />

        <div className="space-y-8">
          {userRole === 'provider' ? (
            <ProviderPlans 
              plans={providerPlans} 
              onSubscribe={handleSubscribe} 
              isSubscribing={isSubscribing} 
            />
          ) : userRole === 'contractor' ? (
            <ContractorPlans 
              plans={contractorPlans} 
              onSubscribe={handleSubscribe} 
              isSubscribing={isSubscribing} 
            />
          ) : userRole === 'advertiser' ? (
            <AdvertiserPlans 
              plans={advertiserPlans} 
              onSubscribe={handleSubscribe} 
              isSubscribing={isSubscribing} 
            />
          ) : (
            <NotLoggedInPlans />
          )}
        </div>
      </main>
    </div>
  );
};

export default Plans;
