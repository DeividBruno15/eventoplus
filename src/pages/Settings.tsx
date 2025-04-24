
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { session } = useSession();
  const navigate = useNavigate();

  if (!session) {
    navigate('/login');
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground mt-2">
          Ajuste as configurações da sua conta e preferências.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Conteúdo da página de Configurações</p>
          <p className="text-muted-foreground">
            Esta é a página de configurações onde você pode ajustar suas preferências.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
