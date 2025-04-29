
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CompanyForm, CompanyFormValues } from './CompanyForm';
import { UserCompany } from '@/types/companies';
import { useAuth } from '@/hooks/useAuth';

interface CompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingCompany: UserCompany | null;
  onSubmit: (company: UserCompany | Omit<UserCompany, 'id' | 'created_at'>) => Promise<boolean>;
  submitting: boolean;
}

export const CompanyDialog = ({ 
  isOpen, 
  onClose, 
  editingCompany, 
  onSubmit,
  submitting 
}: CompanyDialogProps) => {
  const { user } = useAuth();

  const handleSubmit = async (values: CompanyFormValues) => {
    if (!user) return;

    const companyData: Omit<UserCompany, 'id' | 'created_at'> = {
      user_id: user.id,
      name: values.name,
      zipcode: values.zipcode,
      street: values.street,
      number: values.number,
      neighborhood: values.neighborhood,
      city: values.city,
      state: values.state
    };

    const success = await onSubmit(
      editingCompany 
        ? { ...companyData, id: editingCompany.id, created_at: editingCompany.created_at }
        : companyData
    );
    
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingCompany ? 'Editar Empresa' : 'Adicionar Empresa'}
          </DialogTitle>
        </DialogHeader>
        
        <CompanyForm
          editingCompany={editingCompany}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitting={submitting}
        />
      </DialogContent>
    </Dialog>
  );
};
