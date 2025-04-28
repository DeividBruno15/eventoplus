
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { CreateEventFormData } from '../schema';

interface LocationServiceFieldsProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const LocationServiceFields = ({ form }: LocationServiceFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <Label htmlFor="location">Local do evento*</Label>
        <Input
          id="location"
          placeholder="Ex: Salão de festas, endereço completo"
          {...form.register('location')}
        />
        {form.formState.errors.location && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.location.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="max_attendees">Número máximo de convidados</Label>
        <Input 
          id="max_attendees"
          type="number" 
          placeholder="Ex: 100" 
          {...form.register('max_attendees', {
            valueAsNumber: true,
            setValueAs: (value) => value === '' ? null : parseInt(value, 10)
          })}
        />
        {form.formState.errors.max_attendees && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.max_attendees.message}</p>
        )}
      </div>
    </div>
  );
};
