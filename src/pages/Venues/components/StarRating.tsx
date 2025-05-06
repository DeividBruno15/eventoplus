
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 'md',
  readOnly = false
}) => {
  const totalStars = 5;
  
  const handleClick = (newValue: number) => {
    if (readOnly || !onChange) return;
    
    // Toggle a estrela se o usuário clicar na estrela atual
    if (newValue === value) {
      onChange(0);
    } else {
      onChange(newValue);
    }
  };
  
  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            className={cn(
              starSizes[size],
              'cursor-pointer transition-all',
              starValue <= value 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300',
              !readOnly && 'hover:scale-110'
            )}
            onClick={() => handleClick(starValue)}
            role={readOnly ? undefined : "button"}
            tabIndex={readOnly ? undefined : 0}
            aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
          />
        );
      })}
    </div>
  );
};
