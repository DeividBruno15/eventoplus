
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AccountSettingsProps {
  username: string;
  setUsername: (username: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  loading: boolean;
}

export const AccountSettings = ({
  username,
  setUsername,
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  loading
}: AccountSettingsProps) => {
  const { toast } = useToast();

  const handleSaveSettings = async () => {
    try {
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
    }
  };

  return (
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
  );
};
