
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { ServiceCategoriesForm } from './ServiceCategoriesForm';
import { useServiceCategoriesSelection } from '@/hooks/profile/useServiceCategoriesSelection';

interface ServiceCategoriesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ServiceCategoriesDialog = ({ isOpen, onClose, onSuccess }: ServiceCategoriesDialogProps) => {
  const { 
    loading, 
    selectedCategories, 
    handleCategoryToggle, 
    handleSubmit 
  } = useServiceCategoriesSelection(isOpen, onClose, onSuccess);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Selecione suas categorias de serviço</DialogTitle>
        </DialogHeader>
        
        <ServiceCategoriesForm
          selectedCategories={selectedCategories}
          onToggle={handleCategoryToggle}
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
