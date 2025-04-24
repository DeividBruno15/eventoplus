
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createEventSchema, type CreateEventFormData } from '../schema';
import { useCreateEvent } from '../hooks/useCreateEvent';
import { useNavigate } from 'react-router-dom';

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
      <div>
        <Label htmlFor="name">Nome do Evento*</Label>
        <Input 
          id="name"
          placeholder="Ex.: Casamento de João e Maria"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="event_date">Data do Evento*</Label>
          <Input 
            id="event_date"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            {...form.register('event_date')}
          />
          {form.formState.errors.event_date && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.event_date.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="event_time">Horário*</Label>
          <Input 
            id="event_time"
            type="time"
            {...form.register('event_time')}
          />
          {form.formState.errors.event_time && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.event_time.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="location">Local do Evento*</Label>
        <Input 
          id="location"
          placeholder="Ex.: Salão de Festas Primavera, Rua das Flores, 123 - São Paulo, SP"
          {...form.register('location')}
        />
        {form.formState.errors.location && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.location.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="service_type">Tipo de Serviço*</Label>
        <Input 
          id="service_type"
          placeholder="Ex.: Buffet, Decoração, Fotografia, DJ"
          {...form.register('service_type')}
        />
        {form.formState.errors.service_type && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.service_type.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="max_attendees">Número de Convidados (opcional)</Label>
        <Input 
          id="max_attendees"
          type="number"
          placeholder="Ex.: 100"
          min="1"
          {...form.register('max_attendees')}
        />
        {form.formState.errors.max_attendees && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.max_attendees.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="description">Descrição do Evento*</Label>
        <Textarea 
          id="description"
          placeholder="Descreva detalhes do evento, necessidades específicas, orçamento estimado, etc."
          rows={5}
          {...form.register('description')}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
        )}
      </div>
      
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
