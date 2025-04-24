
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '../types';

interface DocumentFieldsProps {
  form: UseFormReturn<RegisterFormData>;
}

export const DocumentFields = ({ form }: DocumentFieldsProps) => {
  const personType = form.watch('person_type');

  // Update field label based on person type
  const documentLabel = personType === 'fisica' ? 'CPF' : 'CNPJ';
  
  // Apply mask or validation based on the person type
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Apply basic formatting based on document type
    if (personType === 'fisica' && value.length > 0) {
      // CPF format: 000.000.000-00
      if (value.length > 11) value = value.substring(0, 11);
    } else if (personType === 'juridica' && value.length > 0) {
      // CNPJ format: 00.000.000/0000-00
      if (value.length > 14) value = value.substring(0, 14);
    }
    
    form.setValue('document_number', value);
  };

  return (
    <FormField
      control={form.control}
      name="document_number"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{documentLabel}</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              onChange={handleDocumentChange}
              placeholder={personType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
