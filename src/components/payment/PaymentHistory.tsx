
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type Payment = {
  id: string;
  created_at: string;
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'succeeded' | 'failed';
};

const PaymentStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'succeeded':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Confirmado</Badge>;
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
    case 'failed':
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Falhou</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const PaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setPayments(data || []);
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Erro ao carregar pagamentos",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [toast]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>Carregando seu histórico de pagamentos...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>Ocorreu um erro ao carregar seus pagamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pagamentos</CardTitle>
        <CardDescription>Visualize todos os seus pagamentos</CardDescription>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum pagamento encontrado
          </p>
        ) : (
          <div className="space-y-4 divide-y">
            {payments.map((payment) => (
              <div key={payment.id} className="pt-4 first:pt-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{payment.description || 'Pagamento'}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(payment.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {payment.currency === 'brl' ? 'R$' : '$'} {(payment.amount / 100).toFixed(2)}
                    </p>
                    <div className="mt-1">
                      <PaymentStatusBadge status={payment.status} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
