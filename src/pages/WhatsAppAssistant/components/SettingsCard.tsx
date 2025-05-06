
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface SettingsCardProps {
  whatsappEnabled: boolean;
  phoneNumber: string | null;
  handleToggleWhatsApp: () => Promise<void>;
}

export const SettingsCard = ({
  whatsappEnabled,
  phoneNumber,
  handleToggleWhatsApp
}: SettingsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="whatsapp-notifications"
            checked={whatsappEnabled}
            onCheckedChange={handleToggleWhatsApp}
          />
          <Label htmlFor="whatsapp-notifications">Receber notificações por WhatsApp</Label>
        </div>
        
        {!phoneNumber && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Você precisa adicionar um número de telefone ao seu perfil para usar o WhatsApp.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <h3 className="font-medium text-sm mb-1">Seu número</h3>
          <p className="text-muted-foreground">
            {phoneNumber || 'Nenhum número cadastrado'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
