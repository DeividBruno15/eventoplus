
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
    
    let formattedValue = value;
    
    // Apply formatting for display
    if (personType === 'fisica' && value.length > 0) {
      // CPF format: 000.000.000-00
      if (value.length > 11) value = value.substring(0, 11);
      
      if (value.length > 9) {
        formattedValue = `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6, 9)}-${value.substring(9)}`;
      } else if (value.length > 6) {
        formattedValue = `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6)}`;
      } else if (value.length > 3) {
        formattedValue = `${value.substring(0, 3)}.${value.substring(3)}`;
      }
    } else if (personType === 'juridica' && value.length > 0) {
      // CNPJ format: 00.000.000/0000-00
      if (value.length > 14) value = value.substring(0, 14);
      
      if (value.length > 12) {
        formattedValue = `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5, 8)}/${value.substring(8, 12)}-${value.substring(12)}`;
      } else if (value.length > 8) {
        formattedValue = `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5, 8)}/${value.substring(8)}`;
      } else if (value.length > 5) {
        formattedValue = `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5)}`;
      } else if (value.length > 2) {
        formattedValue = `${value.substring(0, 2)}.${value.substring(2)}`;
      }
    }
    
    // Atualiza o valor formatado no campo
    e.target.value = formattedValue;
    
    // Armazena o valor bruto no form
    form.setValue('document_number', value);
  };

  // Validação de CPF e CNPJ
  const validateDocument = (value: string) => {
    if (!value) return false;
    
    if (personType === 'fisica') {
      return value.length === 11;
    } else {
      return value.length === 14;
    }
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
              onBlur={() => {
                if (!validateDocument(field.value)) {
                  form.setError('document_number', { 
                    type: 'manual', 
                    message: personType === 'fisica' ? 'CPF inválido' : 'CNPJ inválido' 
                  });
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
