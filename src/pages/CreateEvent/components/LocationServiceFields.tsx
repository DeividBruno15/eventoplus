
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { fetchAddressByCep } from '@/utils/cep';
import { Loader2, MapPin } from 'lucide-react';
import type { CreateEventFormData } from '../schema';

interface LocationServiceFieldsProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const LocationServiceFields = ({ form }: LocationServiceFieldsProps) => {
  const [fetchingCity, setFetchingCity] = useState(false);
  const [cep, setCep] = useState('');

  // Formata o CEP enquanto o usuário digita
  const formatCEP = (value: string): string => {
    // Remove todos os caracteres que não são números
    value = value.replace(/\D/g, '');
    
    // Aplica a máscara: 12345-678
    if (value.length > 5) {
      return `${value.substring(0, 5)}-${value.substring(5, 8)}`;
    }
    
    return value;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatCEP(rawValue);
    setCep(formattedValue);
    
    // Busca o CEP quando atinge 8 dígitos (sem contar o hífen)
    const digitsOnly = formattedValue.replace(/\D/g, '');
    if (digitsOnly.length === 8) {
      fetchCityByCep(digitsOnly);
    }
  };

  const fetchCityByCep = async (cepValue: string) => {
    setFetchingCity(true);
    try {
      const address = await fetchAddressByCep(cepValue);
      if (address) {
        form.setValue('location', address.city);
        // Se você quiser preencher outros campos, pode fazer aqui
      } else {
        // CEP não encontrado
        form.setValue('location', '');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      form.setValue('location', '');
    } finally {
      setFetchingCity(false);
    }
  };

  // Quando o componente montar, verifica se já existe um CEP preenchido
  useEffect(() => {
    const currentCep = form.getValues().location;
    if (currentCep && currentCep.replace(/\D/g, '').length === 8) {
      setCep(formatCEP(currentCep));
    }
  }, [form]);

  return (
    <>
      <div>
        <Label htmlFor="cep">CEP</Label>
        <Input 
          id="cep"
          placeholder="Digite o CEP (00000-000)"
          value={cep}
          onChange={handleCepChange}
          maxLength={9}
          className="focus:border-primary"
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
