
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateEventFormData } from '../schema';
import { useEffect } from 'react';
import { formatDate } from '@/lib/utils';

interface BasicEventFieldsProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const BasicEventFields = ({ form }: BasicEventFieldsProps) => {
  // Formata a data enquanto o usuário digita
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    
    // Adiciona as barras conforme o usuário vai digitando
    if (value.length > 4) {
      value = value.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d+)/, '$1/$2');
    }
    
    form.setValue('event_date', value);
  };
  
  // Valida a data para não aceitar datas anteriores ao dia atual
  const validateEventDate = () => {
    const dateValue = form.getValues('event_date');
    if (!dateValue || dateValue.length !== 10) return;
    
    const [day, month, year] = dateValue.split('/').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      form.setError('event_date', { 
        type: 'manual', 
        message: 'A data do evento não pode ser anterior ao dia atual' 
      });
    } else {
      form.clearErrors('event_date');
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Evento</FormLabel>
            <FormControl>
              <Input placeholder="Digite o nome do evento" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="event_date"
          render={({ field: { onChange, onBlur, value, ...field } }) => (
            <FormItem>
              <FormLabel>Data do Evento</FormLabel>
              <FormControl>
                <Input 
                  placeholder="DD/MM/AAAA" 
                  value={value}
                  onChange={(e) => {
                    handleDateInput(e);
                  }}
                  onBlur={() => {
                    onBlur();
                    validateEventDate();
                  }}
                  {...field}
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
              <FormLabel>Horário</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
