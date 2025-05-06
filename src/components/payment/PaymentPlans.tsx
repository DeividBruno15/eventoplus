
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Zap } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  highlight?: boolean;
  role: 'provider' | 'contractor' | 'advertiser';
}

interface PaymentPlansProps {
  onSelectPlan: (plan: {id: string, name: string, price: number}) => void;
}

export const PaymentPlans = ({ onSelectPlan }: PaymentPlansProps) => {
  // Dados de exemplo para planos, idealmente viriam de uma API
  const plans: Plan[] = [
    {
      id: 'provider-professional',
      name: 'Provider Professional',
      description: 'Ideal para prestadores que estão começando',
      price: 7900, // R$ 79,00
      role: 'provider',
      features: [
        'Listagem nos resultados de busca',
        'Até 3 categorias de serviço',
        'Receba solicitações de eventos',
        'Suporte por chat'
      ]
    },
    {
      id: 'provider-premium',
      name: 'Provider Premium',
      description: 'Destaque-se e amplie seus negócios',
      price: 14900, // R$ 149,00
      role: 'provider',
      highlight: true,
      features: [
        'Posicionamento prioritário nas buscas',
        'Até 5 categorias de serviço',
        'Emblema "Premium" no perfil',
        'Relatórios detalhados',
        'Suporte prioritário'
      ]
    },
    {
      id: 'contractor-connect',
      name: 'Contractor Connect',
      description: 'Para organizadores de eventos ocasionais',
      price: 4900, // R$ 49,00
      role: 'contractor',
      features: [
        'Crie até 3 eventos por mês',
        'Acesso a todos os prestadores',
        'Ferramentas básicas de gerenciamento',
        'Suporte por chat'
      ]
    },
    {
      id: 'contractor-management',
      name: 'Contractor Management',
      description: 'Solução completa para produtores profissionais',
      price: 9900, // R$ 99,00
      role: 'contractor',
      highlight: true,
      features: [
        'Crie eventos ilimitados',
        'Ferramentas avançadas de gerenciamento',
        'Prioridade na resposta de prestadores',
        'Relatórios detalhados de eventos',
        'Suporte prioritário'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Escolha seu plano</h2>
      
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`${
              plan.highlight 
                ? 'border-primary shadow-md relative overflow-hidden' 
                : ''
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-0 bg-primary text-white py-1 px-3 text-xs">
                <Zap className="h-4 w-4 inline mr-1" />
                RECOMENDADO
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {plan.highlight && <Zap className="h-5 w-5 text-primary" />}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">
                  R$ {(plan.price / 100).toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
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
                variant={plan.highlight ? 'default' : 'outline'}
                onClick={() => onSelectPlan({
                  id: plan.id,
                  name: plan.name,
                  price: plan.price
                })}
              >
                Assinar plano
              </Button>
            </CardFooter>
          </Card>
        ))}
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
