
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { fetchLocationFromCEP, formatCep } from '@/utils/cep';
import { CreateEventFormData } from '@/types/events';

interface LocationServiceFieldsProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const LocationServiceFields = ({ form }: LocationServiceFieldsProps) => {
  const cepValue = form.watch('zipcode');

  useEffect(() => {
    const fetchAddressData = async () => {
      if (cepValue && cepValue.replace(/\D/g, '').length === 8) {
        try {
          const data = await fetchLocationFromCEP(cepValue.replace(/\D/g, ''));
          if (data && !data.erro) {
            form.setValue('street', data.logradouro || '');
            form.setValue('neighborhood', data.bairro || '');
            form.setValue('city', data.localidade || '');
            form.setValue('state', data.uf || '');
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
        }
      }
    };

    fetchAddressData();
  }, [cepValue, form]);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedCep = formatCep(value);
    form.setValue('zipcode', formattedCep);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Localização e Serviços</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Local*</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Salão de Festas, Residência..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zipcode"
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>CEP*</FormLabel>
              <FormControl>
                <Input 
                  placeholder="00000-000" 
                  value={value} 
                  onChange={(e) => {
                    handleCepChange(e);
                    onChange(e);
                  }}
                  maxLength={9}
                  {...rest} 
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
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rua*</FormLabel>
              <FormControl>
                <Input placeholder="Nome da rua" {...field} />
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
              <FormLabel>Número*</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro*</FormLabel>
              <FormControl>
                <Input placeholder="Nome do bairro" {...field} />
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
              <FormLabel>Cidade*</FormLabel>
              <FormControl>
                <Input placeholder="Nome da cidade" {...field} />
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
              <FormLabel>Estado*</FormLabel>
              <FormControl>
                <Input placeholder="UF" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
