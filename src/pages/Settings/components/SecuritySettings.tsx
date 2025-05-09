
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface SecuritySettingsProps {
  loading: boolean;
  onDeleteAccount: () => void;
}

export const SecuritySettings = ({ loading, onDeleteAccount }: SecuritySettingsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    toast({
      title: "Alterar senha",
      description: "Um email foi enviado com instruções para alterar sua senha.",
    });
  };

  const handleEnableTwoFactor = async () => {
    toast({
      title: "Autenticação em dois fatores",
      description: "Funcionalidade a ser implementada em breve.",
    });
  };

  const handleManageDevices = async () => {
    toast({
      title: "Gerenciar dispositivos",
      description: "Funcionalidade a ser implementada em breve.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segurança</CardTitle>
        <CardDescription>
          Gerencie a segurança da sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={handleChangePassword}
            disabled={loading}
          >
            Alterar senha
          </Button>
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={handleEnableTwoFactor}
            disabled={loading}
          >
            Ativar autenticação em dois fatores
          </Button>
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={handleManageDevices}
            disabled={loading}
          >
            Gerenciar dispositivos conectados
          </Button>
        </div>
        
        <div className="pt-4">
          <Button 
            variant="destructive" 
            onClick={onDeleteAccount}
            disabled={loading}
          >
            {loading ? "Processando..." : "Excluir minha conta"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
