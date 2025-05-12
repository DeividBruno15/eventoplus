
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, Volume2, VolumeX } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotificationSounds } from '@/hooks/useNotificationSounds';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { useToast } from '@/hooks/use-toast';

export function NotificationSettings() {
  const { user } = useAuth();
  const { soundsEnabled, toggleSounds } = useNotificationSounds();
  const { toast } = useToast();
  const [pushEnabled, setPushEnabled] = useState(
    localStorage.getItem('notifications_push') === 'true'
  );
  const [emailEnabled, setEmailEnabled] = useState(
    localStorage.getItem('notifications_email') === 'true'
  );
  const [whatsappEnabled, setWhatsappEnabled] = useState(
    localStorage.getItem('notifications_whatsapp') === 'true'
  );
  const [isOpen, setIsOpen] = useState(false);

  const savePreferences = async () => {
    if (!user?.id) return;
    
    localStorage.setItem('notifications_push', String(pushEnabled));
    localStorage.setItem('notifications_email', String(emailEnabled));
    localStorage.setItem('notifications_whatsapp', String(whatsappEnabled));
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          notifications_push: pushEnabled,
          notifications_email: emailEnabled,
          whatsapp_opt_in: whatsappEnabled
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Configurações salvas",
        description: "Suas preferências de notificação foram atualizadas"
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas preferências",
        variant: "destructive"
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Configurações de notificação</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h3 className="font-medium text-base">Configurações de notificação</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="sounds">Sons</Label>
            </div>
            <Switch 
              id="sounds" 
              checked={soundsEnabled} 
              onCheckedChange={toggleSounds}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="push">Notificações push</Label>
            </div>
            <Switch 
              id="push" 
              checked={pushEnabled} 
              onCheckedChange={setPushEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="m3 8 4 1 1 2-5 3z"/>
                <path d="M21 8a9 9 0 0 0-9-4c-1.83.28-3.4 1.14-4 3-1 3 2 9 2 9"/>
                <path d="M12 19c1 1 2 2 3 2 1.59 0 3.09-1 4-2 1-1 2-.37 2-1.5 0-1-.88-1.5-2.03-1.5-2.67 0-3.56 1.5-5 1.5-.83 0-1.97-.93-1.97-2"/>
              </svg>
              <Label htmlFor="whatsapp">Notificações WhatsApp</Label>
            </div>
            <Switch 
              id="whatsapp" 
              checked={whatsappEnabled} 
              onCheckedChange={setWhatsappEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
                <path d="m3 9 9-6 9 6"/>
                <path d="M12 12v5"/>
              </svg>
              <Label htmlFor="email">Notificações por email</Label>
            </div>
            <Switch 
              id="email" 
              checked={emailEnabled} 
              onCheckedChange={setEmailEnabled}
            />
          </div>
          
          <Button className="w-full" onClick={savePreferences}>
            Salvar preferências
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
