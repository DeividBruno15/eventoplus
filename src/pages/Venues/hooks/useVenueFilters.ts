
import { useState, useMemo } from "react";
import { VenueAnnouncement } from "../types";
import { FiltersState } from "../components/VenueFilters";

export const useVenueFilters = (announcements: VenueAnnouncement[]) => {
  const [filters, setFilters] = useState<FiltersState>({
    searchQuery: "",
    venueType: undefined,
    minRating: undefined,
    priceRange: [0, 10000]
  });

  // Filtered announcements based on current filters
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(announcement => {
      // Filtro de busca
      const matchesSearch = filters.searchQuery === "" || 
        announcement.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        announcement.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        announcement.venue_name.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      // Filtro de tipo
      const matchesType = filters.venueType === undefined || 
        announcement.venue_type === filters.venueType;
      
      // Filtro de preço
      const matchesPrice = announcement.price_per_hour >= filters.priceRange[0] && 
        announcement.price_per_hour <= filters.priceRange[1];
        
      // Filtro de avaliação - lidando com rating nulo ou indefinido
      const matchesRating = filters.minRating === undefined || 
        (announcement.rating !== undefined && 
         announcement.rating !== null && 
         announcement.rating >= parseFloat(filters.minRating));

      // Retorna verdadeiro se todos os filtros corresponderem
      return matchesSearch && matchesType && matchesPrice && matchesRating;
    });
  }, [announcements, filters]);

  return {
    filters,
    setFilters,
    filteredAnnouncements
  };
};
