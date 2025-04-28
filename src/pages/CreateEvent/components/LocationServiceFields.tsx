
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { CreateEventFormData } from '../schema';

interface LocationServiceFieldsProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const LocationServiceFields = ({ form }: LocationServiceFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Local do evento</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Salão de festas, endereço completo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="max_attendees"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número máximo de convidados</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Ex: 100" 
                {...field} 
                onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
