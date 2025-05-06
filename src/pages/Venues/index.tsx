
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVenueAnnouncements } from "./hooks/useVenueAnnouncements";
import VenueCard from "./components/VenueCard";
import VenueLoadingSkeleton from "./components/VenueLoadingSkeleton";
import VenueEmptyState from "./components/VenueEmptyState";
import { useAuth } from "@/hooks/auth";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Barra de busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar locais de eventos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {/* Filtros */}
          <div className="flex items-center gap-2">
            {/* Filtro de tipo de local */}
            <Select value={venueType} onValueChange={setVenueType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de local" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined}>Todos os tipos</SelectItem>
                {venueTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Filtro de preço */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Faixa de preço</h4>
                  <div className="space-y-2">
                    <Slider
                      defaultValue={[0, 10000]}
                      max={10000}
                      step={100}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                    />
                    <div className="flex justify-between">
                      <span>R$ {priceRange[0]}</span>
                      <span>R$ {priceRange[1]}</span>
                    </div>
                  </div>
                  
                  <h4 className="font-medium">Avaliação mínima</h4>
                  <div className="space-y-2">
                    <Slider
                      defaultValue={[0]}
                      max={5}
                      step={1}
                      value={[minRating]}
                      onValueChange={([value]) => setMinRating(value)}
                    />
                    <div className="flex justify-between">
                      <span>{minRating} estrelas ou mais</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setVenueType(undefined);
                        setMinRating(0);
                        setPriceRange([0, 10000]);
                        setSearchQuery("");
                      }}
                    >
                      Limpar filtros
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
