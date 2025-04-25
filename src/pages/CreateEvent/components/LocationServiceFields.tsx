
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { CreateEventFormData } from '../schema';
import { fetchAddressByCep } from '@/utils/cep';
import { Loader2, MapPin } from 'lucide-react';

interface LocationServiceFieldsProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const LocationServiceFields = ({ form }: LocationServiceFieldsProps) => {
  const [fetchingCity, setFetchingCity] = useState(false);
  const [cep, setCep] = useState('');

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCep(value);
    
    if (value.length === 8) {
      setFetchingCity(true);
      try {
        const address = await fetchAddressByCep(value);
        if (address) {
          form.setValue('location', address.city);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setFetchingCity(false);
      }
    }
  };

  return (
    <>
      <div>
        <Label htmlFor="cep">CEP</Label>
        <Input 
          id="cep"
          placeholder="Digite o CEP"
          value={cep}
          onChange={handleCepChange}
          maxLength={9}
        />
        {fetchingCity && (
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin mr-1" /> 
            Buscando cidade...
          </div>
        )}
      </div>
      
      <div>
        <Label htmlFor="location">Cidade*</Label>
        <div className="relative">
          <Input 
            id="location"
            placeholder="Ex.: São Paulo"
            {...form.register('location')}
          />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        {form.formState.errors.location && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.location.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="max_attendees">Número de Convidados (opcional)</Label>
        <Input 
          id="max_attendees"
          type="number"
          placeholder="Ex.: 100"
          min="1"
          {...form.register('max_attendees')}
        />
        {form.formState.errors.max_attendees && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.max_attendees.message}</p>
        )}
      </div>
    </>
  );
};
