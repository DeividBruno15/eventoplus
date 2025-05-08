
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { createEventSchema } from '../schema';
import { CreateEventFormData } from '@/types/events';
import { BasicEventFields } from './BasicEventFields';
import { LocationServiceFields } from './LocationServiceFields';
import { DescriptionField } from './DescriptionField';
import { ServiceSelectionField } from './ServiceSelectionField';
import { ImageUploadField } from './ImageUploadField';
import { UserCompanySelector } from './UserCompanySelector';
import { useEventFormSubmit } from '../hooks/useEventFormSubmit';
import { VenueSelectionField } from './VenueSelectionField';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function CreateEventForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleSubmit, loading } = useEventFormSubmit();
  const preSelectedVenueId = location.state?.preSelectedVenue;
  
  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: '',
      description: '',
      event_date: '',
      event_time: '',
      zipcode: '',
      location: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      venue_id: preSelectedVenueId || '',
      service_requests: [{ category: '', count: 1, price: 0 }],
      image: null
    }
  });

  // Se houver um venue_id pré-selecionado, carregue os detalhes do local
  useEffect(() => {
    const fetchVenueDetails = async () => {
      if (!preSelectedVenueId) return;

      try {
        const { data, error } = await supabase
          .from('user_venues')
          .select('street, number, neighborhood, city, state, zipcode')
          .eq('id', preSelectedVenueId)
          .single();

        if (error) throw error;

        if (data) {
          // Update form fields with venue address
          form.setValue('street', data.street);
          form.setValue('number', data.number);
          form.setValue('neighborhood', data.neighborhood);
          form.setValue('city', data.city);
          form.setValue('state', data.state);
          form.setValue('zipcode', data.zipcode);
          
          // Set venue_id
          form.setValue('venue_id', preSelectedVenueId);

          // Create a location string
          const locationStr = `${data.street}, ${data.number} - ${data.neighborhood}, ${data.city}/${data.state}`;
          form.setValue('location', locationStr);
        }
      } catch (error) {
        console.error('Error fetching venue details:', error);
      }
    };

    fetchVenueDetails();
  }, [preSelectedVenueId, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <UserCompanySelector form={form} />
        
        <BasicEventFields form={form} />
        <Separator />
        
        {/* Add the venue selection field */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Local do Evento</h3>
          <VenueSelectionField form={form} />
        </div>
        <Separator />
        
        <LocationServiceFields form={form} />
        <Separator />
        
        <DescriptionField form={form} />
        <Separator />
        
        <ServiceSelectionField form={form} />
        <Separator />
        
        <ImageUploadField form={form} />
        
        <FormButtons loading={loading} onCancel={() => navigate('/events')} />
      </form>
    </Form>
  );
}

interface FormButtonsProps {
  loading: boolean;
  onCancel: () => void;
}

export const FormButtons = ({ loading, onCancel }: FormButtonsProps) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button
        variant="outline"
        onClick={onCancel}
        type="button"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
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
  );
};
