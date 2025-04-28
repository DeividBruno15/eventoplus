
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
          <Tabs 
            defaultValue="fisica"
            onValueChange={(value) => form.setValue('person_type', value as 'fisica' | 'juridica')}
            value={field.value}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="fisica">Pessoa Física</TabsTrigger>
              <TabsTrigger value="juridica">Pessoa Jurídica</TabsTrigger>
            </TabsList>
          </Tabs>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
