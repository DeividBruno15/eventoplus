
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatCurrency } from '@/lib/utils';
import { useRefundRequest } from '@/hooks/useRefundRequest';
import { RefundSummary } from './RefundSummary';

interface RefundRequestModalProps {
  open: boolean;
  onClose: () => void;
  paymentId: string;
  paymentAmount: number;
  paymentDescription?: string;
}

export const RefundRequestModal = ({
  open,
  onClose,
  paymentId,
  paymentAmount,
  paymentDescription
}: RefundRequestModalProps) => {
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const [step, setStep] = useState<'form' | 'summary'>('form');
  const [refundId, setRefundId] = useState<string>('');
  
  const { initiateRefund, isLoading, isSuccess } = useRefundRequest();
  
  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setRefundType('full');
      setAmount(0);
      setReason('');
      setStep('form');
      setRefundId('');
    }
  }, [open]);
  
  // Set full refund amount initially
  useEffect(() => {
    if (paymentAmount) {
      setAmount(paymentAmount);
    }
  }, [paymentAmount]);
  
  // Update amount when refund type changes
  useEffect(() => {
    if (refundType === 'full') {
      setAmount(paymentAmount);
    } else {
      setAmount(0);
    }
  }, [refundType, paymentAmount]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numericValue = parseInt(value);
    setAmount(isNaN(numericValue) ? 0 : numericValue);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentId || amount <= 0 || !reason.trim()) {
      return;
    }
    
    const result = await initiateRefund({
      paymentId,
      amount: refundType === 'full' ? undefined : amount,
      reason: reason.trim()
    });
    
    if (result) {
      setRefundId(paymentId);
      setStep('summary');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle>Solicitar Reembolso</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              {paymentDescription && (
                <div className="p-3 bg-slate-50 rounded-md text-sm">
                  <p className="font-medium">Pagamento:</p>
                  <p>{paymentDescription}</p>
                  <p className="font-medium mt-1">Valor: {formatCurrency(paymentAmount / 100)}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Tipo de reembolso</Label>
                <RadioGroup value={refundType} onValueChange={(value) => setRefundType(value as 'full' | 'partial')} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-3 rounded-md border p-3">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="flex-1 cursor-pointer">Reembolso total</Label>
                    <span className="text-sm font-medium">{formatCurrency(paymentAmount / 100)}</span>
                  </div>
                  <div className="flex items-center space-x-3 rounded-md border p-3">
                    <RadioGroupItem value="partial" id="partial" />
                    <Label htmlFor="partial" className="flex-1 cursor-pointer">Reembolso parcial</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {refundType === 'partial' && (
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor do reembolso (em centavos)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min={1}
                    max={paymentAmount}
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0"
                    className="text-right"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Valor máximo: {formatCurrency(paymentAmount / 100)}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo do reembolso</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explique o motivo do seu pedido de reembolso"
                  className="min-h-[100px]"
                  required
                />
              </div>
              
              <Separator />
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={
                    isLoading || 
                    !reason.trim() || 
                    (refundType === 'partial' && (amount <= 0 || amount > paymentAmount))
                  }
                >
                  {isLoading ? 'Processando...' : 'Solicitar Reembolso'}
                </Button>
              </div>
            </form>
          </>
        )}
        
        {step === 'summary' && (
          <RefundSummary
            refundId={refundId}
            refundAmount={amount}
            fullRefund={refundType === 'full'}
            onClose={onClose}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
