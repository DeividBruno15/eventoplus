
import { cn } from '@/lib/utils';

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
        'border rounded-lg p-4 cursor-pointer transition-colors',
        selected ? 'bg-primary/5 border-primary' : 'border-gray-200 hover:bg-gray-50'
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">{titles[role]}</h3>
        {selected && (
          <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
            Selecionado
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{descriptions[role]}</p>
    </div>
  );
};
