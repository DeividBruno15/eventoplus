
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateEventFormData } from '@/types/events';
import { formatDateInput, isDateBeforeToday } from '@/lib/utils';

interface BasicEventFieldsProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const BasicEventFields = ({ form }: BasicEventFieldsProps) => {
  // Formata a data enquanto o usuário digita e adiciona "/" automaticamente
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDateInput(e.target.value);
    form.setValue('event_date', formattedValue);
  };
  
  // Valida a data para não aceitar datas anteriores ao dia atual
  const validateEventDate = () => {
    const dateValue = form.getValues('event_date');
    if (!dateValue || dateValue.length !== 10) return;
    
    if (isDateBeforeToday(dateValue)) {
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
