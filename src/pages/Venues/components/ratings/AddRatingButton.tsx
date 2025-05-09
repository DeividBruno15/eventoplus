
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AddRatingButtonProps {
  isAuthenticated: boolean;
  isOwner: boolean;
  hasUserRated: boolean;
  isAddingRating: boolean;
  onClick: () => void;
  label?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
  iconPosition?: "left" | "right" | "none";
  showTooltipWhenDisabled?: boolean;
}

const AddRatingButton: React.FC<AddRatingButtonProps> = ({
  isAuthenticated,
  isOwner,
  hasUserRated,
  isAddingRating,
  onClick,
  label = "Escrever avaliação",
  variant = "default",
  className,
  iconPosition = "left",
  showTooltipWhenDisabled = false
}) => {
  // Se o usuário não pode avaliar, renderiza nada ou tooltip baseado na prop
  if (!isAuthenticated || isOwner || hasUserRated || isAddingRating) {
    if (!showTooltipWhenDisabled) return null;
    
    let tooltipText = "";
    if (!isAuthenticated) tooltipText = "Faça login para avaliar este local";
    else if (isOwner) tooltipText = "Você não pode avaliar seu próprio local";
    else if (hasUserRated) tooltipText = "Você já avaliou este local";
    else tooltipText = "";
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">
            <Button 
              size="sm"
              variant="outline"
              className={cn("opacity-50 cursor-not-allowed", className)}
              disabled
            >
              {iconPosition === "left" && <Star className="h-4 w-4 mr-1.5" />}
              {label}
              {iconPosition === "right" && <Star className="h-4 w-4 ml-1.5" />}
            </Button>
          </div>
        </TooltipTrigger>
        {tooltipText && (
          <TooltipContent>
            {tooltipText}
          </TooltipContent>
        )}
      </Tooltip>
    );
  }
  
  return (
    <Button 
      onClick={onClick}
      size="sm"
      variant={variant}
      className={cn("transition-all hover:scale-105", className)}
    >
      {iconPosition === "left" && <Star className="h-4 w-4 mr-1.5" />}
      {label}
      {iconPosition === "right" && <Star className="h-4 w-4 ml-1.5" />}
    </Button>
  );
};

export default AddRatingButton;
