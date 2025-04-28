
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { CreateEventFormData } from '@/types/events';
import { useState } from 'react';
import { fetchAddressByCep } from '@/utils/cep';
import { Loader2 } from 'lucide-react';

interface LocationServiceFieldsProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const LocationServiceFields = ({ form }: LocationServiceFieldsProps) => {
  const [loading, setLoading] = useState(false);

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    
    if (cep.length !== 8) return;
    
    try {
      setLoading(true);
      const addressData = await fetchAddressByCep(cep);
      
      if (addressData) {
        form.setValue('street', addressData.street);
        form.setValue('neighborhood', addressData.neighborhood);
        form.setValue('city', addressData.city);
        form.setValue('state', addressData.state);
        form.setValue('number', '');
        
        // Update the location field with the complete address
        const formattedAddress = `${addressData.street} - ${addressData.neighborhood}, ${addressData.city}-${addressData.state}`;
        form.setValue('location', formattedAddress);
      }
    } catch (error) {
      console.error('Error fetching address from CEP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="zipcode">CEP*</Label>
          <Input
            id="zipcode"
            placeholder="Ex: 00000-000"
            {...form.register('zipcode')}
            onBlur={handleCepBlur}
            disabled={loading}
          />
          {form.formState.errors.zipcode && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.zipcode.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="state">Estado*</Label>
          <Input
            id="state"
            placeholder="Ex: SP"
            {...form.register('state')}
            disabled={loading}
          />
          {form.formState.errors.state && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.state.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="city">Cidade*</Label>
          <Input
            id="city"
            placeholder="Ex: São Paulo"
            {...form.register('city')}
            disabled={loading}
          />
          {form.formState.errors.city && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.city.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="neighborhood">Bairro*</Label>
          <Input
            id="neighborhood"
            placeholder="Ex: Centro"
            {...form.register('neighborhood')}
            disabled={loading}
          />
          {form.formState.errors.neighborhood && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.neighborhood.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="street">Rua*</Label>
          <Input
            id="street"
            placeholder="Ex: Av. Paulista"
            {...form.register('street')}
            disabled={loading}
          />
          {form.formState.errors.street && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.street.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="number">Número*</Label>
          <Input
            id="number"
            placeholder="Ex: 1000"
            {...form.register('number')}
            disabled={loading}
          />
          {form.formState.errors.number && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.number.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="location">Endereço completo do evento*</Label>
        <Input
          id="location"
          placeholder="Ex: Salão de festas, endereço completo"
          {...form.register('location')}
          disabled={loading}
        />
        {form.formState.errors.location && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.location.message}</p>
        )}
        {loading && (
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
            <span>Buscando endereço...</span>
          </div>
        )}
      </div>
    </div>
  );
};
