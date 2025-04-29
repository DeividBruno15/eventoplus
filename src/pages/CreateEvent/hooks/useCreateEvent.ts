
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreateEventFormData, Event, ServiceRequest } from '@/types/events';
import { useAuth } from '@/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
import { Json } from '@/integrations/supabase/types';
import { toast } from 'sonner';

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
  
  const parseServiceRequests = (jsonData: Json): ServiceRequest[] => {
    if (Array.isArray(jsonData)) {
      return jsonData.map(item => {
        if (typeof item === 'object' && item !== null) {
          const jsonObj = item as Record<string, Json>;
          return {
            category: typeof jsonObj.category === 'string' ? jsonObj.category : '',
            count: typeof jsonObj.count === 'number' ? jsonObj.count : 0,
            price: typeof jsonObj.price === 'number' ? jsonObj.price : 0,
            filled: typeof jsonObj.filled === 'number' ? jsonObj.filled : 0
          };
        }
        return { category: '', count: 0, price: 0, filled: 0 };
      });
    }
    return [];
  };

  const prepareServiceRequestsForStorage = (requests: ServiceRequest[] | undefined): Json => {
    if (!requests || !Array.isArray(requests)) return [];
    
    // Garantir que todos os campos price sejam números
    const preparedRequests = requests.map(req => ({
      ...req,
      price: req.price ? Number(req.price) : 0
    }));
    
    return preparedRequests as unknown as Json;
  };

  const uploadEventImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `event-images/${fileName}`;
      
      // Create events bucket if it doesn't exist
      try {
        const { data: bucketList } = await supabase.storage.listBuckets();
        const eventsBucketExists = bucketList?.some(bucket => bucket.name === 'events');
        
        if (!eventsBucketExists) {
          await supabase.storage.createBucket('events', { 
            public: true,
            fileSizeLimit: 10485760 // 10MB
          });
        }
      } catch (error) {
        // Log error but continue, as the bucket might already exist
        console.log('Bucket check/creation info:', error);
      }

      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('events')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Error uploading file: ${uploadError.message}`);
      }
      
      if (!data) {
        throw new Error('No data returned from upload');
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('events')
        .getPublicUrl(filePath);
        
      if (!publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL');
      }
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadEventImage:', error);
      throw error;
    }
  };

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
      
      // Prepare event object for saving - removed city and other fields that don't exist in the schema
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

  return { createEvent, loading, event, fetchEvent };
};
