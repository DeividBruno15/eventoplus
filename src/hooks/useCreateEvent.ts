
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreateEventFormData, Event, ServiceRequest } from '@/types/events';
import { useAuth } from '@/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
import { Json } from '@/integrations/supabase/types';

export const useCreateEvent = () => {
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const { user } = useAuth();

  const fetchEvent = async (id: string): Promise<Event | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Transform the data to match the Event type
      const eventData: Event = {
        ...data,
        service_requests: data.service_requests ? parseServiceRequests(data.service_requests as Json) : null
      } as Event;

      setEvent(eventData);
      return eventData;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse service_requests from Json to ServiceRequest[]
  const parseServiceRequests = (jsonData: Json): ServiceRequest[] => {
    if (Array.isArray(jsonData)) {
      return jsonData.map(item => {
        if (typeof item === 'object' && item !== null) {
          const jsonObj = item as Record<string, Json>;
          return {
            category: typeof jsonObj.category === 'string' ? jsonObj.category : '',
            count: typeof jsonObj.count === 'number' ? jsonObj.count : 0,
            filled: typeof jsonObj.filled === 'number' ? jsonObj.filled : 0
          };
        }
        return { category: '', count: 0, filled: 0 };
      });
    }
    return [];
  };

  // Helper function to convert ServiceRequest[] to Json for database storage
  const prepareServiceRequestsForStorage = (requests: ServiceRequest[] | undefined): Json => {
    if (!requests || !Array.isArray(requests)) return [];
    return requests as unknown as Json;
  };

  const uploadEventImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `event-images/${fileName}`;
      
      const { error: bucketError } = await supabase.storage
        .createBucket('events', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        }).catch(() => ({ error: null })); // Ignora erro se o bucket já existir
      
      const { error } = await supabase.storage
        .from('events')
        .upload(filePath, file);
        
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('events')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  };

  const createEvent = async (eventData: CreateEventFormData, eventId?: string): Promise<boolean> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      setLoading(true);
      let imageUrl = event?.image_url || null;
      
      if (eventData.image instanceof File) {
        imageUrl = await uploadEventImage(eventData.image);
      }
      
      // Convert ServiceRequest[] to Json for database storage
      const eventToSave = {
        name: eventData.name,
        description: eventData.description,
        event_date: eventData.event_date,
        event_time: eventData.event_time,
        location: eventData.location,
        zipcode: eventData.zipcode,
        service_requests: prepareServiceRequestsForStorage(eventData.service_requests),
        image_url: imageUrl,
        contractor_id: user.id,
        status: 'draft' as const,
        service_type: eventData.service_requests?.[0]?.category || '' // Use a primeira categoria de serviço ou vazio
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
        throw response.error;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao criar/atualizar evento:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, loading, event, fetchEvent };
};
