
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface SettingsCardProps {
  whatsappEnabled: boolean;
  phoneNumber: string | null;
  handleToggleWhatsApp: () => void;
}

export function SettingsCard({ 
  whatsappEnabled, 
  phoneNumber,
  handleToggleWhatsApp 
}: SettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do WhatsApp</CardTitle>
        <CardDescription>
          Gerencie suas preferências de notificações via WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-1.5">
          <Label>Número de WhatsApp</Label>
          <p className="text-sm">
            {phoneNumber ? (
              phoneNumber
            ) : (
              <span className="text-muted-foreground italic">Nenhum número cadastrado</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="whatsapp-notifications">Notificações</Label>
            <p className="text-sm text-muted-foreground">
              Receba notificações importantes pelo WhatsApp
            </p>
          </div>
          <Switch
            id="whatsapp-notifications"
            checked={whatsappEnabled}
            onCheckedChange={handleToggleWhatsApp}
            disabled={!phoneNumber}
          />
        </div>
      </CardContent>
    </Card>
  );
}
