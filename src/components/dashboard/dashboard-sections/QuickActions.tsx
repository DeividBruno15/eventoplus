
import { Calendar, Users, MessageSquare, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";

interface QuickActionsProps {
  navigate: NavigateFunction;
}

export const QuickActions = ({ navigate }: QuickActionsProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-2xl">Ações Rápidas</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Atalhos para ações comuns
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
        <Button variant="outline" size="sm" className="justify-start h-9 md:h-10 text-xs md:text-sm" onClick={() => navigate('/events/create')}>
          <Calendar className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
          Criar Novo Evento
        </Button>
        <Button variant="outline" size="sm" className="justify-start h-9 md:h-10 text-xs md:text-sm" onClick={() => navigate('/service-providers')}>
          <Users className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
          Procurar Prestadores
        </Button>
        <Button variant="outline" size="sm" className="justify-start h-9 md:h-10 text-xs md:text-sm" onClick={() => navigate('/chat')}>
          <MessageSquare className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
          Iniciar Conversa
        </Button>
        <Button variant="outline" size="sm" className="justify-start h-9 md:h-10 text-xs md:text-sm" onClick={() => navigate('/profile')}>
          <Briefcase className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
          Atualizar Perfil
        </Button>
      </CardContent>
    </Card>
  );
};
