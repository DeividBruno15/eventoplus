
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { PaymentHistory } from '@/components/payment/PaymentHistory';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tab, Tabs, TabList, TabPanel } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Payments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('history');
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Este efeito simula a busca de dados de assinatura do usuário
  // Em uma implementação real, você buscaria isso do Supabase
  useEffect(() => {
    // Simulação de busca de dados de assinatura
    setTimeout(() => {
      setSubscription({
        active: true,
        plan: 'Premium',
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleUpgrade = () => {
    navigate('/plans');
  };

  if (!user) return null;

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Pagamentos e Assinaturas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Status da Assinatura</CardTitle>
            <CardDescription>
              {loading ? 'Verificando assinatura...' : 'Status atual do seu plano'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Plano:</span>
                  <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">{subscription?.plan}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Próxima cobrança:</span>
                  <span>{subscription?.nextBilling?.toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpgrade} className="w-full">
              {subscription?.active ? 'Gerenciar Assinatura' : 'Assinar Plano'}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="col-span-2">
          <Tabs defaultValue="history">
            <TabList>
              <Tab value="history">Histórico</Tab>
              <Tab value="methods">Métodos de Pagamento</Tab>
            </TabList>
            <TabPanel value="history">
              <PaymentHistory />
            </TabPanel>
            <TabPanel value="methods">
              <Card>
                <CardHeader>
                  <CardTitle>Métodos de Pagamento</CardTitle>
                  <CardDescription>Gerencie seus cartões e contas</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    Você não possui métodos de pagamento salvos.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Adicionar Método de Pagamento</Button>
                </CardFooter>
              </Card>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Payments;
