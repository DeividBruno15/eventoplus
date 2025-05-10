
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { Plan } from "@/pages/Plans/types";

interface PaymentMethodSelectorProps {
  selectedPlan: Plan | null;
  onBack: () => void;
  onStripeCheckout: (planId: string) => Promise<void>;
  onPixCheckout?: (planId: string) => Promise<void>;
  isProcessing: boolean;
}

export const PaymentMethodSelector = ({
  selectedPlan,
  onBack,
  onStripeCheckout,
  onPixCheckout,
  isProcessing
}: PaymentMethodSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'pix' | null>(null);
  const { toast } = useToast();

  const handleContinue = async () => {
    if (!selectedPlan) {
      toast({
        title: "Erro",
        description: "Selecione um plano para continuar.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedMethod) {
      toast({
        title: "Erro",
        description: "Selecione um método de pagamento para continuar.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (selectedMethod === 'stripe') {
        await onStripeCheckout(selectedPlan.id);
      } else if (selectedMethod === 'pix' && onPixCheckout) {
        await onPixCheckout(selectedPlan.id);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar seu pagamento. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Escolha o método de pagamento</h2>
        <Button variant="outline" onClick={onBack}>Voltar para planos</Button>
      </div>
      
      {selectedPlan && (
        <Card className="bg-muted/50 mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Plano selecionado</CardTitle>
            <CardDescription>Detalhes do plano que você selecionou</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">{selectedPlan.name}</h3>
                <p className="text-muted-foreground">{selectedPlan.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">
                  {selectedPlan.price === 0 ? 'Grátis' : `R$ ${(selectedPlan.price / 100).toFixed(2)}`}
                </p>
                {selectedPlan.price > 0 && <p className="text-xs text-muted-foreground">/mês</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer border-2 transition-all ${selectedMethod === 'stripe' ? 'border-primary' : 'border-border hover:border-primary/50'}`}
          onClick={() => setSelectedMethod('stripe')}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Cartão de crédito
            </CardTitle>
            <CardDescription>Pagamento seguro via Stripe</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Processamento seguro e rápido com Stripe. Aceita todos os principais cartões de crédito.
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer border-2 transition-all ${selectedMethod === 'pix' ? 'border-primary' : 'border-border hover:border-primary/50'}`}
          onClick={() => setSelectedMethod('pix')}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="mr-2 h-5 w-5" />
              PIX
            </CardTitle>
            <CardDescription>Pagamento instantâneo via Abacate Pay</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Realize pagamentos instantâneos usando o sistema PIX integrado com Abacate Pay.
            </p>
          </CardContent>
          {/* Add future Abacate Pay integration here */}
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button 
          disabled={!selectedMethod || isProcessing} 
          className="w-full md:w-auto" 
          onClick={handleContinue}
        >
          {isProcessing ? "Processando..." : "Continuar com o pagamento"}
        </Button>
      </div>
    </div>
  );
};
