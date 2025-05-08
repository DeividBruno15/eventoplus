
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Buscar espaços..."
        className="pl-9 pr-4"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;
