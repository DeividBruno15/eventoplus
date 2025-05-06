
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ptBR } from "date-fns/locale";
import { format, differenceInDays, isAfter, isBefore, parseISO } from "date-fns";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, CheckCircle } from "lucide-react";
import { usePayment } from '@/hooks/usePayment';

interface VenueSidebarProps {
  pricePerHour: number;
  selectedDates: Date[];
  createdAt: string;
  venueId?: string;
}

export const VenueSidebar = ({ 
  pricePerHour, 
  selectedDates, 
  createdAt,
  venueId
}: VenueSidebarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isBooking, setIsBooking] = useState(false);
  const { createPayment, isLoading } = usePayment();
  
  // Converter o preço por hora para preço por dia para exibição
  const pricePerDay = pricePerHour * 8;
  
  // Converter as datas selecionadas para objetos Date
  const availableDates = selectedDates || [];
  
  // Verificar se uma data está disponível
  const isDateUnavailable = (date: Date) => {
    return !availableDates.some(availableDate => 
      format(availableDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };
  
  const handleBooking = async () => {
    if (!user) {
      toast.error("Faça login para reservar este espaço");
      navigate("/login", { state: { from: `/venues/${venueId}` } });
      return;
    }
    
    if (!date) {
      toast.error("Por favor, selecione uma data para reserva");
      return;
    }
    
    setIsBooking(true);
    
    try {
      // Converter o preço para centavos para o Stripe
      const amountInCents = Math.round(pricePerDay * 100);
      
      const paymentResult = await createPayment({
        amount: amountInCents,
        eventId: venueId,
        description: `Reserva de espaço para ${format(date, 'dd/MM/yyyy')}`
      });
      
      if (paymentResult.success && paymentResult.clientSecret) {
        // Redirecionar para a página de confirmação de pagamento
        navigate(`/payment-confirmation?session_id=${paymentResult.paymentId}`);
        toast.success("Redirecionando para o pagamento...");
      } else {
        throw new Error(paymentResult.error || "Erro ao processar pagamento");
      }
    } catch (error: any) {
      console.error("Erro ao reservar:", error);
      toast.error(error.message || "Não foi possível processar sua reserva");
    } finally {
      setIsBooking(false);
    }
  };
  
  return (
    <div className="space-y-4 sticky top-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-2xl font-bold">R$ {pricePerDay.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground"> /dia</span>
            </div>
            
            {createdAt && (
              <div className="text-xs text-muted-foreground">
                Anunciado em {format(parseISO(createdAt), 'dd/MM/yyyy')}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-md p-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              disabled={isDateUnavailable}
              className="mx-auto"
            />
            {selectedDates.length > 0 && (
              <p className="text-xs text-center mt-2 text-muted-foreground">
                <CalendarIcon className="h-3 w-3 inline mr-1" />
                {selectedDates.length} dias disponíveis
              </p>
            )}
          </div>
          
          {date && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Data selecionada:</span>
                <span className="font-medium">{format(date, 'dd/MM/yyyy')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Valor da diária:</span>
                <span>R$ {pricePerDay.toFixed(2)}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={handleBooking}
            disabled={!date || isBooking || isLoading}
          >
            {isBooking ? "Processando..." : "Reservar"}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex gap-2 items-center text-sm">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Cancelamento gratuito até 7 dias antes</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
