
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
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

export function CreateEventForm() {
  const navigate = useNavigate();
  const { handleSubmit, loading } = useEventFormSubmit();
  
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
      service_requests: [{ category: '', count: 1, price: 0 }],
      image: null
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <UserCompanySelector form={form} />
        
        <BasicEventFields form={form} />
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
