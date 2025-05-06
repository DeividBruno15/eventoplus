
import { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '@/pages/Register/types';
import { fetchAddressByCep, formatCep } from '@/utils/cep';

interface AddressFieldsProps {
  form: UseFormReturn<RegisterFormData>;
}

export const AddressFields = ({ form }: AddressFieldsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  // Format CEP as it's being typed
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCep = formatCep(e.target.value);
    form.setValue('zipcode', formattedCep);
    
    // Auto-fetch address when CEP is fully entered (8 digits)
    const digits = formattedCep.replace(/\D/g, '');
    if (digits.length === 8) {
      fetchAddressFromCep(formattedCep);
    }
  };

  // Fetch address when the CEP field loses focus
  const fetchAddressFromCep = async (cep: string) => {
    setCepError('');
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      setCepError('CEP inválido');
      return;
    }

    setIsLoading(true);
    try {
      const address = await fetchAddressByCep(cep);
      if (address) {
        form.setValue('street', address.street, { shouldValidate: true });
        form.setValue('neighborhood', address.neighborhood, { shouldValidate: true });
        form.setValue('city', address.city, { shouldValidate: true });
        form.setValue('state', address.state, { shouldValidate: true });
        // Focus on the number field after auto-completing address
        setTimeout(() => {
          document.getElementById('address-number')?.focus();
        }, 100);
      } else {
        setCepError('CEP não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setCepError('Erro ao buscar CEP');
    } finally {
      setIsLoading(false);
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
                onChange={handleCepChange}
                placeholder="00000-000"
                disabled={isLoading}
              />
            </FormControl>
            {cepError && <p className="text-sm text-destructive mt-1">{cepError}</p>}
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
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input 
                  id="address-number" 
                  {...field} 
                  placeholder="123" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado</FormLabel>
            <FormControl>
              <Input {...field} maxLength={2} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
