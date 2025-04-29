
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
      
      // Prepare event object for saving - only include fields that exist in the schema
      const eventToSave = {
        name: eventData.name,
        description: eventData.description,
        event_date: eventData.event_date,
        event_time: eventData.event_time,
        location: formattedAddress,
        zipcode: eventData.zipcode,
        service_requests: prepareServiceRequestsForStorage(eventData.service_requests),
        image_url: imageUrl,
        contractor_id: user.id,
        status: 'published' as const,
        service_type: eventData.service_requests?.[0]?.category || ''
      };

      console.log("Salvando evento:", eventToSave);
      
      let response;
      
      if (eventId) {
        response = await supabase
          .from('events')
          .update(eventToSave)
          .eq('id', eventId);
      } else {
        response = await supabase
          .from('events')
          .insert([eventToSave]);
      }

      if (response.error) {
        console.error("Erro no Supabase:", response.error);
        throw new Error(response.error.message || 'Erro ao salvar o evento no banco de dados');
      }
      
      return true;
    } catch (error: any) {
      console.error('Erro ao criar/atualizar evento:', error);
      throw new Error(error.message || 'Ocorreu um erro ao criar o evento');
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
