
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CategorySelectionListProps {
  categories: { name: string }[];
  selectedCategories: string[];
  onToggle: (category: string) => void;
  isLoading: boolean;
}

export const CategorySelectionList = ({ 
  categories, 
  selectedCategories, 
  onToggle, 
  isLoading 
}: CategorySelectionListProps) => {
  if (isLoading) {
    return <div className="py-4 text-center">Carregando categorias...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {categories.map((category) => (
        <div key={category.name} className="flex items-center space-x-2">
          <Checkbox 
            id={`category-${category.name}`}
            checked={selectedCategories.includes(category.name)}
            onCheckedChange={() => onToggle(category.name)}
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
  );
};
