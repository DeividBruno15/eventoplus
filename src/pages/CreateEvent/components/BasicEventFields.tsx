
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateEventFormData } from '@/types/events';

interface BasicEventFieldsProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const BasicEventFields = ({ form }: BasicEventFieldsProps) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      // Format to dd/mm/yyyy
      if (value.length <= 2) {
        // Just day
      } else if (value.length <= 4) {
        // Day and month
        value = value.replace(/(\d{2})(\d{0,2})/, '$1/$2');
      } else {
        // Day, month and year
        value = value.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
      }
    }
    
    form.setValue('event_date', value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informações Básicas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Evento*</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Aniversário de 15 Anos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="event_date"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Data*</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="DD/MM/AAAA" 
                    value={value} 
                    onChange={(e) => {
                      handleDateChange(e);
                      onChange(e);
                    }}
                    maxLength={10}
                    {...rest} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="event_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário*</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
