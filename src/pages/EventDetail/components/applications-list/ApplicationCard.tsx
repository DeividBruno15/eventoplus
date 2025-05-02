import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { EventApplication } from '@/types/events';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Componentes para o modal
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ApplicationCardProps {
  application: EventApplication;
  onApprove: (applicationId: string, providerId: string) => Promise<void>;
  onReject: (applicationId: string, providerId: string, reason?: string) => Promise<void>;
  isDisabled: boolean;
}

export const ApplicationCard = ({ 
  application, 
  onApprove, 
  onReject, 
  isDisabled 
}: ApplicationCardProps) => {
  // Use typed local state for status
  const [localStatus, setLocalStatus] = useState<"pending" | "accepted" | "rejected">(application.status);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAction, setCurrentAction] = useState<"none" | "approve" | "reject" | "verify">("none");
  const [isPendingSync, setIsPendingSync] = useState(false);
  const [actionFailed, setActionFailed] = useState(false);
  
  // Estado para o modal de recusa
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Verificar o status real no Supabase
  const verifyRealStatus = useCallback(async (applicationId: string) => {
    try {
      setCurrentAction("verify");
      console.log(`Verificando status real da candidatura ${applicationId}...`);
      
      const { data, error } = await supabase
        .from('event_applications')
        .select('status')
        .eq('id', applicationId)
        .maybeSingle();
        
      if (error) {
        console.error(`Erro ao verificar status:`, error);
        return null;
      }
      
      if (!data) {
        console.warn(`Candidatura ${applicationId} não encontrada`);
        return null;
      }
      
      console.log(`Status real no banco: ${data.status}, status local: ${localStatus}`);
      return data.status as "pending" | "accepted" | "rejected";
    } catch (err) {
      console.error("Erro ao verificar status:", err);
      return null;
    } finally {
      setCurrentAction("none");
    }
  }, [localStatus]);
  
  // Resetar o estado local para o valor do prop quando mudar
  const resetToServerState = useCallback(() => {
    if (application.status !== localStatus) {
      console.log(`Resetando status para o valor original: ${application.status}`);
      setLocalStatus(application.status);
      setIsPendingSync(false);
      setActionFailed(false);
    }
  }, [application.status, localStatus]);
  
  // Update the local state when the prop changes
  useEffect(() => {
    // Se não estamos em modo de sincronização, atualizamos com o valor do servidor
    if (!isPendingSync) {
      resetToServerState();
    } 
    // Se estamos em modo de sincronização, mas a ação falhou, voltamos ao estado original
    else if (actionFailed) {
      resetToServerState();
    }
  }, [application.status, isPendingSync, actionFailed, resetToServerState]);
  
  // Função limpa para verificar IDs
  const validateIds = useCallback(() => {
    if (!application.id) {
      console.error('ApplicationCard: ID da candidatura não definido');
      toast.error('Erro: ID da candidatura não definido');
      return false;
    }
    
    if (!application.provider_id) {
      console.error('ApplicationCard: ID do prestador não definido');
      toast.error('Erro: ID do prestador não definido');
      return false;
    }
    
    return true;
  }, [application.id, application.provider_id]);
  
  // Abrir modal de recusa
  const handleOpenRejectModal = () => {
    if (isProcessing) return;
    if (!validateIds()) return;
    
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };
  
  // Processar a recusa após confirmação no modal
  const handleConfirmReject = async () => {
    if (isProcessing) return;
    if (!validateIds()) return;
    
    try {
      setIsRejectModalOpen(false);
      setIsProcessing(true);
      setCurrentAction("reject");
      
      // Não mudamos o estado local até que a operação tenha sucesso
      console.log(`ApplicationCard: Iniciando rejeição com justificativa para candidatura ${application.id}`);
      
      // Chamar onReject passando a razão
      await onReject(application.id, application.provider_id, rejectionReason);
      console.log(`ApplicationCard: Candidatura ${application.id} rejeitada com sucesso`);
      
      // Agora sim atualizamos o estado local após sucesso
      setLocalStatus('rejected');
    } catch (error: any) {
      console.error('ApplicationCard: Erro ao rejeitar candidatura:', error);
      toast.error('Erro ao processar a recusa da candidatura');
    } finally {
      setIsProcessing(false);
      setCurrentAction("none");
    }
  };
  
  // Handlers with immediate UI feedback
  const handleApprove = async () => {
    if (isProcessing) return;
    if (!validateIds()) return;
    
    try {
      // Resetar estados de erro anteriores
      setActionFailed(false);
      setIsProcessing(true);
      setCurrentAction("approve");
      setLocalStatus('accepted');
      setIsPendingSync(true);
      
      console.log(`ApplicationCard: Atualizando status local para 'accepted' para a candidatura ${application.id}`);
      await onApprove(application.id, application.provider_id);
      console.log(`ApplicationCard: Candidatura ${application.id} aprovada com sucesso`);
      
      // Se chegou aqui, não houve exceção
      setActionFailed(false);
    } catch (error: any) {
      console.error('ApplicationCard: Erro ao aprovar candidatura:', error);
      setActionFailed(true);
      
      // Quando falha, verificamos o status real no servidor para garantir
      try {
        const realStatus = await verifyRealStatus(application.id);
        if (realStatus) {
          setLocalStatus(realStatus);
          setIsPendingSync(false);
        } else {
          // Se não conseguir verificar, volta para o status original
          setLocalStatus(application.status);
          setIsPendingSync(false);
        }
      } catch (verifyError) {
        console.error('Erro ao verificar status após falha:', verifyError);
        setLocalStatus(application.status);
        setIsPendingSync(false);
      }
    } finally {
      setIsProcessing(false);
      setCurrentAction("none");
    }
  };
  
  // Tenta forçar uma verificação manual do status atual
  const handleRefreshStatus = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      const realStatus = await verifyRealStatus(application.id);
      
      if (realStatus) {
        if (realStatus !== localStatus) {
          console.log(`Atualizando status local de ${localStatus} para ${realStatus}`);
          setLocalStatus(realStatus);
          setIsPendingSync(false);
          setActionFailed(false);
          
          const statusTexts = {
            pending: 'Pendente',
            accepted: 'Aprovado',
            rejected: 'Rejeitado'
          };
          
          toast.success(`Status atualizado para: ${statusTexts[realStatus]}`);
        } else {
          // Status iguais, não há necessidade de sincronizar
          setIsPendingSync(false);
          setActionFailed(false);
          toast.info(`Status já está correto: ${realStatus}`);
        }
      } else {
        // Não foi possível verificar o status
        toast.warning('Não foi possível verificar o status atual.');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao verificar status atual');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getInitials = (firstName: string = '', lastName: string = '') => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Use localStatus for UI for immediate feedback
  return (
    <>
      <Card 
        className={cn(
          "overflow-hidden", 
          actionFailed ? "border-red-500 bg-red-50/30" : 
          localStatus === 'accepted' ? "border-green-500 bg-green-50" : 
          localStatus === 'rejected' ? "border-red-500 bg-red-50" : 
          isPendingSync ? "border-yellow-500 bg-yellow-50" : ""
        )}
      >
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={application.provider?.avatar_url || ''} />
                <AvatarFallback>
                  {application.provider ? getInitials(application.provider.first_name, application.provider.last_name) : '??'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {application.provider?.first_name} {application.provider?.last_name}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(application.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={
                localStatus === 'accepted' ? 'default' :
                localStatus === 'rejected' ? 'destructive' :
                'outline'
              }>
                {localStatus === 'accepted' ? 'Aprovado' :
                 localStatus === 'rejected' ? 'Rejeitado' :
                 'Pendente'}
              </Badge>
              
              {isPendingSync && !actionFailed && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                  Sincronizando
                </Badge>
              )}
              
              {actionFailed && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                  Falha
                </Badge>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Categoria: {application.service_category}</p>
            <p className="text-sm text-gray-700">{application.message}</p>
          </div>
          
          {isPendingSync && !actionFailed && (
            <div className="text-sm text-yellow-700 flex items-center gap-1 mt-1 mb-0">
              <AlertCircle className="h-4 w-4" />
              <span>Aguardando sincronização com o banco de dados.</span>
            </div>
          )}
          
          {actionFailed && (
            <div className="text-sm text-red-700 flex items-center gap-1 mt-1 mb-0">
              <AlertCircle className="h-4 w-4" />
              <span>A operação falhou. Clique em verificar para atualizar.</span>
            </div>
          )}
          
          <div className="flex gap-2 justify-end mt-2">
            {/* Botão de atualizar status visível quando pendente de sincronização ou falha */}
            {(isPendingSync || actionFailed) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshStatus}
                disabled={isProcessing}
                title="Verificar status atual"
                className={actionFailed ? "border-red-300 text-red-700 hover:bg-red-50" : ""}
              >
                {currentAction === "verify" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                {actionFailed ? "Verificar" : ""}
              </Button>
            )}
            
            {/* Botões de aprovar/rejeitar visíveis apenas para status 'pending' */}
            {localStatus === 'pending' && !(isPendingSync || actionFailed) && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenRejectModal}
                  disabled={isDisabled || isProcessing}
                  className={cn(
                    currentAction === "reject" ? "bg-red-50" : ""
                  )}
                >
                  {currentAction === "reject" ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <X className="h-4 w-4 mr-1" />
                  )}
                  {currentAction === "reject" ? 'Recusando...' : 'Recusar'}
                </Button>
                <Button
                  size="sm"
                  onClick={handleApprove}
                  disabled={isDisabled || isProcessing}
                  className={currentAction === "approve" ? "bg-green-50" : ""}
                >
                  {currentAction === "approve" ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  {currentAction === "approve" ? 'Aprovando...' : 'Aprovar'}
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
      
      {/* Modal de recusa com justificativa */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recusar candidatura</DialogTitle>
            <DialogDescription>
              Por favor, informe o motivo da recusa. Isso ajudará o prestador a entender por que sua candidatura não foi aceita.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo da recusa</Label>
              <Textarea
                id="reason"
                placeholder="Explique por que está recusando esta candidatura..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRejectModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmReject}
              disabled={!rejectionReason.trim()}
            >
              Recusar candidatura
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
