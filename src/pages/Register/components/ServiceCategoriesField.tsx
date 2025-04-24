
import { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { Check, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ServiceCategoriesFieldProps {
  form: UseFormReturn<RegisterFormData>;
}

interface ServiceCategory {
  id: string;
  name: string;
}

export const ServiceCategoriesField = ({ form }: ServiceCategoriesFieldProps) => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const MAX_SELECTIONS = 3;

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

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      if (selectedCategories.length < MAX_SELECTIONS) {
        setSelectedCategories([...selectedCategories, categoryId]);
      }
    }
  };

  useEffect(() => {
    // Update the form value whenever selected categories change
    form.setValue('service_categories', selectedCategories);
  }, [selectedCategories, form]);

  if (loading) {
    return <div>Carregando categorias...</div>;
  }

  return (
    <FormField
      control={form.control}
      name="service_categories"
      render={() => (
        <FormItem>
          <FormLabel>Categorias de serviços (selecione até 3)</FormLabel>
          <FormControl>
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategories.length > 0 ? (
                  selectedCategories.map(categoryId => {
                    const category = categories.find(c => c.id === categoryId);
                    return (
                      <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                        {category?.name}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => toggleCategory(categoryId)}
                        />
                      </Badge>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma categoria selecionada</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    type="button"
                    size="sm"
                    variant={selectedCategories.includes(category.id) ? "secondary" : "outline"}
                    className="justify-start"
                    onClick={() => toggleCategory(category.id)}
                    disabled={!selectedCategories.includes(category.id) && selectedCategories.length >= MAX_SELECTIONS}
                  >
                    {selectedCategories.includes(category.id) ? (
                      <Check className="mr-1 h-4 w-4" />
                    ) : (
                      <Plus className="mr-1 h-4 w-4" />
                    )}
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
