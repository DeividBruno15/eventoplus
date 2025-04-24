
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '../types';

interface DocumentFieldsProps {
  form: UseFormReturn<RegisterFormData>;
}

export const DocumentFields = ({ form }: DocumentFieldsProps) => {
  return (
    <FormField
      control={form.control}
      name="document_number"
      render={({ field }) => (
        <FormItem>
          <FormLabel>CPF/CNPJ</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
