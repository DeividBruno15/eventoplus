import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createEventSchema } from '../schema';
import { useCreateEvent } from '@/hooks/useCreateEvent';
import { useNavigate, useParams } from 'react-router-dom';
import { BasicEventFields } from './BasicEventFields';
import { LocationServiceFields } from './LocationServiceFields';
import { ImageUploadField } from './ImageUploadField';
import { useToast } from '@/hooks/use-toast';
import { ServiceSelectionField } from './ServiceSelectionField';
import { DescriptionField } from './DescriptionField';
import { CreateEventFormData } from '@/types/events';

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
      zipcode: '',
      location: '',
      service_requests: [],
      image: null
    },
  });
  
  useEffect(() => {
    if (id) {
      fetchEvent(id).then(eventData => {
        if (eventData) {
          form.reset({
            name: eventData.name || '',
            description: eventData.description || '',
            event_date: eventData.event_date ? new Date(eventData.event_date).toISOString().split('T')[0] : '',
            event_time: eventData.event_time || '',
            zipcode: eventData.zipcode || '',
            location: eventData.location || '',
            service_requests: eventData.service_requests || [],
            image: null
          });
          
          toast({
            title: "Evento carregado",
            description: "Você está editando um evento existente."
          });
        }
      }).catch(error => {
        console.error("Erro ao carregar evento:", error);
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
      console.log("Enviando dados do evento:", data);
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
      console.error("Erro ao criar/atualizar evento:", error);
      toast({
        title: "Erro",
        description: `Não foi possível ${id ? 'atualizar' : 'criar'} o evento. Verifique os dados e tente novamente.`,
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
