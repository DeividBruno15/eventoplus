
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

const Settings = () => {
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="notifications">
        <TabsList className="mb-6">
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
        </TabsList>

        {/* Aba de Notificações */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>Controle como e quando você recebe notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-base">Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">Receba atualizações importantes via email</p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="text-base">Notificações Push</Label>
                    <p className="text-sm text-muted-foreground">Receba notificações em tempo real</p>
                  </div>
                  <Switch 
                    id="push-notifications" 
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="text-base">Modo Escuro</Label>
                    <p className="text-sm text-muted-foreground">Ative o tema escuro para a interface</p>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Preferências</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Aba de Privacidade */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Privacidade</CardTitle>
              <CardDescription>Controle quem pode ver suas informações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-visibility" className="text-base">Perfil público</Label>
                    <p className="text-sm text-muted-foreground">Permitir que outros usuários vejam seu perfil</p>
                  </div>
                  <Switch id="profile-visibility" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-email" className="text-base">Exibir Email</Label>
                    <p className="text-sm text-muted-foreground">Permitir que outros usuários vejam seu email</p>
                  </div>
                  <Switch id="show-email" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-phone" className="text-base">Exibir Telefone</Label>
                    <p className="text-sm text-muted-foreground">Permitir que outros usuários vejam seu telefone</p>
                  </div>
                  <Switch id="show-phone" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Preferências</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Aba de Conta */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Conta</CardTitle>
              <CardDescription>Gerencie suas informações de acesso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground mb-2">{user?.email}</p>
                  <Button variant="outline" size="sm">Alterar Email</Button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium">Senha</h3>
                  <p className="text-sm text-muted-foreground mb-2">********</p>
                  <Button variant="outline" size="sm">Alterar Senha</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Exportar Dados</Button>
              <Button variant="destructive">Desativar Conta</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
