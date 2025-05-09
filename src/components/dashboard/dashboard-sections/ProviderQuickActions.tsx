
import { Calendar, MessageSquare, Settings, Briefcase } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";

interface ProviderQuickActionsProps {
  navigate: NavigateFunction;
}

export const ProviderQuickActions = ({ navigate }: ProviderQuickActionsProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-2xl">Ações Rápidas</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Atalhos para ações comuns
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Button variant="outline" size="sm" className="justify-start h-9 md:h-10 text-xs md:text-sm" onClick={() => navigate('/profile')}>
          <Briefcase className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
          Serviços
        </Button>
        <Button variant="outline" size="sm" className="justify-start h-9 md:h-10 text-xs md:text-sm" onClick={() => navigate('/events')}>
          <Calendar className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
          Eventos
        </Button>
        <Button variant="outline" size="sm" className="justify-start h-9 md:h-10 text-xs md:text-sm" onClick={() => navigate('/chat')}>
          <MessageSquare className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
          Conversas
        </Button>
        <Button variant="outline" size="sm" className="justify-start h-9 md:h-10 text-xs md:text-sm" onClick={() => navigate('/settings')}>
          <Settings className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
          Configurar
        </Button>
      </CardContent>
    </Card>
  );
};
