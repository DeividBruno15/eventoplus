
import { Loader2 } from 'lucide-react';
import { UserCompany } from '@/types/companies';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

interface DeleteCompanyDialogProps {
  company: UserCompany | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  submitting: boolean;
}

export const DeleteCompanyDialog = ({ 
  company, 
  isOpen, 
  onClose, 
  onConfirm, 
  submitting 
}: DeleteCompanyDialogProps) => {
  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={onClose}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a empresa "{company?.name}"?
            <br/>
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={submitting}
            className="bg-red-500 hover:bg-red-600"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Sim, excluir'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
