
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { providerPlans, contractorPlans, advertiserPlans } from "@/pages/Plans/data/plans";
import { Plan } from "@/pages/Plans/types";
import { DowngradeConfirmationDialog } from './DowngradeConfirmationDialog';
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethodSelector } from './PaymentMethodSelector';

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

  // Find the free plan
  const freePlan = getFreePlan();

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
        <Card className="bg-muted/50 mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Sua assinatura atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">{subscription.plan_name}</h3>
                {new Date(subscription.expires_at) > new Date() && (
                  <p className="text-sm text-muted-foreground">
                    Válido até {new Date(subscription.expires_at).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
              <div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Ativo
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans.map((plan) => {
          // Check if this is the user's current plan
          const isCurrentPlan = subscription?.plan_id === plan.id;
          
          return (
            <Card 
              key={plan.id} 
              className={`${
                plan.featured 
                  ? 'border-primary shadow-md relative overflow-hidden' 
                  : ''
              } ${
                isCurrentPlan ? 'bg-muted' : ''
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-0 bg-primary text-white py-1 px-3 text-xs">
                  <Zap className="h-4 w-4 inline mr-1" />
                  RECOMENDADO
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute top-0 left-0 bg-secondary text-secondary-foreground py-1 px-3 text-xs">
                  PLANO ATUAL
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {plan.featured && <Zap className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">
                    {plan.price === 0 ? 'Grátis' : `R$ ${(plan.price / 100).toFixed(2)}`}
                  </span>
                  {plan.price > 0 && <span className="text-sm text-muted-foreground">/mês</span>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.benefits.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.featured ? 'default' : 'outline'}
                  onClick={() => handlePlanSelection(plan)}
                  disabled={isCurrentPlan || isSubscribing}
                >
                  {isSubscribing 
                    ? 'Processando...'
                    : isCurrentPlan 
                      ? 'Plano atual' 
                      : plan.price === 0 
                        ? 'Selecionar plano gratuito' 
                        : 'Assinar plano'
                  }
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
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
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-medium mb-2">Perguntas frequentes</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Posso cancelar a qualquer momento?</h4>
            <p className="text-sm text-muted-foreground">
              Sim, você pode cancelar sua assinatura a qualquer momento. O acesso ao plano continua válido até o final do período pago.
            </p>
          </div>
          <div>
            <h4 className="font-medium">Como funciona o processo de pagamento?</h4>
            <p className="text-sm text-muted-foreground">
              Utilizamos o Stripe para pagamentos com cartão de crédito e em breve o Abacate Pay para pagamentos via PIX, garantindo segurança e facilidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
