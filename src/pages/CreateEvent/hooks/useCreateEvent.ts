
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreateEventFormData, Event } from '@/types/events';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useEventImageUpload } from './useEventImageUpload';
import { useServiceRequestUtils } from './useServiceRequestUtils';
import { useFetchEvent } from './useFetchEvent';

/**
 * Hook for creating and updating events
 */
export const useCreateEvent = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { uploadEventImage } = useEventImageUpload();
  const { prepareServiceRequestsForStorage } = useServiceRequestUtils();
  const { fetchEvent, event } = useFetchEvent();

  /**
   * Envia os dados do evento para o webhook do n8n
   * @param eventData Dados do evento a serem enviados
   */
  const sendEventToN8n = async (event: any) => {
    try {
      const eventoData = {
        evento_id: event.id,
        nome: event.name,
        data: event.event_date,
        tipo_servico: event.service_type,
        local: event.location,
      };

      console.log("Enviando dados para webhook:", eventoData);

      const response = await fetch("https://deveventoplus.app.n8n.cloud/webhook-test/novoevento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventoData),
      });

      const data = await response.json();
      console.log("Evento enviado para o n8n:", data);
      return true;
    } catch (error) {
      console.error("Erro ao enviar evento para o n8n:", error);
      // Não interrompe o fluxo em caso de erro no webhook
      return false;
    }
  };

  /**
   * Creates or updates an event
   * @param eventData The event data to save
   * @param eventId Optional event ID for updates
   * @returns Boolean indicating success
   */
  const createEvent = async (eventData: CreateEventFormData, eventId?: string): Promise<boolean> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      setLoading(true);
      let imageUrl = event?.image_url || null;
      
      // Handle image upload if there's a file
      if (eventData.image instanceof File) {
        try {
          imageUrl = await uploadEventImage(eventData.image);
          console.log('Image uploaded successfully:', imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
          throw new Error('Erro ao fazer upload da imagem');
        }
      }
      
      // Format location string from address components
      const formattedAddress = `${eventData.street}, ${eventData.number} - ${eventData.neighborhood}, ${eventData.city}-${eventData.state}`;
      
      // Validate service requests
      if (eventData.service_requests && eventData.service_requests.length > 0) {
        const hasEmptyCategory = eventData.service_requests.some(service => !service.category);
        if (hasEmptyCategory) {
          throw new Error('Todos os serviços devem ter uma categoria selecionada');
        }
      }
      
      // Convert date from DD/MM/YYYY to ISO format YYYY-MM-DD
      let isoDate = eventData.event_date;
      if (eventData.event_date && eventData.event_date.includes('/')) {
        const [day, month, year] = eventData.event_date.split('/');
        isoDate = `${year}-${month}-${day}`;
      }
      
      // Prepare event object for saving
      const eventToSave = {
        name: eventData.name,
        description: eventData.description,
        event_date: isoDate,
        event_time: eventData.event_time,
        location: formattedAddress,
        zipcode: eventData.zipcode,
        service_requests: prepareServiceRequestsForStorage(eventData.service_requests),
        image_url: imageUrl,
        contractor_id: user.id,
        user_id: user.id, 
        status: 'published',
        service_type: eventData.service_requests?.[0]?.category || ''
      };

      console.log("Saving event with data:", eventToSave);
      
      let response;
      let savedEvent;
      
      if (eventId) {
        response = await supabase
          .from('events')
          .update(eventToSave)
          .eq('id', eventId)
          .select();
          
        if (response.data && response.data.length > 0) {
          savedEvent = response.data[0];
        }
      } else {
        response = await supabase
          .from('events')
          .insert(eventToSave)
          .select();
          
        if (response.data && response.data.length > 0) {
          savedEvent = response.data[0];
        }
      }

      if (response.error) {
        console.error("Error in Supabase:", response.error);
        throw new Error(response.error.message || 'Error saving the event to the database');
      }
      
      console.log("Event saved successfully:", response);
      
      // Enviar dados para o webhook do n8n
      if (savedEvent) {
        await sendEventToN8n(savedEvent);
      } else {
        console.warn("Evento salvo, mas não foi possível recuperar os dados para enviar ao webhook");
      }
      
      toast.success("Evento salvo com sucesso!");
      return true;
    } catch (error: any) {
      console.error('Error creating/updating event:', error);
      toast.error(error.message || 'Ocorreu um erro ao criar o evento');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { 
    createEvent, 
    loading, 
    event, 
    fetchEvent 
  };
};
