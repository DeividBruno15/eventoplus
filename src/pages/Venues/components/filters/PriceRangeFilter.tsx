
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
    <div>
      <div className="flex justify-between mb-1">
        <h4 className="font-medium text-sm">Faixa de preço</h4>
        <div className="text-xs text-muted-foreground">
          {formatPrice(value[0])} - {formatPrice(value[1])}
        </div>
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
