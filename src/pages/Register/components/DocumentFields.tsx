
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '../types';
import { formatCPF, formatCep, validateCPF } from '@/utils/cep';
import { supabase } from '@/integrations/supabase/client';

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
    if (personType === 'fisica') {
      // CPF format: 000.000.000-00
      formattedValue = formatCPF(value);
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
    
    // Update the field value
    e.target.value = formattedValue;
    
    // Store the raw value in the form
    form.setValue('document_number', value, { shouldValidate: true });
  };

  // Validate CPF or CNPJ
  const validateDocument = async (value: string) => {
    if (!value) return false;
    
    if (personType === 'fisica') {
      const isValidCpf = validateCPF(value);
      if (!isValidCpf) {
        return "CPF inválido";
      }
      
      // Check if CPF already exists
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('document_number')
          .eq('document_number', value)
          .limit(1);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          return "Este CPF já está cadastrado";
        }
      } catch (error) {
        console.error("Erro ao verificar CPF:", error);
      }
      
      return true;
    } else {
      // CNPJ validation
      return value.length === 14 || "CNPJ inválido";
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
              onBlur={async () => {
                const value = field.value;
                if (value) {
                  const validationResult = await validateDocument(value);
                  if (validationResult !== true) {
                    form.setError('document_number', { 
                      type: 'manual', 
                      message: validationResult as string
                    });
                  }
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
