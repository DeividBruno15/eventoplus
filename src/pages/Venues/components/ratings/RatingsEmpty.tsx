
import React from 'react';
import { Button } from "@/components/ui/button";

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
    <div className="text-center py-8 border rounded-lg">
      {hasRatings ? (
        <p className="text-gray-500">
          Nenhuma avaliação encontrada com o filtro selecionado.
        </p>
      ) : (
        <>
          <p className="text-gray-500 mb-4">
            Este local ainda não possui avaliações.
          </p>
          
          {isAuthenticated && !isOwner && (
            <Button onClick={onAddRating}>
              Seja o primeiro a avaliar
            </Button>
          )}
          
          {!isAuthenticated && (
            <p className="text-sm text-gray-400">
              Faça login para avaliar este local
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default RatingsEmpty;
