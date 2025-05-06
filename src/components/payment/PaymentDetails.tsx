
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePayment } from '@/hooks/usePayment';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Payment {
  id: string;
  stripe_payment_id: string;
  amount: number;
  status: string;
  created_at: string;
  description: string;
}

interface PaymentDetailsProps {
  payment: Payment;
  onClose: () => void;
  onRefund: () => void;
}

export const PaymentDetails = ({ payment, onClose, onRefund }: PaymentDetailsProps) => {
  const { toast } = useToast();
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const { requestRefund, isRefunding } = usePayment();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge variant="default" className="bg-green-500">Confirmado</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pendente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Reembolsado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleRefundRequest = async () => {
    if (!payment.stripe_payment_id) {
      toast({
        title: "Erro",
        description: "ID do pagamento não encontrado.",
        variant: "destructive"
      });
      return;
    }

    const success = await requestRefund({
      paymentId: payment.stripe_payment_id,
      reason: refundReason || 'requested_by_customer'
    });

    if (success) {
      setIsRefundDialogOpen(false);
      toast({
        title: "Reembolso solicitado",
        description: "Seu pedido de reembolso foi processado com sucesso.",
      });
      onRefund();
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { 
        addSuffix: true,
        locale: ptBR
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <Button 
          variant="ghost" 
          className="p-0 h-auto mb-4" 
          onClick={onClose}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <CardTitle>Detalhes do Pagamento</CardTitle>
        <CardDescription>
          {formatDate(payment.created_at)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status:</span>
            {getStatusBadge(payment.status)}
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-muted-foreground">Valor:</span>
            <span className="font-medium">R$ {(payment.amount / 100).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-muted-foreground">Descrição:</span>
            <span>{payment.description || 'Pagamento'}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-muted-foreground">ID do pagamento:</span>
            <span className="text-xs text-muted-foreground">{payment.stripe_payment_id}</span>
          </div>
        </div>
        
        {payment.status === 'succeeded' && (
          <div className="rounded-lg bg-green-50 p-3 flex items-center">
            <CheckCircle2 className="text-green-500 h-5 w-5 mr-2" />
            <p className="text-green-700 text-sm">
              Este pagamento foi confirmado e processado com sucesso.
            </p>
          </div>
        )}
        
        {payment.status === 'pending' && (
          <div className="rounded-lg bg-yellow-50 p-3 flex items-center">
            <RefreshCcw className="text-yellow-500 h-5 w-5 mr-2" />
            <p className="text-yellow-700 text-sm">
              Este pagamento está sendo processado. Aguarde a confirmação.
            </p>
          </div>
        )}
        
        {payment.status === 'failed' && (
          <div className="rounded-lg bg-red-50 p-3 flex items-center">
            <XCircle className="text-red-500 h-5 w-5 mr-2" />
            <p className="text-red-700 text-sm">
              Este pagamento falhou. Por favor, tente novamente ou entre em contato com o suporte.
            </p>
          </div>
        )}
        
        {payment.status === 'refunded' && (
          <div className="rounded-lg bg-gray-100 p-3 flex items-center">
            <RefreshCcw className="text-gray-500 h-5 w-5 mr-2" />
            <p className="text-gray-700 text-sm">
              Este pagamento foi reembolsado.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onClose}>
          Fechar
        </Button>
        
        {payment.status === 'succeeded' && (
          <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Solicitar Reembolso</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Solicitar Reembolso</DialogTitle>
                <DialogDescription>
                  Por favor, informe o motivo do reembolso. Isso nos ajuda a melhorar nossos serviços.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <p className="text-sm text-amber-600">
                    O reembolso pode levar até 7 dias para ser processado pelo seu banco.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="refund-reason">Motivo do reembolso</Label>
                  <Textarea
                    id="refund-reason"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Por favor, informe o motivo do reembolso..."
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsRefundDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleRefundRequest}
                  disabled={isRefunding}
                >
                  {isRefunding ? "Processando..." : "Confirmar Reembolso"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
};
