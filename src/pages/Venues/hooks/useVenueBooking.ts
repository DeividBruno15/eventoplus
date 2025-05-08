
import { useState } from "react";
import { paymentsService } from "@/services/payments";
import { toast } from "sonner";

export const useVenueBooking = (
  venueId: string,
  venueName: string,
  pricePerDay: number,
  selectedDates: Date[]
) => {
  const [isBooking, setIsBooking] = useState(false);

  const handleBooking = async () => {
    if (selectedDates.length === 0) {
      toast.error("Selecione pelo menos um dia para reservar");
      return;
    }

    try {
      setIsBooking(true);
      
      // Calculate total amount in cents
      const totalAmount = Math.round(pricePerDay * 100) * selectedDates.length;
      
      // Create payment session
      const checkoutUrl = await paymentsService.createPaymentSession({
        venueId,
        venueName,
        amount: totalAmount,
        selectedDates
      });
      
      if (checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Falha ao criar sessão de pagamento");
      }
    } catch (error) {
      console.error("Error booking venue:", error);
      toast.error("Ocorreu um erro ao processar sua reserva");
    } finally {
      setIsBooking(false);
    }
  };

  return {
    handleBooking,
    isBooking
  };
};
