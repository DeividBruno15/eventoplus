
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface RoleCardProps {
  role: 'contractor' | 'provider';
  selected: boolean;
  onClick: () => void;
}

export const RoleCard = ({ role, selected, onClick }: RoleCardProps) => {
  const titles = {
    contractor: 'Contratante',
    provider: 'Prestador de Serviços'
  };

  const descriptions = {
    contractor: 'Estou procurando profissionais para organizar meus eventos',
    provider: 'Ofereço serviços e quero ser encontrado por potenciais clientes'
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'border rounded-lg p-6 cursor-pointer transition-colors relative',
        selected ? 'bg-primary/5 border-primary' : 'border-gray-200 hover:bg-gray-50'
      )}
    >
      <div className="flex flex-col space-y-2">
        <h3 className="font-semibold text-lg">{titles[role]}</h3>
        <p className="text-sm text-muted-foreground">{descriptions[role]}</p>
      </div>
      
      {selected && (
        <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1">
          <Check className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};
