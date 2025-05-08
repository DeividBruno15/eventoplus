
import { Star, Users } from "lucide-react";

interface VenueHeaderProps {
  title: string;
  venueType: string;
  maxCapacity: number;
  isRentable: boolean;
  views: number;
}

export const VenueHeader = ({
  title,
  venueType,
  maxCapacity,
  isRentable,
  views
}: VenueHeaderProps) => {
  // Map venue type to display value
  const venueTypeDisplay = 
    venueType === 'party_hall' ? 'Salão de Festas' :
    venueType === 'wedding_venue' ? 'Espaço para Casamentos' :
    venueType === 'corporate_space' ? 'Espaço Corporativo' :
    venueType === 'studio' ? 'Estúdio' :
    venueType === 'restaurant' ? 'Restaurante' :
    venueType === 'beach_club' ? 'Beach Club' :
    venueType === 'farm' ? 'Fazenda/Sítio' :
    venueType === 'mansion' ? 'Casa/Mansão' :
    venueType === 'sports_venue' ? 'Espaço Esportivo' :
    venueType === 'garden' ? 'Jardim/Área Externa' :
    'Outro';
    
  return (
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
          {venueTypeDisplay}
        </span>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Capacidade para {maxCapacity} pessoas</span>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="h-4 w-4" />
          <span>{views} {views === 1 ? 'visualização' : 'visualizações'}</span>
        </div>
        
        {!isRentable && (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-sm">
            Não disponível para reserva
          </span>
        )}
      </div>
    </div>
  );
};
