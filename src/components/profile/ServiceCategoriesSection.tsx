
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProviderServices } from "@/pages/Events/hooks/useProviderServices";

interface ServiceCategoriesSectionProps {
  onManageServices: () => void;
}

export const ServiceCategoriesSection = ({ onManageServices }: ServiceCategoriesSectionProps) => {
  const { userServices, loading } = useProviderServices();
  
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium">Meus Serviços</h3>
          <Button 
            onClick={onManageServices}
            size="sm"
          >
            Gerenciar Serviços
          </Button>
        </div>

        <div className="mb-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando serviços...</p>
          ) : userServices.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userServices.map((service, index) => (
                <Badge key={index} variant="outline" className="bg-primary/10">
                  {service}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Você ainda não adicionou nenhuma categoria de serviço.
            </p>
          )}
        </div>

        <div className="text-muted-foreground text-sm">
          Gerencie os serviços que você oferece como prestador.
        </div>
      </div>
    </div>
  );
};
