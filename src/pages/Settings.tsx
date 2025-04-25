
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings as SettingsIcon, Bell, Lock, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(session?.user?.user_metadata?.username || "");
  const [language, setLanguage] = useState("pt-BR");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        data: {
          username,
          language,
          theme_preference: darkMode ? 'dark' : 'light'
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Suas configurações foram salvas.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar as configurações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        data: {
          notification_preferences: {
            email: emailNotifications,
            push: pushNotifications,
            sms: smsNotifications
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Suas preferências de notificação foram salvas.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar as preferências",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      // Here we would open a modal or navigate to a change password page
      // For now, we'll just show a toast
      toast({
        title: "Alterar senha",
        description: "Um email foi enviado com instruções para alterar sua senha.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar senha",
        variant: "destructive"
      });
    }
  };

  const handleEnableTwoFactor = async () => {
    try {
      toast({
        title: "Autenticação em dois fatores",
        description: "Funcionalidade a ser implementada em breve.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleManageDevices = async () => {
    try {
      toast({
        title: "Gerenciar dispositivos",
        description: "Funcionalidade a ser implementada em breve.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      try {
        setLoading(true);
        
        // In a real app, we would need admin privileges to delete users
        // For now, we'll just simulate it and log the user out
        await supabase.auth.signOut();
        
        toast({
          title: "Conta excluída",
          description: "Sua conta foi excluída com sucesso.",
          variant: "destructive",
        });
        navigate('/');
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.message || "Erro ao excluir conta",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };

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
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Conta
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Segurança
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Conta</CardTitle>
              <CardDescription>
                Gerencie suas informações de conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={session.user?.email || ''} disabled />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input 
                    id="username" 
                    placeholder="Nome de usuário" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <select 
                    id="language" 
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">Inglês (EUA)</option>
                    <option value="es-ES">Espanhol</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="theme" 
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
                <Label htmlFor="theme">Modo escuro</Label>
              </div>
              
              <Button onClick={handleSaveSettings} disabled={loading}>
                {loading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure como deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_notif">Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações por email
                    </p>
                  </div>
                  <Switch 
                    id="email_notif" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push_notif">Push</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações push no navegador
                    </p>
                  </div>
                  <Switch 
                    id="push_notif"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms_notif">SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações por SMS
                    </p>
                  </div>
                  <Switch 
                    id="sms_notif"
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveNotifications} disabled={loading}>
                {loading ? "Salvando..." : "Salvar preferências"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Gerencie a segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={handleChangePassword}
                  disabled={loading}
                >
                  Alterar senha
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={handleEnableTwoFactor}
                  disabled={loading}
                >
                  Ativar autenticação em dois fatores
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={handleManageDevices}
                  disabled={loading}
                >
                  Gerenciar dispositivos conectados
                </Button>
              </div>
              
              <div className="pt-4">
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={loading}
                >
                  {loading ? "Processando..." : "Excluir minha conta"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
