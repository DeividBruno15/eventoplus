
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { providerPlans, contractorPlans, advertiserPlans } from "@/pages/Plans/data/plans";
import { Plan } from "@/pages/Plans/types";
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { CurrentSubscriptionCard } from './CurrentSubscriptionCard';
import { PlansGrid } from './PlansGrid';
import { FAQSection } from './FAQSection';
import { DowngradeConfirmationDialog } from './DowngradeConfirmationDialog';

interface PaymentPlansProps {
  onSelectPlan?: (plan: {id: string, name: string, price: number}) => void;
  onSuccess?: () => void;
  currentSubscription?: {
    id: string;
    plan_id: string;
    plan_name: string;
    status: string;
    expires_at: string;
    role: string;
  } | null;
}

export const PaymentPlans = ({ onSuccess }: PaymentPlansProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { subscription, subscribeToPlan, isSubscribing, refetch } = useSubscription();
  const userRole = user?.user_metadata?.role || 'contractor';
  
  // States to control the downgrade dialog
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);
  const [selectedFreePlan, setSelectedFreePlan] = useState<{id: string, name: string, benefits: string[]} | null>(null);
  
  // State for payment method screen
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Get plans based on user role
  const getPlansForRole = (): Plan[] => {
    if (userRole === 'provider') {
      return providerPlans;
    } else if (userRole === 'contractor') {
      return contractorPlans;
    } else if (userRole === 'advertiser') {
      return advertiserPlans;
    }
    return [];
  };
  
  const plans = getPlansForRole();
  
  // Find the free plan for the user's role
  const getFreePlan = (): Plan | undefined => {
    return plans.find(p => p.price === 0);
  };
  
  // Function to handle plan selection
  const handlePlanSelection = async (plan: Plan) => {
    try {
      if (!plan) {
        toast({
          title: "Erro",
          description: "Plano não encontrado",
          variant: "destructive"
        });
        return;
      }
      
      // Check if it's a free plan and the user already has an active subscription
      if (plan.price === 0 && subscription && subscription.plan_id !== plan.id) {
        // Get the benefits that will be lost when downgrading
        const currentPlan = plans.find(p => p.id === subscription.plan_id);
        if (currentPlan && currentPlan.price > 0) {
          // Filter benefits that exist only in the current plan
          const lostBenefits = currentPlan.benefits.filter(
            benefit => !plan.benefits.includes(benefit)
          );
          
          // Open the downgrade confirmation dialog
          setSelectedFreePlan({
            id: plan.id,
            name: plan.name,
            benefits: lostBenefits
          });
          setShowDowngradeDialog(true);
          return;
        }
      }
      
      // If it's not a free plan, show payment method selector
      if (plan.price > 0) {
        setSelectedPlan(plan);
        setShowPaymentMethods(true);
        return;
      }
      
      // If it's a free plan and user doesn't have a subscription, proceed normally
      await subscribeToPlan(plan.id, plan.name, userRole);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao selecionar plano:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua assinatura. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };
  
  // Function to confirm the downgrade to the free plan
  const handleConfirmDowngrade = async () => {
    if (!selectedFreePlan) return;
    
    try {
      // Invoke the edge function create-subscription directly via Supabase
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          planId: selectedFreePlan.id,
          planName: selectedFreePlan.name,
          role: userRole
        }
      });
      
      if (error) throw new Error(error.message);
      
      // Update the subscription in the local state
      await refetch();
      
      if (onSuccess) {
        onSuccess();
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error("Erro ao fazer downgrade para plano gratuito:", error);
      toast({
        title: "Erro",
        description: "Não foi possível completar a alteração para o plano gratuito. Tente novamente mais tarde.",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };
  
  // Close the downgrade dialog
  const handleCloseDowngradeDialog = () => {
    setShowDowngradeDialog(false);
    setSelectedFreePlan(null);
  };
  
  // Function to handle Stripe checkout
  const handleStripeCheckout = async (planId: string) => {
    await subscribeToPlan(planId, selectedPlan?.name || '', userRole);
  };
  
  // Function to handle Pix checkout (to be integrated with Abacate Pay)
  const handlePixCheckout = async (planId: string) => {
    // Future implementation for Abacate Pay
    toast({
      title: "Em breve",
      description: "Pagamento via PIX com Abacate Pay será implementado em breve.",
    });
  };

  // If showing the payment method selector
  if (showPaymentMethods && selectedPlan) {
    return (
      <PaymentMethodSelector 
        selectedPlan={selectedPlan}
        onBack={() => setShowPaymentMethods(false)}
        onStripeCheckout={handleStripeCheckout}
        onPixCheckout={handlePixCheckout}
        isProcessing={isSubscribing}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Escolha seu plano</h2>
      
      {subscription && (
        <CurrentSubscriptionCard 
          planName={subscription.plan_name} 
          expiresAt={subscription.expires_at} 
        />
      )}
      
      <PlansGrid 
        plans={plans} 
        currentPlanId={subscription?.plan_id || null} 
        isSubscribing={isSubscribing}
        onSelectPlan={handlePlanSelection} 
      />
      
      {/* Downgrade confirmation dialog */}
      {selectedFreePlan && subscription && (
        <DowngradeConfirmationDialog 
          isOpen={showDowngradeDialog}
          onClose={handleCloseDowngradeDialog}
          onConfirm={handleConfirmDowngrade}
          currentPlanName={subscription.plan_name}
          freePlanName={selectedFreePlan.name}
          freePlanId={selectedFreePlan.id}
          currentPlanEndDate={subscription.expires_at}
          lostBenefits={selectedFreePlan.benefits}
        />
      )}
      
      <FAQSection />
    </div>
  );
};
