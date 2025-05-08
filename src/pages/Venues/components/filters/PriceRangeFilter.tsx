
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface PriceRangeFilterProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ value, onChange }) => {
  // Format price display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {formatPrice(value[0])}
        </span>
        <span className="text-sm text-muted-foreground">
          {formatPrice(value[1])}
        </span>
      </div>
      
      <Slider
        defaultValue={value}
        min={0}
        max={10000}
        step={100}
        value={value}
        onValueChange={(value) => onChange(value as [number, number])}
      />
    </div>
  );
};

export default PriceRangeFilter;
