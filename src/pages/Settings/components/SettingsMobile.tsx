
import React from 'react';
import { ChevronRight, CreditCard, HelpCircle, Bell, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SettingsMobile = () => {
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const settingsItems = [
    {
      icon: CreditCard,
      title: 'Minha assinatura',
      path: '/payments',
      description: 'Gerencie sua assinatura e pagamentos'
    },
    {
      icon: Bell,
      title: 'Notificações',
      path: '/notifications',
      description: 'Preferências de notificações'
    },
    {
      icon: HelpCircle,
      title: 'Suporte',
      path: '/support',
      description: 'Obtenha ajuda e suporte'
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="md:hidden space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>
        
        <div className="space-y-4">
          {settingsItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="w-full justify-between h-auto py-4 px-4 bg-card hover:bg-card/80"
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center">
                <item.icon className="h-5 w-5 mr-3 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t">
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default SettingsMobile;
