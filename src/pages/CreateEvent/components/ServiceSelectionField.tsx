
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { CreateEventFormData } from '../schema';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface ServiceCategory {
  id: string;
  name: string;
}

interface ServiceSelectionFieldProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const ServiceSelectionField = ({ form }: ServiceSelectionFieldProps) => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const serviceRequests = form.watch('service_requests') || [];

  useEffect(() => {
    async function fetchCategories() {
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
    }

    fetchCategories();
  }, []);

  const addServiceRequest = () => {
    const currentServices = form.getValues('service_requests') || [];
    form.setValue('service_requests', [...currentServices, { category: '', count: 1 }]);
  };

  const removeServiceRequest = (index: number) => {
    const currentServices = form.getValues('service_requests') || [];
    form.setValue('service_requests', 
      currentServices.filter((_, i) => i !== index)
    );
  };

  const updateServiceRequest = (index: number, field: 'category' | 'count', value: string | number) => {
    const currentServices = [...(form.getValues('service_requests') || [])];
    currentServices[index] = {
      ...currentServices[index],
      [field]: field === 'count' ? Number(value) : value
    };
    form.setValue('service_requests', currentServices);
  };

  if (loading) {
    return <div>Carregando categorias de serviço...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Serviços Necessários</Label>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={addServiceRequest}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Adicionar Serviço
        </Button>
      </div>

      {serviceRequests.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Adicione os serviços que você precisa para este evento.
        </p>
      ) : (
        <div className="space-y-3">
          {serviceRequests.map((service, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-grow">
                <Select
                  value={service.category}
                  onValueChange={(value) => updateServiceRequest(index, 'category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-28">
                <div className="flex items-center">
                  <Button 
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      const currentCount = service.count || 1;
                      if (currentCount > 1) {
                        updateServiceRequest(index, 'count', currentCount - 1);
                      }
                    }}
                    className="h-8 w-8 rounded-r-none"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    value={service.count || 1}
                    onChange={(e) => updateServiceRequest(index, 'count', parseInt(e.target.value) || 1)}
                    className="h-8 rounded-none text-center w-12"
                  />
                  <Button 
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      const currentCount = service.count || 1;
                      updateServiceRequest(index, 'count', currentCount + 1);
                    }}
                    className="h-8 w-8 rounded-l-none"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <Button 
                type="button"
                size="icon"
                variant="outline"
                onClick={() => removeServiceRequest(index)}
                className="h-8 w-8"
              >
                <Minus className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
