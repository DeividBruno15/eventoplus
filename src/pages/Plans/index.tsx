
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/contexts/SessionContext';
import { useSubscription } from '@/hooks/useSubscription';
import { providerPlans, contractorPlans, advertiserPlans } from "./data/plans";
import { Badge } from '@/components/ui/badge';

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Planos e Benefícios
          </h1>
          <p className="text-lg text-muted-foreground">
            Escolha o plano ideal para suas necessidades e comece a crescer conosco
          </p>
          {subscription && (
            <div className="mt-4">
              <Badge variant="subscription" className="px-3 py-1 text-base">
                Você possui o plano <strong>{subscription.plan_name}</strong> ativo até {new Date(subscription.expires_at).toLocaleDateString('pt-BR')}
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {userRole === 'provider' ? (
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
          ) : userRole === 'contractor' ? (
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
          ) : userRole === 'advertiser' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {advertiserPlans.map((plan) => (
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
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground mb-4">
                Você precisa estar logado e ter um tipo de conta definido para ver os planos disponíveis.
              </p>
              <Button onClick={() => navigate('/login')}>Fazer Login</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Plans;
