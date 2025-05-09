
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSettings } from "./components/AccountSettings";
import { NotificationSettings } from "./components/NotificationSettings";
import { SecuritySettings } from "./components/SecuritySettings";
import SettingsMobile from "./components/SettingsMobile";
import { useBreakpoint } from '@/hooks/useBreakpoint';

const Settings = () => {
  const { isMobile } = useBreakpoint('md');
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('pt-BR');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    // Implementation would go here
    console.log("Delete account requested");
  };

  if (isMobile) {
    return <SettingsMobile />;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <AccountSettings
            username={username}
            setUsername={setUsername}
            language={language}
            setLanguage={setLanguage}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings
            emailNotifications={emailNotifications}
            setEmailNotifications={setEmailNotifications}
            pushNotifications={pushNotifications}
            setPushNotifications={setPushNotifications}
            smsNotifications={smsNotifications}
            setSmsNotifications={setSmsNotifications}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySettings 
            loading={loading}
            onDeleteAccount={handleDeleteAccount}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
