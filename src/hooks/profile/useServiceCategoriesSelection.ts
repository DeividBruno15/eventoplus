
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useServiceCategoriesSelection = (
  isOpen: boolean, 
  onClose: () => void,
  onSuccess: () => void
) => {
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { user } = useAuth();
  
  // Fetch user's current service categories when modal opens
  useEffect(() => {
    if (isOpen && user) {
      fetchUserServices();
    }
  }, [isOpen, user]);
  
  const fetchUserServices = async () => {
    try {
      console.log('Fetching user services for user ID:', user?.id);
      const { data, error } = await supabase
        .from('provider_services')
        .select('category')
        .eq('provider_id', user?.id);
      
      if (error) {
        console.error('Error fetching user services:', error);
        throw error;
      }
      
      console.log('Current user services:', data);
      const userCategories = data.map(item => item.category);
      setSelectedCategories(userCategories);
    } catch (error) {
      console.error('Error fetching user services:', error);
      toast.error('Erro ao carregar categorias do usuário');
    }
  };
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (selectedCategories.length > 3) {
      toast.error('Você pode selecionar no máximo 3 categorias de serviços');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Current user:', user);
      console.log('Selected categories:', selectedCategories);
      
      // Delete existing services
      const { error: deleteError } = await supabase
        .from('provider_services')
        .delete()
        .eq('provider_id', user?.id);
        
      if (deleteError) {
        console.error('Error deleting existing services:', deleteError);
        throw deleteError;
      }
      
      console.log('Successfully deleted existing services');
      
      // Insert new services one by one to avoid batch insert issues
      if (selectedCategories.length > 0) {
        for (const category of selectedCategories) {
          const { error } = await supabase
            .from('provider_services')
            .insert({
              provider_id: user?.id,
              category: category,
              description: '' // Add empty description field
            });
          
          if (error) {
            console.error(`Error inserting service ${category}:`, error);
            throw error;
          }
          
          console.log(`Successfully inserted service ${category}`);
        }
      }
      
      toast.success('Categorias de serviço atualizadas');
      onSuccess();
    } catch (error: any) {
      console.error('Full error object:', error);
      toast.error(`Erro ao atualizar categorias: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    selectedCategories,
    handleCategoryToggle,
    handleSubmit
  };
};
