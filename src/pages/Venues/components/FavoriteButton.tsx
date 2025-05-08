
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useFavoriteVenues } from '../hooks/useFavoriteVenues';
import { useAuth } from '@/hooks/auth';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FavoriteButtonProps {
  venueId: string;
  venueName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  venueId,
  venueName,
  size = 'md',
  className = ''
}) => {
  const { isVenueFavorite, toggleFavorite } = useFavoriteVenues();
  const { user } = useAuth();
  const isFavorite = isVenueFavorite(venueId);
  
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir navegação
    e.stopPropagation(); // Parar propagação do evento
    
    await toggleFavorite(venueId, venueName);
  };
  
  // Definir dimensões de acordo com o tamanho
  const getIconSize = () => {
    switch(size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-6 w-6';
      default: return 'h-5 w-5';
    }
  };
  
  // Definir variante do botão com base em se é favorito ou não
  const buttonVariant = isFavorite ? "default" : "outline";
  
  // Tooltip para usuário não autenticado
  if (!user) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={className}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = '/login';
              }}
            >
              <Heart className={getIconSize()} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Faça login para favoritar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <Button
      variant={buttonVariant}
      size="icon"
      onClick={handleToggleFavorite}
      className={`group ${className} ${isFavorite ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500' : 'hover:border-rose-300 hover:text-rose-500'}`}
    >
      <Heart className={`${getIconSize()} ${isFavorite ? 'fill-white' : 'fill-transparent group-hover:fill-rose-500'}`} />
      <span className="sr-only">{isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}</span>
    </Button>
  );
};

export default FavoriteButton;
