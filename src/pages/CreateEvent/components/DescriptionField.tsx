
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { CreateEventFormData } from '@/types/events';

interface DescriptionFieldProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const DescriptionField = ({ form }: DescriptionFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrição do Evento*</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Descreva detalhes do evento, necessidades específicas, orçamento estimado, etc."
              rows={5}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
