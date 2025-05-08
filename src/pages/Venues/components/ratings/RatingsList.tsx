
import React, { useState, useEffect } from 'react';
import { VenueRating } from '../../types';
import { VenueRatingItem } from '../VenueRatingItem';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface RatingsListProps {
  ratings: VenueRating[];
  isOwner: boolean;
  onReply: (ratingId: string, response: string) => Promise<void>;
  itemsPerPage?: number;
  isLoading?: boolean;
}

const RatingsList: React.FC<RatingsListProps> = ({
  ratings,
  isOwner,
  onReply,
  itemsPerPage = 5,
  isLoading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentRatings, setCurrentRatings] = useState<VenueRating[]>([]);
  
  // Effect para calcular a paginação quando os ratings mudam
  useEffect(() => {
    const total = Math.max(1, Math.ceil(ratings.length / itemsPerPage));
    setTotalPages(total);
    
    // Ajustar página atual se for maior que o total de páginas
    if (currentPage > total) {
      setCurrentPage(total);
    }
    
    // Calcular os ratings da página atual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentRatings(ratings.slice(indexOfFirstItem, indexOfLastItem));
  }, [ratings, currentPage, itemsPerPage]);

  // Mudar página
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Rolar para o topo da seção de avaliações quando mudar de página
      document.getElementById('ratings-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Gerar array de páginas visíveis para a navegação
  const getVisiblePages = () => {
    const maxVisiblePages = 5;
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      // Se temos poucas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Se temos muitas páginas, mostrar algumas e usar elipses
      const leftSide = Math.floor(maxVisiblePages / 2);
      const rightSide = maxVisiblePages - leftSide;
      
      if (currentPage > totalPages - rightSide) {
        // Próximo do final
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else if (currentPage < leftSide) {
        // Próximo do início
        for (let i = 1; i <= maxVisiblePages; i++) {
          pages.push(i);
        }
      } else {
        // No meio
        for (let i = currentPage - leftSide + 1; i <= currentPage + rightSide - 1; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };
  
  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando avaliações...</p>
      </div>
    );
  }
  
  // Se não há avaliações
  if (ratings.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-muted/20">
        <div className="text-muted-foreground mb-2">
          Este local ainda não possui avaliações
        </div>
        <p className="text-sm text-muted-foreground">
          Seja o primeiro a avaliar
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6" id="ratings-section">
      <div className="space-y-4">
        {currentRatings.map((rating) => (
          <VenueRatingItem 
            key={rating.id} 
            rating={rating}
            isOwner={isOwner}
            onReply={onReply}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination className="pt-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => goToPage(currentPage - 1)}
                className={currentPage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {getVisiblePages().map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => goToPage(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => goToPage(currentPage + 1)}
                className={currentPage === totalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default RatingsList;
