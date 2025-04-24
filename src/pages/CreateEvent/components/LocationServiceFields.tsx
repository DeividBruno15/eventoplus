
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { CreateEventFormData } from '../schema';

interface LocationServiceFieldsProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const LocationServiceFields = ({ form }: LocationServiceFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="location">Local do Evento*</Label>
        <Input 
          id="location"
          placeholder="Ex.: Salão de Festas Primavera, Rua das Flores, 123 - São Paulo, SP"
          {...form.register('location')}
        />
        {form.formState.errors.location && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.location.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="service_type">Tipo de Serviço*</Label>
        <Input 
          id="service_type"
          placeholder="Ex.: Buffet, Decoração, Fotografia, DJ"
          {...form.register('service_type')}
        />
        {form.formState.errors.service_type && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.service_type.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="max_attendees">Número de Convidados (opcional)</Label>
        <Input 
          id="max_attendees"
          type="number"
          placeholder="Ex.: 100"
          min="1"
          {...form.register('max_attendees')}
        />
        {form.formState.errors.max_attendees && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.max_attendees.message}</p>
        )}
      </div>
    </>
  );
};
