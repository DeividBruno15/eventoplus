
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVenueAnnouncements } from "./hooks/useVenueAnnouncements";
import VenueCard from "./components/VenueCard";
import VenueLoadingSkeleton from "./components/VenueLoadingSkeleton";
import VenueEmptyState from "./components/VenueEmptyState";
import { useAuth } from "@/hooks/auth";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VenuesPage = () => {
  const navigate = useNavigate();
  const { announcements, loading } = useVenueAnnouncements();
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role;
  const isAdvertiser = userRole === 'advertiser';

  // Estado para os filtros e busca
  const [searchQuery, setSearchQuery] = useState("");
  const [venueType, setVenueType] = useState<string | undefined>(undefined);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [activeFilters, setActiveFilters] = useState(0);

  // Tipos de locais de eventos
  const venueTypes = [
    "Salão de Festas",
    "Chácara",
    "Buffet",
    "Casa de Show",
    "Hotel",
    "Espaço para Workshop",
    "Área Externa",
    "Restaurante",
    "Sítio",
    "Outro"
  ];

  // Filtragem dos anúncios
  const filteredAnnouncements = announcements.filter(announcement => {
    // Filtro de busca
    const matchesSearch = searchQuery === "" || 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.venue_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtro de tipo
    const matchesType = venueType === undefined || 
      announcement.venue_type === venueType;
    
    // Filtro de preço
    const matchesPrice = announcement.price_per_hour >= priceRange[0] && 
      announcement.price_per_hour <= priceRange[1];

    // Retorna verdadeiro se todos os filtros corresponderem
    return matchesSearch && matchesType && matchesPrice;
  });

  // Reset all filters
  const resetFilters = () => {
    setVenueType(undefined);
    setMinRating(0);
    setPriceRange([0, 10000]);
    setSearchQuery("");
    setActiveFilters(0);
  };
  
  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (venueType !== undefined) count++;
    if (minRating > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < 10000) count++;
    setActiveFilters(count);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {isAdvertiser ? "Meus Anúncios" : "Locais de Eventos"}
          </h2>
          <p className="text-muted-foreground">
            {isAdvertiser 
              ? "Gerencie os anúncios dos seus espaços para eventos"
              : "Encontre os melhores locais para seus eventos"
            }
          </p>
        </div>
        {isAdvertiser && (
          <Button 
            onClick={() => navigate('/venues/create')}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Criar Anúncio
          </Button>
        )}
      </div>

      {!isAdvertiser && (
        <div className="space-y-4">
          {/* Barra de busca e filtros em linha */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Barra de busca mais compacta */}
            <div className="relative w-full sm:w-64 flex-shrink">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar locais..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            
            {/* Filtro de tipo de local */}
            <Select value={venueType} onValueChange={setVenueType}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Tipo de local" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined}>Todos os tipos</SelectItem>
                {venueTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Filtros de preço - agora visíveis diretamente na página */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 border rounded-md bg-background flex-grow">
              <span className="text-sm font-medium whitespace-nowrap">Preço: R$ {priceRange[0]} - R$ {priceRange[1]}</span>
              <div className="w-full sm:w-52 mx-2">
                <Slider
                  value={priceRange}
                  min={0}
                  max={10000}
                  step={100}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                />
              </div>
            </div>
            
            {/* Filtro de avaliação mínima */}
            <div className="flex items-center gap-2 p-2 border rounded-md">
              <span className="text-sm font-medium">Avaliação:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    className={`w-6 h-6 flex items-center justify-center rounded ${
                      rating <= minRating ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}
                    onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Botão de limpar filtros */}
            {(searchQuery || venueType || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetFilters}
                className="whitespace-nowrap"
              >
                Limpar filtros
                {activeFilters > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilters}
                  </Badge>
                )}
              </Button>
            )}
          </div>
          
          {/* Estatísticas de resultados */}
          <div className="text-sm text-muted-foreground">
            {filteredAnnouncements.length} {filteredAnnouncements.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </div>
        </div>
      )}

      {loading ? (
        <VenueLoadingSkeleton />
      ) : filteredAnnouncements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnouncements.map((announcement) => (
            <VenueCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      ) : (
        <VenueEmptyState />
      )}
    </div>
  );
};

export default VenuesPage;
