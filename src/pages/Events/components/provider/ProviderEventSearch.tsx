
import React from "react";
import { EventsSearch } from "../EventsSearch";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProviderEventSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ProviderEventSearch = ({ searchQuery, setSearchQuery }: ProviderEventSearchProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <EventsSearch 
        value={searchQuery} 
        onChange={setSearchQuery} 
      />
      <Button onClick={() => navigate('/profile')}>
        Gerenciar Serviços
      </Button>
    </div>
  );
};
