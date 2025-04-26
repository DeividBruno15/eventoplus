
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NoServicesWarning = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center h-40 text-center p-6">
        <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
        <h3 className="text-lg font-medium mb-2">Adicione categorias de serviços ao seu perfil</h3>
        <p className="text-muted-foreground text-sm">
          Para ver eventos disponíveis, você precisa adicionar as categorias de serviços que oferece.
        </p>
        <Button className="mt-4" onClick={() => navigate('/profile')}>
          Atualizar Perfil
        </Button>
      </CardContent>
    </Card>
  );
};
