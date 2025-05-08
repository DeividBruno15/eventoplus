
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from 'lucide-react';

interface RatingsEmptyProps {
  hasRatings: boolean;
  isAuthenticated: boolean;
  isOwner: boolean;
  onAddRating: () => void;
}

const RatingsEmpty: React.FC<RatingsEmptyProps> = ({
  hasRatings,
  isAuthenticated,
  isOwner,
  onAddRating
}) => {
  return (
    <div className="text-center py-12 border rounded-lg bg-muted/10">
      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      
      {hasRatings ? (
        <p className="text-gray-500">
          Nenhuma avaliação encontrada com o filtro selecionado.
        </p>
      ) : (
        <>
          <p className="text-gray-600 text-lg mb-2">
            Este local ainda não possui avaliações
          </p>
          
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Compartilhe sua experiência com outros usuários e ajude a 
            comunidade a conhecer melhor este local.
          </p>
          
          {isAuthenticated && !isOwner && (
            <Button onClick={onAddRating} className="mt-2">
              Seja o primeiro a avaliar
            </Button>
          )}
          
          {!isAuthenticated && (
            <p className="text-sm text-gray-400 mt-4">
              Faça login para avaliar este local
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default RatingsEmpty;
