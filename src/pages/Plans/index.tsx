
import { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PricingTable } from "./components/PricingTable";
import { providerPlans, contractorPlans } from "./data/plans";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/contexts/SessionContext';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { useSubscription } from '@/hooks/useSubscription';

const Plans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { session } = useSession();
  const { subscription, subscribeToPlan, isSubscribing } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [userRole, setUserRole] = useState<'provider' | 'contractor' | null>(null);

  useEffect(() => {
    if (user) {
      const role = user.user_metadata?.role as 'provider' | 'contractor' || null;
      setUserRole(role);
    }
  }, [user]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async (planId: string) => {
    if (!userRole) {
      toast({
        title: "Erro",
        description: "Seu tipo de conta não está definido. Por favor, atualize seu perfil.",
        variant: "destructive"
      });
      return;
    }

    // Find plan details
    const plans = userRole === 'provider' ? providerPlans : contractorPlans;
    const plan = plans.find(p => p.id === planId);
    
    if (!plan) {
      toast({
        title: "Erro",
        description: "Plano não encontrado",
        variant: "destructive"
      });
      return;
    }

    // Process subscription
    const result = await subscribeToPlan(planId, plan.name, userRole);
    
    if (result) {
      toast({
        title: "Assinatura realizada",
        description: `Você assinou o plano ${plan.name} com sucesso!`
      });
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-page">
      <main className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Planos e Benefícios
          </h1>
          <p className="text-lg text-muted-foreground">
            Escolha o plano ideal para suas necessidades e comece a crescer conosco
          </p>
          {subscription && (
            <div className="mt-4">
              <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-md">
                Você já possui o plano <strong>{subscription.plan_name}</strong> ativo até {new Date(subscription.expires_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          )}
        </div>

        {!selectedPlan ? (
          <div className="space-y-8">
            {userRole === 'provider' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {providerPlans.map((plan) => (
                    <Card key={plan.id} className={`${plan.featured ? 'border-primary shadow-lg' : ''} flex flex-col`}>
                      <CardHeader>
                        <CardTitle>
                          {plan.name}
                          {plan.featured && <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded">RECOMENDADO</span>}
                        </CardTitle>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">R$ {plan.price}</span>
                          <span className="text-muted-foreground">/mês</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <ul className="space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          variant={plan.featured ? "default" : "outline"}
                          onClick={() => handleSubscribe(plan.id)}
                          disabled={isSubscribing}
                        >
                          {isSubscribing ? "Processando..." : "Assinar Plano"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            ) : userRole === 'contractor' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {contractorPlans.map((plan) => (
                    <Card key={plan.id} className={`${plan.featured ? 'border-primary shadow-lg' : ''} flex flex-col`}>
                      <CardHeader>
                        <CardTitle>
                          {plan.name}
                          {plan.featured && <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded">RECOMENDADO</span>}
                        </CardTitle>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">R$ {plan.price}</span>
                          <span className="text-muted-foreground">/mês</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <ul className="space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          variant={plan.featured ? "default" : "outline"}
                          onClick={() => handleSubscribe(plan.id)}
                          disabled={isSubscribing}
                        >
                          {isSubscribing ? "Processando..." : "Assinar Plano"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-lg text-muted-foreground mb-4">
                  Você precisa estar logado e ter um tipo de conta definido para ver os planos disponíveis.
                </p>
                <Button onClick={() => navigate('/login')}>Fazer Login</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <PaymentForm 
              amount={selectedPlan.includes('provider')
                ? providerPlans.find(p => p.id === selectedPlan)?.price || 0
                : contractorPlans.find(p => p.id === selectedPlan)?.price || 0}
              planId={selectedPlan}
              onSuccess={() => navigate('/dashboard')}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Plans;
