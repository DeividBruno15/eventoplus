
import React from 'react';
import { Button } from "@/components/ui/button";

interface AddRatingButtonProps {
  isAuthenticated: boolean;
  isOwner: boolean;
  hasUserRated: boolean;
  isAddingRating: boolean;
  onClick: () => void;
}

const AddRatingButton: React.FC<AddRatingButtonProps> = ({
  isAuthenticated,
  isOwner,
  hasUserRated,
  isAddingRating,
  onClick
}) => {
  if (!isAuthenticated || isOwner || hasUserRated || isAddingRating) return null;
  
  return (
    <Button 
      onClick={onClick}
      size="sm"
    >
      Escrever avaliação
    </Button>
  );
};

export default AddRatingButton;
