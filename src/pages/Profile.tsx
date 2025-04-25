
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Edit, CreditCard, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Dialogs state
  const [editPersonalInfoOpen, setEditPersonalInfoOpen] = useState(false);
  const [editBioOpen, setEditBioOpen] = useState(false);
  const [emailNotificationsOpen, setEmailNotificationsOpen] = useState(false);
  const [profileVisibilityOpen, setProfileVisibilityOpen] = useState(false);
  const [smsNotificationsOpen, setSmsNotificationsOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: ""
  });

  // User data state
  const [userData, setUserData] = useState({
    firstName: session?.user?.user_metadata?.first_name || 'Nome',
    lastName: session?.user?.user_metadata?.last_name || 'do Usuário',
    email: session?.user?.email || 'usuario@exemplo.com',
    phone: '(11) 98765-4321',
    address: 'Rua Exemplo, 123 - São Paulo, SP',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    accountType: 'Profissional',
    plan: 'Premium'
  });

  useEffect(() => {
    // Initialize form data with user data
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      bio: userData.bio
    });
  }, [userData]);

  if (!session) {
    navigate('/login');
    return null;
  }

  const handleEditPersonalInfo = () => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      bio: userData.bio
    });
    setEditPersonalInfoOpen(true);
  };

  const handleEditBio = () => {
    setFormData({
      ...formData,
      bio: userData.bio
    });
    setEditBioOpen(true);
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Clear example values when input is focused
    const name = e.target.name;
    const value = e.target.value;
    
    // Check if the current value is an example value
    if (
      (name === 'phone' && value === '(11) 98765-4321') ||
      (name === 'address' && value === 'Rua Exemplo, 123 - São Paulo, SP') ||
      (name === 'bio' && value === 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')
    ) {
      setFormData(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePersonalInfo = () => {
    // Save data to user state
    setUserData(prev => ({
      ...prev,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    }));
    
    toast({
      title: "Informações atualizadas",
      description: "Seus dados pessoais foram atualizados com sucesso."
    });
    setEditPersonalInfoOpen(false);
  };

  const handleSaveBio = () => {
    // Save bio to user state
    setUserData(prev => ({
      ...prev,
      bio: formData.bio
    }));
    
    toast({
      title: "Biografia atualizada",
      description: "Sua biografia foi atualizada com sucesso."
    });
    setEditBioOpen(false);
  };

  const handleToggleEmailNotifications = () => {
    setEmailNotificationsOpen(true);
  };

  const handleToggleProfileVisibility = () => {
    setProfileVisibilityOpen(true);
  };

  const handleToggleSmsNotifications = () => {
    setSmsNotificationsOpen(true);
  };

  const handleSaveSettings = (settingType: string) => {
    toast({
      title: "Configurações salvas",
      description: `Suas preferências de ${settingType} foram atualizadas.`
    });
    
    // Fechar o diálogo apropriado
    if (settingType === 'email') setEmailNotificationsOpen(false);
    else if (settingType === 'visibilidade') setProfileVisibilityOpen(false);
    else if (settingType === 'SMS') setSmsNotificationsOpen(false);
  };

  const handleUpgradePlan = () => {
    navigate('/plans');
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
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleEditPersonalInfo}
              >
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
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-medium">{userData.firstName} {userData.lastName}</h3>
                  <Badge className="ml-2">{userData.accountType}</Badge>
                </div>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    Plano {userData.plan}
                  </Badge>
                  <Button variant="link" size="sm" className="p-0 h-auto ml-2" onClick={handleUpgradePlan}>
                    Alterar plano
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Membro desde Abril 2025</p>
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

              <div className="flex gap-3 items-center">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Plano de Assinatura</p>
                  <p>{userData.plan}</p>
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
            <Button 
              className="mt-4" 
              variant="outline" 
              size="sm"
              onClick={handleEditBio}
            >
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
              <Button 
                className="justify-start" 
                variant="outline"
                onClick={handleToggleEmailNotifications}
              >
                <Mail className="mr-2 h-4 w-4" /> Configurar notificações por email
              </Button>
              <Button 
                className="justify-start" 
                variant="outline"
                onClick={handleToggleProfileVisibility}
              >
                <User className="mr-2 h-4 w-4" /> Configurar visibilidade do perfil
              </Button>
              <Button 
                className="justify-start" 
                variant="outline"
                onClick={handleToggleSmsNotifications}
              >
                <Phone className="mr-2 h-4 w-4" /> Gerenciar notificações por SMS
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diálogos para edição */}
      <Dialog open={editPersonalInfoOpen} onOpenChange={setEditPersonalInfoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Informações Pessoais</DialogTitle>
            <DialogDescription>
              Atualize seus dados cadastrais
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="text-sm font-medium">Nome</label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="text-sm font-medium">Sobrenome</label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
            <div>
              <label htmlFor="address" className="text-sm font-medium">Endereço</label>
              <Input 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditPersonalInfoOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSavePersonalInfo}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editBioOpen} onOpenChange={setEditBioOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Biografia</DialogTitle>
            <DialogDescription>
              Atualize sua descrição pessoal
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea 
              id="bio" 
              name="bio" 
              rows={6} 
              value={formData.bio} 
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditBioOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSaveBio}>
              Salvar biografia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para configurações de email */}
      <Dialog open={emailNotificationsOpen} onOpenChange={setEmailNotificationsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notificações por Email</DialogTitle>
            <DialogDescription>
              Configure quando deseja receber notificações por email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Aqui você colocaria os controles de configuração */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Novos eventos</h4>
                <p className="text-sm text-muted-foreground">Receber notificações sobre novos eventos</p>
              </div>
              <Button variant="outline" size="sm">Ativar</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Novas mensagens</h4>
                <p className="text-sm text-muted-foreground">Receber notificações sobre novas mensagens</p>
              </div>
              <Button variant="outline" size="sm">Ativar</Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => handleSaveSettings('email')}>
              Salvar configurações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para visibilidade do perfil */}
      <Dialog open={profileVisibilityOpen} onOpenChange={setProfileVisibilityOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Visibilidade do Perfil</DialogTitle>
            <DialogDescription>
              Configure quem pode ver seu perfil e informações
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Perfil público</h4>
                <p className="text-sm text-muted-foreground">Tornar seu perfil visível para todos</p>
              </div>
              <Button variant="outline" size="sm">Ativar</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Mostrar email</h4>
                <p className="text-sm text-muted-foreground">Exibir seu email no perfil</p>
              </div>
              <Button variant="outline" size="sm">Desativar</Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => handleSaveSettings('visibilidade')}>
              Salvar configurações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para notificações SMS */}
      <Dialog open={smsNotificationsOpen} onOpenChange={setSmsNotificationsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notificações por SMS</DialogTitle>
            <DialogDescription>
              Configure quando deseja receber notificações por SMS
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Novas mensagens</h4>
                <p className="text-sm text-muted-foreground">Receber SMS para novas mensagens</p>
              </div>
              <Button variant="outline" size="sm">Desativar</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Lembretes de eventos</h4>
                <p className="text-sm text-muted-foreground">Receber SMS para lembretes de eventos</p>
              </div>
              <Button variant="outline" size="sm">Ativar</Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => handleSaveSettings('SMS')}>
              Salvar configurações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
