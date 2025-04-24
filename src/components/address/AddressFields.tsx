
import { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '@/pages/Register/types';
import { fetchAddressByCep } from '@/utils/cep';

interface AddressFieldsProps {
  form: UseFormReturn<RegisterFormData>;
}

export const AddressFields = ({ form }: AddressFieldsProps) => {
  const handleCepBlur = async () => {
    const cep = form.getValues('zipcode');
    if (!cep) return;

    const address = await fetchAddressByCep(cep);
    if (address) {
      form.setValue('street', address.street);
      form.setValue('neighborhood', address.neighborhood);
      form.setValue('city', address.city);
      form.setValue('state', address.state);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="zipcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEP</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                onBlur={handleCepBlur}
                placeholder="00000-000"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rua</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input {...field} maxLength={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
