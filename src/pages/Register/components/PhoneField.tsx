
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '../types';

interface PhoneFieldProps {
  form: UseFormReturn<RegisterFormData>;
}

export const PhoneField = ({ form }: PhoneFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="phone_number"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Telefone Whatsapp</FormLabel>
          <FormControl>
            <Input 
              placeholder="(00) 00000-0000" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
