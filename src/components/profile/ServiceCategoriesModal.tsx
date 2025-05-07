
import { ServiceCategoriesDialog } from './categories/ServiceCategoriesDialog';

interface ServiceCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ServiceCategoriesModal = (props: ServiceCategoriesModalProps) => {
  return <ServiceCategoriesDialog {...props} />;
};
