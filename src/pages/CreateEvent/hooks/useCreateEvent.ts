
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { CreateEventFormData } from '../schema';

export const useCreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createEvent = async (data: CreateEventFormData) => {
    if (!user) {
      toast({
        title: "Você precisa estar logado",
        description: "Faça login para criar um evento",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const eventDate = new Date(`${data.event_date}T${data.event_time}`);
      
      const { data: eventData, error } = await supabase
        .from('events')
        .insert({
          name: data.name,
          description: data.description,
          event_date: eventDate.toISOString(),
          location: data.location,
          service_type: data.service_type,
          max_attendees: data.max_attendees ?? null,
          contractor_id: user.id,
          status: 'open'
        })
        .select('*')
        .single();
      
      if (error) throw error;

      toast({
        title: "Evento criado com sucesso!",
        description: "Seu evento foi publicado e já está disponível para candidaturas.",
      });

      const eventId = (eventData as { id: string }).id;
      navigate(`/events/${eventId}`);
    } catch (error: any) {
      console.error('Erro ao criar evento:', error);
      toast({
        title: "Erro ao criar evento",
        description: error.message || 'Ocorreu um erro ao criar seu evento',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, loading };
};
