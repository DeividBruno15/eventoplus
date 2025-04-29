
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CreateEventFormData } from '@/types/events';
import { useCreateEvent } from './useCreateEvent';

export const useEventFormSubmit = () => {
  const navigate = useNavigate();
  const { createEvent, loading } = useCreateEvent();
  
  const handleSubmit = async (data: CreateEventFormData) => {
    try {
      // Verify all services have categories
      if (data.service_requests && data.service_requests.length > 0) {
        const hasEmptyCategory = data.service_requests.some(service => !service.category);
        if (hasEmptyCategory) {
          toast.error('Todos os serviços devem ter uma categoria selecionada');
          return;
        }
      }
      
      // Validate event date (can't be before today)
      if (data.event_date) {
        const [day, month, year] = data.event_date.split('/').map(Number);
        const selectedDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          toast.error('A data do evento não pode ser anterior ao dia atual');
          return;
        }
      }
      
      console.log('Submitting event data:', data);
      const result = await createEvent(data);
      
      if (result) {
        toast.success('Evento criado com sucesso!');
        navigate('/events');
      }
    } catch (error: any) {
      console.error('Erro ao criar evento:', error);
      toast.error(error.message || 'Ocorreu um erro ao criar o evento. Tente novamente.');
    }
  };

  return {
    handleSubmit,
    loading
  };
};
