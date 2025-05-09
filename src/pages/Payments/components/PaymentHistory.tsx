
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PaymentHistoryItem } from './PaymentHistoryItem';
import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Payment {
  id: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  refunded?: boolean;
}

export const PaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchPayments = async () => {
      setLoading(true);
      
      try {
        // Fetch all payments
        const { data: paymentsData, error } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Fetch refund data to check which payments are refunded
        const { data: refundsData, error: refundsError } = await supabase
          .from('payment_refunds')
          .select('payment_id, status')
          .eq('user_id', user.id);
          
        if (refundsError) throw refundsError;
        
        // Mark payments as refunded if they have a successful refund
        const paymentsWithRefundStatus = paymentsData.map(payment => {
          const hasRefund = refundsData?.some(
            refund => refund.payment_id === payment.id && refund.status === 'succeeded'
          );
          
          return {
            ...payment,
            refunded: hasRefund
          };
        });
        
        setPayments(paymentsWithRefundStatus);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, [user]);
  
  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    if (filter === 'succeeded') return payment.status === 'succeeded' && !payment.refunded;
    if (filter === 'pending') return payment.status === 'pending';
    if (filter === 'refunded') return payment.status === 'refunded' || payment.refunded;
    return true;
  });
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-3 sm:mb-0">
            <CardTitle>Histórico de Pagamentos</CardTitle>
            <CardDescription>Visualize todos os seus pagamentos e reembolsos</CardDescription>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="all" onValueChange={setFilter}>
              <SelectTrigger className="w-[120px] sm:w-[150px]">
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="succeeded">Aprovados</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="refunded">Reembolsados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : filteredPayments.length > 0 ? (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <PaymentHistoryItem
                key={payment.id}
                id={payment.id}
                amount={payment.amount}
                description={payment.description || 'Pagamento'}
                status={payment.status}
                date={payment.created_at}
                refunded={payment.refunded}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum pagamento encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
