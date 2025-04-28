
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createEventSchema, type CreateEventFormData } from '../schema';
import { useCreateEvent } from '../hooks/useCreateEvent';
import { useNavigate, useParams } from 'react-router-dom';
import { BasicEventFields } from './BasicEventFields';
import { LocationServiceFields } from './LocationServiceFields';
import { ImageUploadField } from './ImageUploadField';
import { useToast } from '@/hooks/use-toast';
import { ServiceSelectionField } from './ServiceSelectionField';
import { DescriptionField } from './DescriptionField';

export const CreateEventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { createEvent, loading, event, fetchEvent } = useCreateEvent();
  
  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: '',
      description: '',
      event_date: '',
      event_time: '',
      location: '',
      max_attendees: null,
      service_requests: [],
      image: null
    },
  });
  
  useEffect(() => {
    if (id) {
      fetchEvent(id).then(eventData => {
        if (eventData) {
          // Configurar valores do formulário com os dados do evento
          form.reset({
            name: eventData.name || '',
            description: eventData.description || '',
            event_date: eventData.event_date ? new Date(eventData.event_date).toISOString().split('T')[0] : '',
            event_time: eventData.event_time || '',
            location: eventData.location || '',
            max_attendees: eventData.max_attendees || null,
            service_requests: eventData.service_requests || [],
            image: null  // Não podemos definir objetos File diretamente
          });
          
          toast({
            title: "Evento carregado",
            description: "Você está editando um evento existente."
          });
        }
      }).catch(error => {
        console.error("Error fetching event:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o evento.",
          variant: "destructive"
        });
        navigate('/events');
      });
    }
  }, [id, fetchEvent, form, navigate, toast]);
  
  const handleSubmit = async (data: CreateEventFormData) => {
    try {
      console.log("Submitting event data:", data);
      const result = await createEvent(data, id);
      
      if (result) {
        toast({
          title: id ? "Evento atualizado" : "Evento criado",
          description: id ? "Seu evento foi atualizado com sucesso." : "Seu evento foi criado com sucesso."
        });
        navigate('/events');
      } else {
        throw new Error("Falha ao salvar o evento");
      }
    } catch (error) {
      console.error("Error creating/updating event:", error);
      toast({
        title: "Erro",
        description: `Não foi possível ${id ? 'atualizar' : 'criar'} o evento.`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <BasicEventFields form={form} />
      <DescriptionField form={form} />
      <LocationServiceFields form={form} />
      <ServiceSelectionField form={form} />
      <ImageUploadField 
        form={form} 
        defaultImage={event?.image_url}
      />
      
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
              {id ? 'Atualizando...' : 'Criando...'}
            </>
          ) : (
            id ? 'Atualizar Evento' : 'Criar Evento'
          )}
        </Button>
      </div>
    </form>
  );
};
