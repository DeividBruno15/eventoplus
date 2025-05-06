
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { venueTypes, ratingOptions, sortingOptions } from "../constants/venueFiltersConstants";

export interface FiltersState {
  searchQuery: string;
  venueType: string | undefined;
  minRating: string | undefined; 
  priceRange: [number, number];
  sortBy: string;
}

interface VenueFiltersProps {
  filters: FiltersState;
  onFilterChange: (filters: FiltersState) => void;
  resultsCount: number;
}

const VenueFilters = ({ filters, onFilterChange, resultsCount }: VenueFiltersProps) => {
  const [activeFilters, setActiveFilters] = useState(0);
  
  // Update a single filter and propagate changes
  const updateFilter = <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  // Reset all filters
  const resetFilters = () => {
    onFilterChange({
      searchQuery: "",
      venueType: undefined,
      minRating: undefined,
      priceRange: [0, 10000],
      sortBy: "newest"
    });
  };
  
  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.venueType !== undefined) count++;
    if (filters.minRating !== undefined) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
    if (filters.searchQuery) count++;
    setActiveFilters(count);
  }, [filters]);

  return (
    <div className="space-y-4">
      {/* Barra de busca e filtros em linha */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Barra de busca */}
        <div className="relative w-64 flex-shrink">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar locais..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter("searchQuery", e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        
        {/* Filtro de tipo de local */}
        <Select 
          value={filters.venueType} 
          onValueChange={(value) => updateFilter("venueType", value)}
        >
          <SelectTrigger className="w-[160px] h-9 text-start">
            <SelectValue placeholder="Tipo de local" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined}>Todos os tipos</SelectItem>
            {venueTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Filtro de avaliação como dropdown */}
        <Select 
          value={filters.minRating} 
          onValueChange={(value) => updateFilter("minRating", value)}
        >
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Avaliação" />
          </SelectTrigger>
          <SelectContent>
            {/* Removed the "Qualquer nota" item */}
            {ratingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Filtros de preço - versão compacta */}
        <div className="flex items-center gap-2 p-2 border rounded-md bg-background">
          <span className="text-sm font-medium whitespace-nowrap">Preço: R${filters.priceRange[0]}-R${filters.priceRange[1]}</span>
          <div className="w-32">
            <Slider
              value={filters.priceRange}
              min={0}
              max={10000}
              step={100}
              onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
            />
          </div>
        </div>
        
        {/* Ordenação */}
        <Select 
          value={filters.sortBy}
          onValueChange={(value) => updateFilter("sortBy", value)}
        >
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            {sortingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Botão de limpar filtros */}
        {activeFilters > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetFilters}
            className="whitespace-nowrap"
          >
            Limpar filtros
            <Badge variant="secondary" className="ml-2">
              {activeFilters}
            </Badge>
          </Button>
        )}
      </div>
      
      {/* Estatísticas de resultados */}
      <div className="text-sm text-muted-foreground">
        {resultsCount} {resultsCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}
      </div>
    </div>
  );
};

export default VenueFilters;
