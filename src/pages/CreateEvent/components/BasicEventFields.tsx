
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { CreateEventFormData } from '../schema';

interface BasicEventFieldsProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const BasicEventFields = ({ form }: BasicEventFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="name">Nome do Evento*</Label>
        <Input 
          id="name"
          placeholder="Ex.: Casamento de João e Maria"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="event_date">Data do Evento*</Label>
          <Input 
            id="event_date"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            {...form.register('event_date')}
          />
          {form.formState.errors.event_date && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.event_date.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="event_time">Horário*</Label>
          <Input 
            id="event_time"
            type="time"
            {...form.register('event_time')}
          />
          {form.formState.errors.event_time && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.event_time.message}</p>
          )}
        </div>
      </div>
    </>
  );
};
