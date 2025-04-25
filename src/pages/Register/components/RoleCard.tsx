
import { Check, User, Briefcase } from 'lucide-react';

interface RoleCardProps {
  role: 'contractor' | 'provider';
  selected: boolean;
  onClick: () => void;
}

export const RoleCard = ({ role, selected, onClick }: RoleCardProps) => {
  const title = role === 'contractor' ? 'Contratante' : 'Prestador';
  const description = role === 'contractor' 
    ? 'Quero contratar serviços para meus eventos' 
    : 'Quero oferecer meus serviços para eventos';

  return (
    <div 
      className={`
        relative border rounded-lg p-6 cursor-pointer transition-all 
        ${selected 
          ? 'border-primary bg-primary/5 shadow-sm' 
          : 'border-muted hover:border-primary/50'
        }
      `}
      onClick={onClick}
    >
      {selected && (
        <div className="absolute top-3 right-3 text-primary">
          <Check className="h-5 w-5" />
        </div>
      )}
      
      <div className="flex flex-col items-center text-center gap-4">
        <div className="text-4xl text-primary">
          {role === 'contractor' ? (
            <User className="h-12 w-12" />
          ) : (
            <Briefcase className="h-12 w-12" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};
