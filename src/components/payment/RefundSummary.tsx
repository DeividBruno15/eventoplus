
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface RefundSummaryProps {
  refundId: string;
  refundAmount: number; 
  fullRefund: boolean;
  onClose: () => void;
  isLoading: boolean;
}

export const RefundSummary = ({ 
  refundId, 
  refundAmount, 
  fullRefund, 
  onClose,
  isLoading 
}: RefundSummaryProps) => {
  if (isLoading) {
    return (
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-center">Processando Reembolso</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-center text-muted-foreground">
            Seu reembolso está sendo processado. Isso pode levar alguns instantes...
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-slate-200">
      <CardHeader className="bg-green-50 border-b border-green-100">
        <div className="flex items-center justify-center mb-2">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <CardTitle className="text-center text-green-800">Reembolso Solicitado</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        <p className="text-center">
          Seu pedido de reembolso foi iniciado e está sendo processado.
        </p>
        
        <div className="border rounded-md p-4 bg-slate-50">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Protocolo:</span>
              <span className="text-sm font-mono">{refundId.slice(0, 8)}...</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Valor do reembolso:</span>
              <span className="text-sm font-medium">{formatCurrency(refundAmount / 100)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Tipo:</span>
              <span className="text-sm">{fullRefund ? 'Reembolso total' : 'Reembolso parcial'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-start bg-amber-50 border border-amber-100 rounded-md p-3">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            O processamento do reembolso pode levar até 7 dias úteis para aparecer em sua conta,
            dependendo do seu banco ou operadora do cartão.
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" onClick={onClose}>Fechar</Button>
      </CardFooter>
    </Card>
  );
};
