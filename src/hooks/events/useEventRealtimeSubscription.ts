
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import { transformEventData } from "@/utils/events/eventTransformers";
import { toast } from "sonner";

interface UseEventRealtimeSubscriptionProps {
  userId: string | undefined;
  onEventAdded: (event: Event) => void;
  onEventUpdated: (event: Event) => void;
  onEventDeleted: (eventId: string) => void;
}

/**
 * Hook to handle real-time subscriptions for events
 */
export const useEventRealtimeSubscription = ({
  userId,
  onEventAdded,
  onEventUpdated,
  onEventDeleted
}: UseEventRealtimeSubscriptionProps) => {
  useEffect(() => {
    if (!userId) return;
    
    console.log("Setting up realtime subscription for events");
    
    try {
      // Configurando o canal para receber atualizações em tempo real
      const channel = supabase
        .channel('events-realtime-channel')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'events',
            filter: `contractor_id=eq.${userId}` 
          }, 
          payload => {
            console.log('Event insert received:', payload);
            if (payload.new) {
              try {
                const processedEvent = transformEventData(payload.new);
                onEventAdded(processedEvent);
              } catch (err) {
                console.error('Erro ao processar novo evento:', err);
              }
            }
          }
        )
        .on('postgres_changes', 
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'events',
            filter: `contractor_id=eq.${userId}` 
          }, 
          payload => {
            console.log('Event update received:', payload);
            if (payload.new) {
              try {
                const processedEvent = transformEventData(payload.new);
                onEventUpdated(processedEvent);
              } catch (err) {
                console.error('Erro ao processar evento atualizado:', err);
              }
            }
          }
        )
        .on('postgres_changes', 
          { 
            event: 'DELETE', 
            schema: 'public', 
            table: 'events' 
          }, 
          payload => {
            console.log('Event deletion received:', payload);
            // Make sure we're getting the deleted event ID
            if (payload.old && payload.old.id) {
              const deletedEventId = payload.old.id;
              console.log('Removing event with ID:', deletedEventId);
              // Garantindo que onEventDeleted é chamado com o ID correto
              onEventDeleted(deletedEventId);
              
              // Notifica o usuário sobre a exclusão bem-sucedida se não estiver na página de detalhes
              if (!window.location.pathname.includes(deletedEventId)) {
                toast.success("Um evento foi excluído com sucesso");
              }
            } else {
              console.error('Missing ID in delete event payload:', payload);
            }
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('Inscrição realtime bem-sucedida');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Erro no canal de tempo real');
            toast.error('Erro na conexão em tempo real. Algumas atualizações podem não ser recebidas automaticamente.', {
              duration: 5000
            });
          }
        });
        
      // Cleanup subscription on unmount
      return () => {
        console.log('Removing subscription');
        try {
          supabase.removeChannel(channel);
        } catch (err) {
          console.error('Erro ao remover canal:', err);
        }
      };
    } catch (error) {
      console.error("Erro ao configurar o canal de tempo real:", error);
      toast.error('Não foi possível configurar atualizações em tempo real');
    }
  }, [userId, onEventAdded, onEventUpdated, onEventDeleted]);
};
