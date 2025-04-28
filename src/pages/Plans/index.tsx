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

const Plans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [userRole, setUserRole] = useState<'provider' | 'contractor' | null>(null);

  useEffect(() => {
    if (user) {
      const role = user.user_metadata?.role as 'provider' | 'contractor' || null;
      setUserRole(role);
      
      if (role) {
        const defaultTab = role === 'provider' ? 'providers' : 'contractors';
        const tabsElement = document.querySelector('[role="tablist"]') as HTMLElement;
        if (tabsElement) {
          const tabButton = tabsElement.querySelector(`[data-value="${defaultTab}"]`) as HTMLElement;
          if (tabButton) {
            tabButton.click();
          }
        }
      }
    }
  }, [user]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleCheckout = async () => {
    if (!selectedPlan) {
      toast({
        title: "Selecione um plano",
        description: "Por favor, selecione um plano para continuar.",
        variant: "destructive"
      });
      return;
    }

    const plan = userRole === 'provider' 
      ? providerPlans.find(p => p.id === selectedPlan)
      : contractorPlans.find(p => p.id === selectedPlan);

    if (!plan) return;

    setProcessingPayment(true);
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
        </div>

        {!selectedPlan ? (
          <Tabs 
            defaultValue={userRole === 'provider' ? 'providers' : 'contractors'} 
            className="space-y-8"
          >
            {userRole === 'provider' ? (
              <>
                <TabsList className="grid w-full grid-cols-1 max-w-[400px] mx-auto">
                  <TabsTrigger value="providers">Para Prestadores</TabsTrigger>
                </TabsList>
                
                <TabsContent value="providers" className="space-y-4">
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
                            onClick={() => handleSelectPlan(plan.id)}
                          >
                            Selecionar Plano
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </>
            ) : userRole === 'contractor' ? (
              <>
                <TabsList className="grid w-full grid-cols-1 max-w-[400px] mx-auto">
                  <TabsTrigger value="contractors">Para Contratantes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="contractors" className="space-y-4">
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
                            onClick={() => handleSelectPlan(plan.id)}
                          >
                            Selecionar Plano
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </>
            ) : (
              <>
                <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto">
                  <TabsTrigger value="providers">Para Prestadores</TabsTrigger>
                  <TabsTrigger value="contractors">Para Contratantes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="providers" className="space-y-4">
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
                            onClick={() => handleSelectPlan(plan.id)}
                          >
                            Selecionar Plano
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="contractors" className="space-y-4">
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
                            onClick={() => handleSelectPlan(plan.id)}
                          >
                            Selecionar Plano
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
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
