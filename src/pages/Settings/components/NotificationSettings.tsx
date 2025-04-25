
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface NotificationSettingsProps {
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  pushNotifications: boolean;
  setPushNotifications: (value: boolean) => void;
  smsNotifications: boolean;
  setSmsNotifications: (value: boolean) => void;
  loading: boolean;
}

export const NotificationSettings = ({
  emailNotifications,
  setEmailNotifications,
  pushNotifications,
  setPushNotifications,
  smsNotifications,
  setSmsNotifications,
  loading
}: NotificationSettingsProps) => {
  const { toast } = useToast();

  const handleSaveNotifications = async () => {
    try {
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
    }
  };

  return (
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
  );
};
