
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { CreateEventFormData } from '../schema';
import { useState } from 'react';
import { fetchLocationFromCEP } from '@/utils/cep';

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
      const locationData = await fetchLocationFromCEP(cep);
      
      if (locationData) {
        // If we have location data, we can pre-fill the address field
        const formattedAddress = `${locationData.logradouro}, ${locationData.bairro}, ${locationData.localidade}-${locationData.uf}`;
        form.setValue('location', formattedAddress);
      }
    } catch (error) {
      console.error('Error fetching address from CEP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <Label htmlFor="location">Local do evento*</Label>
        <Input
          id="location"
          placeholder="Ex: Salão de festas, endereço completo"
          {...form.register('location')}
          disabled={loading}
        />
        {form.formState.errors.location && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.location.message}</p>
        )}
      </div>
    </div>
  );
};
