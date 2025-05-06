
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const VenueNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/venues')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
      </div>
      
      <Card className="p-10 text-center">
        <h2 className="text-xl font-medium mb-2">Anúncio não encontrado</h2>
        <p className="text-muted-foreground mb-6">
          O anúncio que você está procurando não existe ou foi removido.
        </p>
        <Button onClick={() => navigate('/venues')}>
          Ver meus anúncios
        </Button>
      </Card>
    </div>
  );
};
