
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { session } = useSession();
  const navigate = useNavigate();

  if (!session) {
    navigate('/login');
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Perfil</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais e preferências de conta.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Conteúdo da página de Perfil</p>
          <p className="text-muted-foreground">
            Esta é a página de perfil do usuário onde você pode gerenciar suas informações.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
