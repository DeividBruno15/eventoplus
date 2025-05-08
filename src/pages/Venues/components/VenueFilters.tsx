
import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import VenueLocationFilter from "./VenueLocationFilter";

// Venue types options
const VENUE_TYPES = [
  { id: "party_hall", label: "Salão de Festas" },
  { id: "wedding_venue", label: "Espaço para Casamentos" },
  { id: "corporate_space", label: "Espaço Corporativo" },
  { id: "studio", label: "Estúdio" },
  { id: "restaurant", label: "Restaurante" },
  { id: "beach_club", label: "Beach Club" },
  { id: "farm", label: "Fazenda/Sítio" },
  { id: "mansion", label: "Casa/Mansão" },
  { id: "sports_venue", label: "Espaço Esportivo" },
  { id: "garden", label: "Jardim/Área Externa" },
  { id: "other", label: "Outro" },
];

// Rating options
const RATING_OPTIONS = [
  { value: "4.5", label: "4,5+" },
  { value: "4", label: "4,0+" },
  { value: "3.5", label: "3,5+" },
  { value: "3", label: "3,0+" },
];

// Sort options
const SORT_OPTIONS = [
  { value: "newest", label: "Mais recentes" },
  { value: "priceAsc", label: "Menor preço" },
  { value: "priceDesc", label: "Maior preço" },
  { value: "ratingDesc", label: "Melhor avaliação" },
];

export interface FiltersState {
  searchQuery: string;
  venueType: string | undefined;
  minRating: string | undefined;
  priceRange: [number, number];
  sortBy: string;
  location?: {
    city?: string;
    state?: string;
    zipcode?: string;
  };
  maxDistance: number;
}

interface VenueFiltersProps {
  filters: FiltersState;
  onFilterChange: (newFilters: FiltersState) => void;
  resultsCount: number;
}

const VenueFilters: React.FC<VenueFiltersProps> = ({ 
  filters, 
  onFilterChange,
  resultsCount
}) => {
  const { isDesktop } = useBreakpoint('md');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FiltersState>(filters);
  
  // Reset local filters when main filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, searchQuery: e.target.value };
    onFilterChange(newFilters);
  };
  
  const handleSortChange = (value: string) => {
    const newFilters = { ...filters, sortBy: value };
    onFilterChange(newFilters);
  };
  
  const handleFilterChange = (field: keyof FiltersState, value: any) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (location: FiltersState['location']) => {
    setLocalFilters(prev => ({ ...prev, location }));
  };
  
  const handleMaxDistanceChange = (distance: number) => {
    setLocalFilters(prev => ({ ...prev, maxDistance: distance }));
  };
  
  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsDrawerOpen(false);
  };
  
  const resetFilters = () => {
    const resetFiltersState: FiltersState = {
      searchQuery: filters.searchQuery, // Keep search query
      venueType: undefined,
      minRating: undefined,
      priceRange: [0, 10000],
      sortBy: "newest",
      location: undefined,
      maxDistance: 50
    };
    
    setLocalFilters(resetFiltersState);
    onFilterChange(resetFiltersState);
    setIsDrawerOpen(false);
  };
  
  // Format price display
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };
  
  const filtersCount = (
    (filters.venueType ? 1 : 0) + 
    (filters.minRating ? 1 : 0) + 
    (filters.location?.city || filters.location?.state || filters.location?.zipcode ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0)
  );
  
  const FiltersContent = () => (
    <>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Tipo de Espaço</h4>
          <Select 
            value={localFilters.venueType}
            onValueChange={(value) => handleFilterChange('venueType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {VENUE_TYPES.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Avaliação mínima</h4>
          <Select 
            value={localFilters.minRating}
            onValueChange={(value) => handleFilterChange('minRating', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Qualquer avaliação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Qualquer avaliação</SelectItem>
              {RATING_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="font-medium mb-2">Localização</h4>
          <VenueLocationFilter 
            location={localFilters.location}
            maxDistance={localFilters.maxDistance}
            onLocationChange={handleLocationChange}
            onMaxDistanceChange={handleMaxDistanceChange}
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Faixa de preço</h4>
            <div className="text-sm">
              {formatPrice(localFilters.priceRange[0])} - {formatPrice(localFilters.priceRange[1])}
            </div>
          </div>
          <Slider
            defaultValue={localFilters.priceRange}
            min={0}
            max={10000}
            step={100}
            value={localFilters.priceRange}
            onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
          />
        </div>
      </div>
    </>
  );
  
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar espaços..."
            className="pl-9 pr-4"
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {isDesktop ? (
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : null}
          
          {isDesktop ? (
            <div className="border p-4 rounded-md flex-1 hidden md:block">
              <h3 className="font-medium mb-4">Filtros</h3>
              <FiltersContent />
              
              <div className="mt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetFilters}
                >
                  Limpar filtros
                </Button>
                <Button 
                  size="sm"
                  onClick={applyFilters}
                >
                  Aplicar
                </Button>
              </div>
            </div>
          ) : (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" className="relative">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtros
                  {filtersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {filtersCount}
                    </span>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Filtros</DrawerTitle>
                    <DrawerDescription>
                      Encontre o espaço perfeito para seu evento
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4">
                    <FiltersContent />
                    
                    <Separator className="my-4" />
                    
                    <h4 className="font-medium mb-2">Ordenar por</h4>
                    <Select value={filters.sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {SORT_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <DrawerFooter>
                    <Button onClick={applyFilters}>Aplicar filtros</Button>
                    <DrawerClose asChild>
                      <Button variant="outline" onClick={resetFilters}>
                        Limpar filtros
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>
      
      {/* Results count */}
      <div className="mt-4 text-sm text-muted-foreground">
        {resultsCount} {resultsCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}
      </div>
    </div>
  );
};

export default VenueFilters;
