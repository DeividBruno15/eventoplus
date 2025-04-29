
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { UserCompany } from '@/types/companies';

interface CompanyItemProps {
  company: UserCompany;
  onEdit: (company: UserCompany) => void;
  onDelete: (company: UserCompany) => void;
}

export const CompanyItem = ({ company, onEdit, onDelete }: CompanyItemProps) => {
  return (
    <div 
      key={company.id} 
      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{company.name}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {company.street}, {company.number} - {company.neighborhood}
          </p>
          <p className="text-sm text-muted-foreground">
            {company.city}, {company.state} - CEP {company.zipcode}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => onEdit(company)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(company)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
