
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddRatingButtonProps {
  isAuthenticated: boolean;
  isOwner: boolean;
  hasUserRated: boolean;
  isAddingRating: boolean;
  onClick: () => void;
  label?: string;
  variant?: "default" | "outline" | "secondary";
  className?: string;
}

const AddRatingButton: React.FC<AddRatingButtonProps> = ({
  isAuthenticated,
  isOwner,
  hasUserRated,
  isAddingRating,
  onClick,
  label = "Escrever avaliação",
  variant = "default",
  className
}) => {
  if (!isAuthenticated || isOwner || hasUserRated || isAddingRating) return null;
  
  return (
    <Button 
      onClick={onClick}
      size="sm"
      variant={variant}
      className={cn(className)}
    >
      {label}
    </Button>
  );
};

export default AddRatingButton;
