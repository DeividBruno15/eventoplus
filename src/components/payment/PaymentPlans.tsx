
import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { PlansGrid } from './PlansGrid';
import { CurrentSubscriptionCard } from './CurrentSubscriptionCard';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { Plan } from '@/pages/Plans/types';
import { providerPlans, contractorPlans, advertiserPlans } from '@/pages/Plans/data/plans';
import { useAuth } from '@/hooks/useAuth';
import { FAQSection } from './FAQSection';

interface PaymentPlansProps {
  onSuccess?: () => void;
  currentSubscription?: any;
}

export const PaymentPlans = ({ onSuccess, currentSubscription }: PaymentPlansProps) => {
  const { user } = useAuth();
  const { subscribeToPlan, subscribeWithPix, isSubscribing } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);

  const userRole = user?.user_metadata?.role as 'provider' | 'contractor' | 'advertiser' | undefined;

  const allPlans = [
    ...(userRole === 'provider' ? providerPlans : []),
    ...(userRole === 'contractor' ? contractorPlans : []),
    ...(userRole === 'advertiser' ? advertiserPlans : []),
  ];

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowPaymentSelector(true);
  };

  const handleStripeCheckout = async (planId: string) => {
    if (!userRole) return;
    const plan = allPlans.find(p => p.id === planId);
    if (plan) {
      await subscribeToPlan(plan.id, plan.name, userRole);
      if (onSuccess) onSuccess();
    }
  };

  const handlePixCheckout = async (planId: string) => {
    if (!userRole) return;
    const plan = allPlans.find(p => p.id === planId);
    if (plan) {
      await subscribeWithPix(plan.id, plan.name, userRole);
      if (onSuccess) onSuccess();
    }
  };

  const handleBack = () => {
    setShowPaymentSelector(false);
    setSelectedPlan(null);
  };

  if (showPaymentSelector) {
    return (
      <PaymentMethodSelector
        selectedPlan={selectedPlan}
        onBack={handleBack}
        onStripeCheckout={handleStripeCheckout}
        onPixCheckout={handlePixCheckout}
        isProcessing={isSubscribing}
      />
    );
  }

  return (
    <div className="space-y-8">
      {currentSubscription && (
        <CurrentSubscriptionCard 
          planName={currentSubscription.plan_name} 
          expiresAt={currentSubscription.expires_at || new Date().toISOString()}
        />
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6">Escolha seu plano</h2>
        <PlansGrid 
          plans={allPlans}
          onSelectPlan={handleSelectPlan}
          currentPlanId={currentSubscription?.plan_id}
          isLoading={isSubscribing}
        />
      </div>

      <FAQSection />
    </div>
  );
};
