
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useDebounce } from 'use-debounce';
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);
  const [debouncedValue] = useDebounce(inputValue, 300);
  
  // Handle local input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Clear search field
  const handleClear = () => {
    setInputValue('');
  };
  
  // Propagate debounced value to parent
  useEffect(() => {
    const syntheticEvent = {
      target: { value: debouncedValue }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  }, [debouncedValue, onChange]);
  
  // Sync with external value changes
  useEffect(() => {
    if (value !== inputValue && value === '') {
      setInputValue('');
    }
  }, [value]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Buscar espaços..."
        className="pl-9 pr-10"
        value={inputValue}
        onChange={handleInputChange}
      />
      {inputValue && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0" 
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Limpar busca</span>
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
