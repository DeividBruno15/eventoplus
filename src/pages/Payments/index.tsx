
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentForm } from '@/components/payment/PaymentForm';
import { PaymentHistory } from '@/components/payment/PaymentHistory';

const PaymentsPage = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setActiveTab('history');
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Pagamentos</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="new">Novo Pagamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="space-y-4">
          <PaymentHistory />
        </TabsContent>
        
        <TabsContent value="new" className="space-y-4">
          <div className="max-w-md mx-auto">
            <PaymentForm 
              amount={5000} // R$ 50,00
              onSuccess={handlePaymentSuccess} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Export the PaymentsPage as default
export default PaymentsPage;
