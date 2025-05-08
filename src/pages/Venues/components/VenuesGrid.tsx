
import { VenueAnnouncement } from "../types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VenuesGridProps {
  announcements: VenueAnnouncement[];
  loading: boolean;
  onDeleteAnnouncement?: (id: string) => void;
}

const VenuesGrid: React.FC<VenuesGridProps> = ({
  announcements,
  loading,
  onDeleteAnnouncement,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Nenhum espaço encontrado</h3>
        <p className="text-muted-foreground mb-6">
          Não foram encontrados espaços com os filtros selecionados.
        </p>
        <Button
          onClick={() => navigate("/venues/create")}
          className="mx-auto"
        >
          Anunciar meu espaço
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {announcements.map((announcement) => {
        const createdDate = new Date(announcement.created_at);
        
        return (
          <Card key={announcement.id} className="overflow-hidden flex flex-col">
            <div 
              className="relative h-48 bg-cover bg-center cursor-pointer"
              style={{ 
                backgroundImage: announcement.image_url ? 
                  `url(${announcement.image_url})` : 
                  'url(/placeholder.jpg)'
              }}
              onClick={() => navigate(`/venues/details/${announcement.id}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60" />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-white text-gray-800">
                  {announcement.venue_type === 'party_hall' ? 'Salão de Festas' :
                   announcement.venue_type === 'wedding_venue' ? 'Espaço para Casamentos' :
                   announcement.venue_type === 'corporate_space' ? 'Espaço Corporativo' :
                   announcement.venue_type === 'studio' ? 'Estúdio' :
                   announcement.venue_type === 'restaurant' ? 'Restaurante' :
                   announcement.venue_type === 'beach_club' ? 'Beach Club' :
                   announcement.venue_type === 'farm' ? 'Fazenda/Sítio' :
                   announcement.venue_type === 'mansion' ? 'Casa/Mansão' :
                   announcement.venue_type === 'sports_venue' ? 'Espaço Esportivo' :
                   announcement.venue_type === 'garden' ? 'Jardim/Área Externa' :
                   'Outro'}
                </Badge>
              </div>
              <div className="absolute bottom-2 right-2">
                {announcement.rating !== undefined && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    ★ {announcement.rating.toFixed(1)}
                  </Badge>
                )}
              </div>
            </div>
            
            <CardContent className="p-4 flex-1">
              <h3 
                className="font-semibold text-lg mb-1 line-clamp-1 hover:text-primary cursor-pointer"
                onClick={() => navigate(`/venues/details/${announcement.id}`)}
              >
                {announcement.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {announcement.venue_name}
              </p>
              
              <div className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                <MapPin className="h-3 w-3" />
                <span>{announcement.address || "Localização não especificada"}</span>
              </div>
              
              <div className="mt-3 text-lg font-semibold">
                R$ {announcement.price_per_hour.toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground ml-1">/dia</span>
              </div>
            </CardContent>
            
            <CardFooter className="p-4 pt-0 flex justify-between border-t mt-auto">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {format(createdDate, "d 'de' MMM", { locale: ptBR })}
                </span>
              </div>
              <Button
                variant="ghost" 
                size="sm"
                onClick={() => navigate(`/venues/details/${announcement.id}`)}
              >
                Ver detalhes
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default VenuesGrid;
