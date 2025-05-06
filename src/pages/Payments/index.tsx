
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { PaymentHistory } from '@/components/payment/PaymentHistory';
import { PaymentPlans } from '@/components/payment/PaymentPlans';
import { useSearchParams } from 'react-router-dom';
import { usePayment } from '@/hooks/usePayment';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';

const PaymentsPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('history');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<{id: string, name: string, price: number} | null>(null);
  const { fetchPaymentHistory } = usePayment();
  const [refreshHistory, setRefreshHistory] = useState(false);
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'contractor';

  useEffect(() => {
    // Verificar parâmetros da URL para ação de pagamento ou resultado
    const status = searchParams.get('status');
    const plan = searchParams.get('plan');
    
    if (status === 'success') {
      setPaymentSuccess(true);
      setRefreshHistory(prev => !prev);
    } else if (status === 'error') {
      setPaymentError('Ocorreu um erro durante o processamento do pagamento.');
    }
    
    if (plan) {
      setActiveTab('new');
      // Aqui você pode buscar informações do plano com base no ID
    }
  }, [searchParams]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setActiveTab('history');
    setRefreshHistory(prev => !prev);
  };

  const handleSelectPlan = (plan: {id: string, name: string, price: number}) => {
    setSelectedPlan(plan);
    setActiveTab('new');
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Minha Assinatura</h1>
      
      {paymentSuccess && (
        <Alert className="mb-4 bg-green-50 border-green-500">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            Pagamento realizado com sucesso! Seu plano foi atualizado.
          </AlertDescription>
        </Alert>
      )}
      
      {paymentError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {paymentError}
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="new">Novo Pagamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="space-y-4">
          <PaymentHistory key={refreshHistory ? 'refresh' : 'normal'} />
        </TabsContent>
        
        <TabsContent value="plans" className="space-y-4">
          <PaymentPlans onSelectPlan={handleSelectPlan} />
        </TabsContent>
        
        <TabsContent value="new" className="space-y-4">
          <div className="max-w-md mx-auto">
            {selectedPlan ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Plano: {selectedPlan.name}</h2>
                <PaymentForm 
                  amount={selectedPlan.price}
                  planId={selectedPlan.id}
                  onSuccess={handlePaymentSuccess} 
                />
                <Button 
                  variant="ghost" 
                  className="mt-4"
                  onClick={() => setSelectedPlan(null)}
                >
                  Escolher outro plano
                </Button>
              </>
            ) : (
              <PaymentForm 
                amount={5000} // R$ 50,00 por padrão
                onSuccess={handlePaymentSuccess} 
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentsPage;
