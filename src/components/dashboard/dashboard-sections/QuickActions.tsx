
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
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
        <CardDescription>
          Atalhos para ações comuns
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="outline" className="justify-start" onClick={() => navigate('/events/create')}>
          <Calendar className="mr-2 h-4 w-4" />
          Criar Novo Evento
        </Button>
        <Button variant="outline" className="justify-start" onClick={() => navigate('/service-providers')}>
          <Users className="mr-2 h-4 w-4" />
          Procurar Prestadores
        </Button>
        <Button variant="outline" className="justify-start" onClick={() => navigate('/chat')}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Iniciar Conversa
        </Button>
        <Button variant="outline" className="justify-start" onClick={() => navigate('/profile')}>
          <Briefcase className="mr-2 h-4 w-4" />
          Atualizar Perfil
        </Button>
      </CardContent>
    </Card>
  );
};
