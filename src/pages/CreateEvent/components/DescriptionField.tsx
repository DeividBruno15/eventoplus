
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CreateEventFormData } from '../schema';

interface DescriptionFieldProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const DescriptionField = ({ form }: DescriptionFieldProps) => {
  return (
    <div>
      <Label htmlFor="description">Descrição do Evento*</Label>
      <Textarea 
        id="description"
        placeholder="Descreva detalhes do evento, necessidades específicas, orçamento estimado, etc."
        rows={5}
        {...form.register('description')}
      />
      {form.formState.errors.description && (
        <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
      )}
    </div>
  );
};
