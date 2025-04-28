
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
import { useToast } from '@/components/ui/use-toast';
import { useServiceCategories } from '@/hooks/useServiceCategories';

interface ServiceCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  userServices: string[];
  onServicesUpdate: () => void;
}

export const ServiceCategoriesModal = ({ 
  isOpen, 
  onClose, 
  userData, 
  userServices, 
  onServicesUpdate 
}: ServiceCategoriesModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { categories, isLoading } = useServiceCategories();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(userServices || []);
  
  useEffect(() => {
    setSelectedCategories(userServices || []);
  }, [userServices, isOpen]);
  
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
      toast({
        title: "Limite excedido",
        description: "Você pode selecionar no máximo 3 categorias de serviços.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    try {
      // Delete existing services
      await supabase
        .from('provider_services')
        .delete()
        .eq('provider_id', userData.id);
      
      // Insert new services
      if (selectedCategories.length > 0) {
        const servicesToInsert = selectedCategories.map(category => ({
          provider_id: userData.id,
          category,
          description: ''
        }));
        
        const { error } = await supabase
          .from('provider_services')
          .insert(servicesToInsert);
        
        if (error) throw error;
      }
      
      toast({
        title: "Serviços atualizados",
        description: "Suas categorias de serviço foram atualizadas com sucesso."
      });
      
      onServicesUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar serviços",
        description: error.message,
        variant: "destructive"
      });
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
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                      disabled={
                        !selectedCategories.includes(category) && 
                        selectedCategories.length >= 3
                      }
                    />
                    <Label 
                      htmlFor={`category-${category}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category}
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
