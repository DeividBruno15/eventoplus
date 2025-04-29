
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
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
        <CardDescription>
          Atalhos para ações comuns
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button variant="outline" className="justify-start" onClick={() => navigate('/profile')}>
          <Briefcase className="mr-2 h-4 w-4" />
          Atualizar Serviços
        </Button>
        <Button variant="outline" className="justify-start" onClick={() => navigate('/events')}>
          <Calendar className="mr-2 h-4 w-4" />
          Gerenciar Eventos
        </Button>
        <Button variant="outline" className="justify-start" onClick={() => navigate('/chat')}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Conversas
        </Button>
        <Button variant="outline" className="justify-start" onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </Button>
      </CardContent>
    </Card>
  );
};
