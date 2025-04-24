
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '../types';

interface PersonTypeSelectorProps {
  form: UseFormReturn<RegisterFormData>;
}

export const PersonTypeSelector = ({ form }: PersonTypeSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="person_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de pessoa</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.setValue('person_type', 'fisica')}
              className={field.value === 'fisica' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}
            >
              Pessoa Física
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.setValue('person_type', 'juridica')}
              className={field.value === 'juridica' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}
            >
              Pessoa Jurídica
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
