
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRefundRequest } from '@/hooks/useRefundRequest';
import { formatCurrency } from '@/lib/utils';

const formSchema = z.object({
  fullRefund: z.boolean().default(true),
  partialAmount: z.number().min(1).optional(),
  reason: z.string()
    .min(10, { message: "Por favor forneça um motivo com pelo menos 10 caracteres" })
    .max(500, { message: "O motivo não deve exceder 500 caracteres" }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "Você deve concordar com os termos de reembolso"
  })
});

type FormValues = z.infer<typeof formSchema>;

interface RefundRequestFormProps {
  paymentId: string;
  paymentAmount: number; // em centavos
  onSuccess?: () => void;
}

export const RefundRequestForm = ({ paymentId, paymentAmount, onSuccess }: RefundRequestFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const { initiateRefund, isLoading, isSuccess } = useRefundRequest();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullRefund: true,
      reason: '',
      agreeToTerms: false
    }
  });
  
  const watchFullRefund = form.watch("fullRefund");

  const onSubmit = async (data: FormValues) => {
    try {
      setError(null);
      
      const refundAmount = data.fullRefund 
        ? undefined // undefined means full refund
        : data.partialAmount ? Math.round(data.partialAmount * 100) : undefined;
      
      // Validate partial refund amount if applicable
      if (!data.fullRefund && (!refundAmount || refundAmount <= 0 || refundAmount > paymentAmount)) {
        setError("O valor do reembolso parcial deve ser maior que zero e não pode exceder o valor do pagamento original");
        return;
      }
      
      const result = await initiateRefund({
        paymentId,
        amount: refundAmount,
        reason: data.reason
      });
      
      if (result && onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setError(error.message || "Ocorreu um erro ao processar seu pedido de reembolso");
    }
  };

  if (isSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-700">
          Seu pedido de reembolso foi recebido com sucesso! Entraremos em contato em breve com atualizações sobre o status.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div>
          <h2 className="text-lg font-medium mb-2">Informações do Pagamento</h2>
          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">ID do Pagamento:</span>
              <span className="font-mono text-sm">{paymentId.substring(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor Pago:</span>
              <span className="font-medium">{formatCurrency(paymentAmount / 100)}</span>
            </div>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="fullRefund"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Solicitar reembolso total
                </FormLabel>
                <FormDescription>
                  O valor total de {formatCurrency(paymentAmount / 100)} será reembolsado
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        {!watchFullRefund && (
          <FormField
            control={form.control}
            name="partialAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do reembolso parcial (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={paymentAmount / 100}
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value || "0");
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Insira um valor entre R$ 0,01 e {formatCurrency(paymentAmount / 100)}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo do reembolso</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explique por que você está solicitando este reembolso..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Forneça detalhes sobre o motivo do seu pedido de reembolso
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700">
            Pedidos de reembolso são avaliados de acordo com nossa política. Reembolsos parciais podem levar mais tempo para serem processados.
          </AlertDescription>
        </Alert>
        
        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Concordo com os termos de reembolso
                </FormLabel>
                <FormDescription>
                  Entendo que o processo de reembolso pode levar até 7 dias úteis para ser concluído.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? "Processando..." : "Solicitar Reembolso"}
        </Button>
      </form>
    </Form>
  );
};
