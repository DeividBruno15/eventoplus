
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SecuritySettingsProps {
  loading: boolean;
  onDeleteAccount: () => void;
}

export const SecuritySettings = ({ loading, onDeleteAccount }: SecuritySettingsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const handleChangePassword = async () => {
    toast({
      title: "Alterar senha",
      description: "Um email foi enviado com instruções para alterar sua senha.",
    });
    
    // Em um cenário real, isso seria um endpoint de API
    setPasswordChangeSuccess(true);
    
    // Simular reset do estado após 3 segundos
    setTimeout(() => setPasswordChangeSuccess(false), 3000);
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
  
  const handleConfirmDelete = () => {
    onDeleteAccount();
    setDeleteDialogOpen(false);
    toast({
      title: "Conta excluída",
      description: "Sua conta foi excluída com sucesso.",
      variant: "destructive"
    });
    
    // Em um cenário real, redirecionaríamos para a página inicial ou de login
    setTimeout(() => navigate('/'), 2000);
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
            variant={passwordChangeSuccess ? "success" : "outline"}
            onClick={handleChangePassword}
            disabled={loading || passwordChangeSuccess}
          >
            {passwordChangeSuccess ? "Email enviado ✓" : "Alterar senha"}
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
        
        <div className="pt-4 border-t">
          <Button 
            variant="destructive" 
            onClick={() => setDeleteDialogOpen(true)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Processando..." : "Excluir minha conta"}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Esta ação não pode ser desfeita e todos os seus dados serão permanentemente removidos.
          </p>
        </div>
      </CardContent>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
              e removerá seus dados de nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, excluir minha conta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SecuritySettings;
