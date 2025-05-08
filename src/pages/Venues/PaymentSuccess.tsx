
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { paymentsService } from "@/services/payments";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const venueId = searchParams.get('venue_id');
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setIsVerifying(false);
        return;
      }
      
      try {
        const result = await paymentsService.verifyPayment(sessionId);
        
        if (result.success) {
          setIsVerified(true);
          toast.success('Pagamento confirmado com sucesso!');
        } else {
          toast.error('Não foi possível confirmar seu pagamento');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast.error('Ocorreu um erro ao verificar seu pagamento');
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyPayment();
  }, [sessionId]);
  
  // Redirect if no session ID
  useEffect(() => {
    if (!sessionId && !isVerifying) {
      toast.error('Informações de pagamento inválidas');
      navigate('/venues');
    }
  }, [sessionId, isVerifying, navigate]);
  
  return (
    <div className="container max-w-3xl mx-auto py-12">
      <Card className="p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold">Pagamento {isVerified ? 'Confirmado' : 'Recebido'}!</h1>
          
          <div className="max-w-md mx-auto">
            <p className="text-lg text-muted-foreground">
              {isVerifying ? (
                'Estamos verificando seu pagamento...'
              ) : isVerified ? (
                'Sua reserva foi confirmada com sucesso. O proprietário do local foi notificado sobre sua reserva.'
              ) : (
                'Seu pagamento foi recebido e está sendo processado. Em breve você receberá uma confirmação.'
              )}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {venueId && (
              <Button 
                variant="outline"
                onClick={() => navigate(`/venues/${venueId}`)}
                className="gap-2"
              >
                Voltar ao anúncio
              </Button>
            )}
            
            <Button onClick={() => navigate('/venues')} className="gap-2">
              Explorar mais locais
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
