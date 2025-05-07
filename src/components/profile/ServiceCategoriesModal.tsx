
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import { useAuth } from '@/hooks/useAuth';

interface ServiceCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ServiceCategoriesModal = ({ isOpen, onClose, onSuccess }: ServiceCategoriesModalProps) => {
  const [loading, setLoading] = useState(false);
  const { categories, isLoading } = useServiceCategories();
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
      
      // Insert new services
      if (selectedCategories.length > 0) {
        // Include description field with empty string value
        const servicesToInsert = selectedCategories.map(category => ({
          provider_id: user?.id,
          category,
          description: '' // Add empty description field
        }));
        
        console.log('Services to insert:', servicesToInsert);
        
        const { data, error } = await supabase
          .from('provider_services')
          .insert(servicesToInsert)
          .select();
        
        if (error) {
          console.error('Error inserting services:', error);
          throw error;
        }
        
        console.log('Successfully inserted services:', data);
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Selecione suas categorias de serviço</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground mb-2">
              Selecione até 3 categorias de serviços que você oferece:
            </p>
            
            {isLoading ? (
              <div className="py-4 text-center">Carregando categorias...</div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.name}`}
                      checked={selectedCategories.includes(category.name)}
                      onCheckedChange={() => handleCategoryToggle(category.name)}
                      disabled={
                        !selectedCategories.includes(category.name) && 
                        selectedCategories.length >= 3
                      }
                    />
                    <Label 
                      htmlFor={`category-${category.name}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-4">
              <strong>Nota:</strong> Você pode selecionar no máximo 3 categorias.
            </p>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || selectedCategories.length === 0}>
              {loading ? "Salvando..." : "Salvar categorias"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
