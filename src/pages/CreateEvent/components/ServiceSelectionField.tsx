
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { CreateEventFormData } from '@/types/events';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/utils';

interface ServiceSelectionFieldProps {
  form: UseFormReturn<CreateEventFormData>;
}

interface ServiceCategory {
  id: string;
  name: string;
}

export const ServiceSelectionField = ({ form }: ServiceSelectionFieldProps) => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "service_requests"
  });
  
  // Fetch service categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('service_categories')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Format price input to currency
  const handlePriceChange = (index: number, value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Convert to number (cents) and back to string with formatting
    const priceInCents = parseInt(numericValue) || 0;
    const priceInReais = priceInCents / 100;
    
    // Update the form
    form.setValue(`service_requests.${index}.price`, priceInReais);
  };

  return (
    <div className="space-y-6">
      <div>
        <FormLabel>Serviços Necessários</FormLabel>
        <p className="text-sm text-muted-foreground mb-4">
          Adicione os serviços que você precisa para o seu evento
        </p>
      </div>
      
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col space-y-4 p-4 border rounded-md bg-muted/30">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Serviço {index + 1}</h4>
            {fields.length > 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => remove(index)}
                className="h-8 w-8 p-0"
              >
                <Trash2 size={16} className="text-destructive" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`service_requests.${index}.category`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`service_requests.${index}.count`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="w-full md:w-1/2">
            <FormField
              control={form.control}
              name={`service_requests.${index}.price`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={field.value ? formatCurrency(Number(field.value)).replace('R$', '').trim() : ''}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      placeholder="0,00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
      
      {/* The "Add Service" button is always positioned after the list */}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ category: '', count: 1, price: 0 })}
        className="mt-2 w-full"
      >
        <PlusCircle size={16} className="mr-2" />
        Adicionar Serviço
      </Button>
    </div>
  );
};
