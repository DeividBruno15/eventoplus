
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { PaymentHistory } from '@/components/payment/PaymentHistory';
import { PaymentPlans } from '@/components/payment/PaymentPlans';
import { useSearchParams } from 'react-router-dom';
import { usePayment } from '@/hooks/usePayment';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

const PaymentsPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('plans');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const { user } = useAuth();
  const { subscription } = useSubscription();

  useEffect(() => {
    // Verificar parâmetros da URL para resultado de pagamento
    const status = searchParams.get('status');
    
    if (status === 'success') {
      setPaymentSuccess(true);
      setRefreshHistory(prev => !prev);
      setActiveTab('history');
    } else if (status === 'error') {
      setPaymentError('Ocorreu um erro durante o processamento do pagamento.');
    }
  }, [searchParams]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setActiveTab('history');
    setRefreshHistory(prev => !prev);
  };

  const handleSelectPlan = (plan: {id: string, name: string, price: number}) => {
    // Iniciar processo de assinatura diretamente sem ir para outra aba
    // A lógica de assinatura será gerenciada pelo componente PaymentPlans
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
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="space-y-4">
          <PaymentPlans 
            onSelectPlan={handleSelectPlan} 
            currentSubscription={subscription}
          />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <PaymentHistory key={refreshHistory ? 'refresh' : 'normal'} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentsPage;
