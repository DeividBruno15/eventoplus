
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '../types';

interface RoleSelectorProps {
  form: UseFormReturn<RegisterFormData>;
}

export const RoleSelector = ({ form }: RoleSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de pessoa</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.setValue('role', 'contractor')}
              className={field.value === 'contractor' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}
            >
              Sou Contratante
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.setValue('role', 'provider')}
              className={field.value === 'provider' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}
            >
              Sou Prestador
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
