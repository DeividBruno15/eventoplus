
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const { session } = useSession();
  const navigate = useNavigate();

  if (!session) {
    navigate('/login');
    return null;
  }

  // Mock user data
  const userData = {
    firstName: session.user?.user_metadata?.first_name || 'Nome',
    lastName: session.user?.user_metadata?.last_name || 'do Usuário',
    email: session.user?.email || 'usuario@exemplo.com',
    phone: '(11) 98765-4321',
    address: 'Rua Exemplo, 123 - São Paulo, SP',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Perfil</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais e preferências de conta.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Informações Pessoais</span>
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" /> Editar
              </Button>
            </CardTitle>
            <CardDescription>Seus dados cadastrais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border">
                <div className="bg-primary text-white flex items-center justify-center h-full text-xl font-medium">
                  {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                </div>
              </Avatar>
              <div>
                <h3 className="text-xl font-medium">{userData.firstName} {userData.lastName}</h3>
                <p className="text-sm text-muted-foreground">Membro desde Abril 2025</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{userData.email}</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-center">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p>{userData.phone}</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-center">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                  <p>{userData.address}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Sobre mim</CardTitle>
            <CardDescription>Uma breve descrição sobre você</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{userData.bio}</p>
            <Button className="mt-4" variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" /> Editar biografia
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Preferências da conta</CardTitle>
            <CardDescription>Configure suas preferências de notificação e privacidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button className="justify-start" variant="outline">
                <Mail className="mr-2 h-4 w-4" /> Configurar notificações por email
              </Button>
              <Button className="justify-start" variant="outline">
                <User className="mr-2 h-4 w-4" /> Configurar visibilidade do perfil
              </Button>
              <Button className="justify-start" variant="outline">
                <Phone className="mr-2 h-4 w-4" /> Gerenciar notificações por SMS
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
