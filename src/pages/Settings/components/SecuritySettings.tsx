
import { useState, useEffect } from "react";
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
import { Shield, ShieldAlert, Smartphone, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SecuritySettingsProps {
  loading: boolean;
  onDeleteAccount: () => void;
}

export const SecuritySettings = ({ loading, onDeleteAccount }: SecuritySettingsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [deviceData, setDeviceData] = useState<{lastLogin?: Date, browser?: string, os?: string} | null>(null);
  const [securityCheckPerformed, setSecurityCheckPerformed] = useState(false);

  // Get session data for security purposes
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data?.session) {
          // Extract useful security information
          const sessionCreatedAt = new Date(data.session.created_at);
          const userAgent = navigator.userAgent;
          const browser = detectBrowser(userAgent);
          const os = detectOS(userAgent);
          
          setDeviceData({
            lastLogin: sessionCreatedAt,
            browser,
            os,
          });
          
          // Perform basic security check
          performSecurityCheck(data.session);
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };
    
    fetchSessionData();
  }, []);
  
  // Simple security check
  const performSecurityCheck = (session: any) => {
    const warnings = [];
    
    // Check session age (if older than 7 days, suggest refreshing)
    const sessionAge = new Date().getTime() - new Date(session.created_at).getTime();
    const daysDiff = Math.floor(sessionAge / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 7) {
      warnings.push("Sua sessão atual está ativa há mais de 7 dias. Considere fazer login novamente para maior segurança.");
    }
    
    // Show warnings if any
    if (warnings.length > 0) {
      toast({
        title: "Aviso de Segurança",
        description: warnings[0],
        variant: "warning"
      });
    }
    
    setSecurityCheckPerformed(true);
  };

  // Helper functions for device detection
  const detectBrowser = (userAgent: string): string => {
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
    return "Navegador desconhecido";
  };
  
  const detectOS = (userAgent: string): string => {
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac")) return "MacOS";
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS";
    return "Sistema operacional desconhecido";
  };

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
  
  const handleInitiateDelete = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDeleteRequest = () => {
    if (deleteConfirmText.toLowerCase() === "excluir") {
      setDeleteDialogOpen(false);
      setConfirmDeleteDialogOpen(true);
    } else {
      toast({
        title: "Confirmação incorreta",
        description: "Por favor, digite 'excluir' para confirmar a exclusão da conta.",
        variant: "destructive"
      });
    }
  };
  
  const handleFinalDeleteConfirm = () => {
    onDeleteAccount();
    setConfirmDeleteDialogOpen(false);
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
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Segurança
        </CardTitle>
        <CardDescription>
          Gerencie a segurança da sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {deviceData && (
          <div className="p-4 bg-secondary/20 rounded-md text-sm">
            <p className="font-medium mb-1">Informações do dispositivo atual:</p>
            <p>Navegador: {deviceData.browser}</p>
            <p>Sistema: {deviceData.os}</p>
            <p>Último login: {deviceData.lastLogin?.toLocaleString('pt-BR')}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <Button 
            className="w-full flex items-center justify-center gap-2" 
            variant={passwordChangeSuccess ? "success" : "outline"}
            onClick={handleChangePassword}
            disabled={loading || passwordChangeSuccess}
          >
            <ShieldAlert className="h-4 w-4" />
            {passwordChangeSuccess ? "Email enviado ✓" : "Alterar senha"}
          </Button>
          <Button 
            className="w-full flex items-center justify-center gap-2" 
            variant="outline" 
            onClick={handleEnableTwoFactor}
            disabled={loading}
          >
            <Smartphone className="h-4 w-4" />
            Ativar autenticação em dois fatores
          </Button>
          <Button 
            className="w-full flex items-center justify-center gap-2" 
            variant="outline" 
            onClick={handleManageDevices}
            disabled={loading}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Gerenciar dispositivos conectados
          </Button>
        </div>
        
        <div className="pt-4 border-t">
          <Button 
            variant="destructive" 
            onClick={handleInitiateDelete}
            disabled={loading}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
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
            <AlertDialogTitle>Confirmação de exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
              e removerá seus dados de nossos servidores.
              <div className="mt-4">
                <p className="font-semibold mb-1">Digite "excluir" para confirmar:</p>
                <input 
                  type="text" 
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                  placeholder="excluir"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteRequest}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Última confirmação</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem ABSOLUTA certeza? Esta ação é irreversível.
              Todos os seus dados, configurações e histórico serão excluídos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não, cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinalDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, excluir minha conta permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SecuritySettings;
