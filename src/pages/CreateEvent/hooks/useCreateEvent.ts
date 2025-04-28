
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreateEventFormData } from '../schema';
import { Event } from '@/types/events';
import { useAuth } from '@/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';

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

      setEvent(data as Event);
      return data as Event;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadEventImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `event-images/${fileName}`;
    
    const { error } = await supabase.storage
      .from('events')
      .upload(filePath, file);
      
    if (error) throw error;
    
    const { data } = supabase.storage
      .from('events')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };

  const createEvent = async (eventData: CreateEventFormData, eventId?: string): Promise<boolean> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      setLoading(true);
      let imageUrl = event?.image_url || null;
      
      // Handle image upload if provided
      if (eventData.image instanceof File) {
        imageUrl = await uploadEventImage(eventData.image);
      }
      
      const eventToSave = {
        name: eventData.name,
        description: eventData.description,
        event_date: eventData.event_date,
        event_time: eventData.event_time,
        location: eventData.location,
        service_type: eventData.service_type || null,
        max_attendees: eventData.max_attendees,
        service_requests: eventData.service_requests || [],
        image_url: imageUrl,
        contractor_id: user.id,
        status: 'draft' as const
      };

      console.log("Saving event:", eventToSave);
      
      let response;
      
      if (eventId) {
        // Update existing event
        response = await supabase
          .from('events')
          .update(eventToSave)
          .eq('id', eventId);
      } else {
        // Create new event
        response = await supabase
          .from('events')
          .insert([eventToSave]);
      }

      if (response.error) {
        console.error("Supabase error:", response.error);
        throw response.error;
      }
      
      return true;
    } catch (error) {
      console.error('Error creating/updating event:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, loading, event, fetchEvent };
};
