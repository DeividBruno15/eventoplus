
import { useEffect, useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const stripePromise = loadStripe('pk_test_51RIrXYKX6FbUQvI6kGNBD9xg8LZ0ESHXdiLYhQMaFXAFeCXOx5vGvsS9dZEvKD6XMKeuH2KqG3iQImvVciizh3Ey00eeZ6U3vC');

const CheckoutForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast({
          title: "Erro no pagamento",
          description: error.message,
          variant: "destructive"
        });
      } else {
        onSuccess();
      }
    } catch (error: any) {
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
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button 
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full mt-4"
      >
        {isLoading ? "Processando..." : "Finalizar pagamento"}
      </Button>
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
  const { toast } = useToast();

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { amount, planId }
        });

        if (error) throw error;
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive"
        });
      }
    };

    createPaymentIntent();
  }, [amount, planId]);

  if (!clientSecret) {
    return <div>Carregando...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <Card>
        <CardHeader>
          <CardTitle>Informações de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <CheckoutForm onSuccess={onSuccess} />
        </CardContent>
      </Card>
    </Elements>
  );
};
