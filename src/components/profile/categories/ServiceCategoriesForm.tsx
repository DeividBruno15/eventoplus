
import { Button } from '@/components/ui/button';
import { CategorySelectionList } from './CategorySelectionList';
import { useServiceCategories } from '@/hooks/useServiceCategories';

interface ServiceCategoriesFormProps {
  selectedCategories: string[];
  onToggle: (category: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  onCancel: () => void;
}

export const ServiceCategoriesForm = ({
  selectedCategories,
  onToggle,
  onSubmit,
  loading,
  onCancel
}: ServiceCategoriesFormProps) => {
  const { categories, isLoading } = useServiceCategories();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground mb-2">
          Selecione até 3 categorias de serviços que você oferece:
        </p>
        
        <CategorySelectionList 
          categories={categories}
          selectedCategories={selectedCategories}
          onToggle={onToggle}
          isLoading={isLoading}
        />
        
        <p className="text-xs text-muted-foreground mt-4">
          <strong>Nota:</strong> Você pode selecionar no máximo 3 categorias.
        </p>
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || selectedCategories.length === 0}>
          {loading ? "Salvando..." : "Salvar categorias"}
        </Button>
      </div>
    </form>
  );
};
