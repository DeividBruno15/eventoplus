
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, User, Bell, Shield, ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';

const SettingsMobile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'menu' | 'account' | 'notifications' | 'security'>('menu');
  const [loading, setLoading] = useState(false);
  
  // Estado para configurações
  const [username, setUsername] = useState(user?.user_metadata?.username || '');
  const [language, setLanguage] = useState('pt-BR');
  const [darkMode, setDarkMode] = useState(false);
  
  // Estado para notificações
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  const handleSaveSettings = () => {
    setLoading(true);
    
    // Simular atualização de configurações
    setTimeout(() => {
      toast.success('Configurações atualizadas com sucesso');
      setLoading(false);
    }, 800);
  };
  
  const handleDeleteAccount = async () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      toast.error('Funcionalidade em implementação');
    }
  };

  const renderHeader = () => {
    if (activeSection === 'menu') {
      return <h1 className="text-xl font-bold">Configurações</h1>;
    }
    
    return (
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setActiveSection('menu')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <h1 className="text-lg font-bold">
          {activeSection === 'account' && 'Conta'}
          {activeSection === 'notifications' && 'Notificações'}
          {activeSection === 'security' && 'Segurança'}
        </h1>
      </div>
    );
  };

  const renderMainMenu = () => (
    <Card className="mb-4">
      <CardContent className="p-0">
        <button 
          onClick={() => setActiveSection('account')}
          className="flex items-center justify-between w-full p-4 border-b hover:bg-muted/50 transition-colors text-left"
        >
          <div className="flex items-center">
            <User className="h-5 w-5 mr-3 text-muted-foreground" />
            <span>Conta</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
        
        <button 
          onClick={() => setActiveSection('notifications')}
          className="flex items-center justify-between w-full p-4 border-b hover:bg-muted/50 transition-colors text-left"
        >
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-3 text-muted-foreground" />
            <span>Notificações</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
        
        <button 
          onClick={() => setActiveSection('security')}
          className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors text-left"
        >
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-3 text-muted-foreground" />
            <span>Segurança</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </CardContent>
    </Card>
  );

  const renderAccountSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da Conta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Nome de usuário</Label>
          <input
            id="username"
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border p-2"
            placeholder="Seu nome de usuário"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="language">Idioma</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language">
              <SelectValue placeholder="Selecione um idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
              <SelectItem value="en-US">English (United States)</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="theme">Tema escuro</Label>
          <Switch 
            id="theme" 
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </div>
        
        <Button 
          className="w-full mt-6" 
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </CardContent>
    </Card>
  );

  const renderNotificationSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">Notificações por e-mail</Label>
          <Switch 
            id="email-notifications" 
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications">Notificações push</Label>
          <Switch 
            id="push-notifications" 
            checked={pushNotifications}
            onCheckedChange={setPushNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="sms-notifications">Notificações por SMS</Label>
          <Switch 
            id="sms-notifications" 
            checked={smsNotifications}
            onCheckedChange={setSmsNotifications}
          />
        </div>
        
        <Button 
          className="w-full mt-6" 
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar preferências'}
        </Button>
      </CardContent>
    </Card>
  );

  const renderSecuritySettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Segurança</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => toast.info('Um email foi enviado com instruções para alterar sua senha.')}
        >
          Alterar senha
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => toast.info('Autenticação em dois fatores será implementada em breve.')}
        >
          Ativar autenticação em dois fatores
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => toast.info('Gerenciamento de dispositivos será implementado em breve.')}
        >
          Gerenciar dispositivos conectados
        </Button>
        
        <hr className="my-4" />
        
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleDeleteAccount}
        >
          Excluir minha conta
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-4">
      <div className="mb-4">
        {renderHeader()}
      </div>
      
      {activeSection === 'menu' && renderMainMenu()}
      {activeSection === 'account' && renderAccountSettings()}
      {activeSection === 'notifications' && renderNotificationSettings()}
      {activeSection === 'security' && renderSecuritySettings()}
    </div>
  );
};

export default SettingsMobile;
