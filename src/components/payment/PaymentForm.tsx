
import { useEffect, useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const stripePromise = loadStripe('pk_test_51RIrXYKX6FbUQvI6kGNBD9xg8LZ0ESHXdiLYhQMaFXAFeCXOx5vGvsS9dZEvKD6XMKeuH2KqG3iQImvVciizh3Ey00eeZ6U3vC');

interface CheckoutFormProps {
  onSuccess: () => void;
  amount: number;
}

const CheckoutForm = ({ onSuccess, amount }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setErrorMessage(error.message || "Ocorreu um erro ao processar o pagamento");
        toast({
          title: "Erro no pagamento",
          description: error.message,
          variant: "destructive"
        });
      } else {
        onSuccess();
        toast({
          title: "Pagamento bem-sucedido",
          description: "Seu pagamento foi processado com sucesso!",
          variant: "default"
        });
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Ocorreu um erro inesperado");
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="font-medium text-sm text-muted-foreground">Valor a pagar</div>
        <div className="text-2xl font-bold">R$ {(amount / 100).toFixed(2)}</div>
      </div>
      
      <PaymentElement />
      
      <Button 
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full"
      >
        {isLoading ? "Processando..." : "Finalizar pagamento"}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        Pagamentos processados com segurança via Stripe
      </p>
    </form>
  );
};

interface PaymentFormProps {
  amount: number;
  planId: string;
  onSuccess: () => void;
}

export const PaymentForm = ({ amount, planId, onSuccess }: PaymentFormProps) => {
  const [clientSecret, setClientSecret] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  useEffect(() => {
    const createPaymentIntent = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { amount, planId }
        });

        if (error) throw error;
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.message || "Não foi possível iniciar o pagamento",
          variant: "destructive"
        });
        setPaymentStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, planId, toast]);

  const handleSuccess = () => {
    setPaymentStatus('success');
    onSuccess();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preparando pagamento</CardTitle>
          <CardDescription>Aguarde enquanto conectamos ao serviço de pagamento...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro no pagamento</CardTitle>
          <CardDescription>Não foi possível iniciar a sessão de pagamento</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Houve um erro ao conectar com o serviço de pagamento. Por favor, tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()} className="w-full">
            Tentar novamente
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pagamento concluído!</CardTitle>
          <CardDescription>Seu pagamento foi processado com sucesso</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <p className="text-center text-muted-foreground">
            Obrigado pela sua compra. Seu plano foi atualizado com sucesso.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.href = '/dashboard'} className="w-full">
            Ir para o Dashboard
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!clientSecret) {
    return <div>Carregando...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <Card>
        <CardHeader>
          <CardTitle>Informações de Pagamento</CardTitle>
          <CardDescription>Preencha os dados do cartão para concluir sua compra</CardDescription>
        </CardHeader>
        <CardContent>
          <CheckoutForm onSuccess={handleSuccess} amount={amount} />
        </CardContent>
      </Card>
    </Elements>
  );
};
