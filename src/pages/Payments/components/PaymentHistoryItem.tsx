
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ArrowDownCircle, Copy, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { RefundRequestModal } from '@/components/payment/RefundRequestModal';
import { useToast } from '@/hooks/use-toast';

interface PaymentHistoryItemProps {
  id: string;
  amount: number;
  description: string;
  status: string;
  date: string;
  refunded?: boolean;
}

export const PaymentHistoryItem = ({
  id,
  amount,
  description,
  status,
  date,
  refunded
}: PaymentHistoryItemProps) => {
  const [showRefundModal, setShowRefundModal] = useState(false);
  const { toast } = useToast();
  
  const formattedDate = format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: pt });
  
  const handleCopyId = () => {
    navigator.clipboard.writeText(id);
    toast({
      title: "ID copiado",
      description: "O ID do pagamento foi copiado para a área de transferência."
    });
  };
  
  const getStatusBadge = () => {
    switch (status) {
      case 'succeeded':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Aprovado</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pendente</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Falhou</span>;
      case 'refunded':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Reembolsado</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  return (
    <>
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 rounded-full p-2">
              <ArrowDownCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{description}</h3>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-medium">{formatCurrency(amount / 100)}</div>
              <div className="mt-1">{getStatusBadge()}</div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyId}
                title="Copiar ID"
              >
                <Copy className="h-4 w-4" />
              </Button>
              
              {status === 'succeeded' && !refunded && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRefundModal(true)}
                  title="Solicitar reembolso"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      <RefundRequestModal
        open={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        paymentId={id}
        paymentAmount={amount}
        paymentDescription={description}
      />
    </>
  );
};
