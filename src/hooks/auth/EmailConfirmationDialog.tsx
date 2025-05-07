
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EmailConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onNavigateToLogin?: () => void;
}

export const EmailConfirmationDialog = ({ 
  open, 
  onClose, 
  email, 
  onNavigateToLogin 
}: EmailConfirmationDialogProps) => {
  
  const handleGoToLogin = () => {
    onClose();
    if (onNavigateToLogin) {
      onNavigateToLogin();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastro realizado com sucesso!</DialogTitle>
          <DialogDescription>
            Enviamos um e-mail de confirmação para <strong>{email}</strong>. 
            Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Se você não receber o e-mail em poucos minutos, verifique sua pasta de spam ou lixo eletrônico.
          </p>
          <div className="flex justify-center">
            <Button onClick={handleGoToLogin}>
              Ir para login
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
