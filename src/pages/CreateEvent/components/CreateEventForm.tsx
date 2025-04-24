
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createEventSchema, type CreateEventFormData } from '../schema';
import { useCreateEvent } from '../hooks/useCreateEvent';
import { useNavigate } from 'react-router-dom';
import { BasicEventFields } from './BasicEventFields';
import { LocationServiceFields } from './LocationServiceFields';
import { DescriptionField } from './DescriptionField';

export const CreateEventForm = () => {
  const navigate = useNavigate();
  const { createEvent, loading } = useCreateEvent();
  
  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: '',
      description: '',
      event_date: '',
      event_time: '',
      location: '',
      service_type: '',
      max_attendees: null,
    },
  });
  
  return (
    <form onSubmit={form.handleSubmit(createEvent)} className="space-y-6">
      <BasicEventFields form={form} />
      <LocationServiceFields form={form} />
      <DescriptionField form={form} />
      
      <div className="flex gap-4 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/events')}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            'Criar Evento'
          )}
        </Button>
      </div>
    </form>
  );
};
