
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie suas preferências e configurações da conta.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Configure suas preferências de notificação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Gerenciar Notificações
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>
              Gerencie a segurança da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Configurações de Segurança
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacidade</CardTitle>
            <CardDescription>
              Ajuste suas configurações de privacidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Configurações de Privacidade
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
