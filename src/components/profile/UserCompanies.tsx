
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { UserCompany } from '@/types/companies';
import { useCompanies } from '@/hooks/useCompanies';
import { CompanyItem } from './CompanyItem';
import { CompanyDialog } from './CompanyDialog';
import { DeleteCompanyDialog } from './DeleteCompanyDialog';

export const UserCompanies = () => {
  const { companies, loading, submitting, addCompany, updateCompany, deleteCompany } = useCompanies();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<UserCompany | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<UserCompany | null>(null);
  
  const openDialog = () => {
    setEditingCompany(null);
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCompany(null);
  };
  
  const handleEditCompany = (company: UserCompany) => {
    setEditingCompany(company);
    setIsDialogOpen(true);
  };
  
  const handleDeleteClick = (company: UserCompany) => {
    setCompanyToDelete(company);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;
    
    await deleteCompany(companyToDelete.id);
    setIsDeleteDialogOpen(false);
    setCompanyToDelete(null);
  };
  
  const handleCompanySubmit = async (company: UserCompany | Omit<UserCompany, 'id' | 'created_at'>) => {
    if ('id' in company) {
      return updateCompany(company.id, {
        user_id: company.user_id,
        name: company.name,
        zipcode: company.zipcode,
        street: company.street,
        number: company.number,
        neighborhood: company.neighborhood,
        city: company.city,
        state: company.state
      });
    } else {
      return addCompany(company);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium">Minhas Empresas</h3>
          <Button onClick={openDialog} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Empresa
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Você ainda não tem empresas cadastradas.</p>
            <p className="text-sm mt-2">
              Adicione empresas para facilitar a criação de eventos.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {companies.map((company) => (
              <CompanyItem
                key={company.id}
                company={company}
                onEdit={handleEditCompany}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Add/Edit Company Dialog */}
      <CompanyDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        editingCompany={editingCompany}
        onSubmit={handleCompanySubmit}
        submitting={submitting}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteCompanyDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        company={companyToDelete}
        onConfirm={handleDeleteConfirm}
        submitting={submitting}
      />
    </div>
  );
};
