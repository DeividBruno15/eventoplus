
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from '@/hooks/useSubscription';
import { PaymentHistory } from './components/PaymentHistory';
import { PaymentPlans } from '@/components/payment/PaymentPlans';

const Payments = () => {
  const { toast } = useToast();
  const { subscription, refetch } = useSubscription();
  const [activeTab, setActiveTab] = useState("plans");

  const handleSuccess = () => {
    toast({
      title: "Plano alterado com sucesso!",
      description: "Seu plano foi atualizado conforme solicitado.",
    });
    refetch();
  };

  return (
    <div className="container py-8 animate-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Assinatura</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie seu plano e visualize seu histórico de pagamentos
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        <TabsContent value="plans" className="space-y-4">
          <PaymentPlans 
            onSuccess={handleSuccess}
            currentSubscription={subscription} 
          />
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;
