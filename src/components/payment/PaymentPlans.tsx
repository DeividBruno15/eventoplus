
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { providerPlans, contractorPlans, advertiserPlans } from "@/pages/Plans/data/plans";
import { Plan } from "@/pages/Plans/types";

interface PaymentPlansProps {
  onSelectPlan: (plan: {id: string, name: string, price: number}) => void;
  currentSubscription?: {
    id: string;
    plan_id: string;
    plan_name: string;
    status: string;
    expires_at: string;
    role: string;
  } | null;
}

export const PaymentPlans = ({ onSelectPlan, currentSubscription }: PaymentPlansProps) => {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'contractor';

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Escolha seu plano</h2>
      
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans.map((plan) => {
          // Verifica se este é o plano atual do usuário
          const isCurrentPlan = currentSubscription?.plan_id === plan.id;
          
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
                    {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2)}`}
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
                  onClick={() => onSelectPlan({
                    id: plan.id,
                    name: plan.name,
                    price: plan.price * 100 // Convert to cents for payment processing
                  })}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan 
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
              Utilizamos o Stripe como nossa processadora de pagamentos, garantindo segurança e facilidade. Você pode pagar com cartão de crédito.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
