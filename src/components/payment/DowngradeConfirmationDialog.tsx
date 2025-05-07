
import { useState } from 'react';
import { CalendarIcon, CheckIcon, AlertTriangle, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';

interface DowngradeConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  currentPlanName: string;
  freePlanName: string;
  freePlanId: string;
  currentPlanEndDate?: string;
  lostBenefits: string[];
}

export const DowngradeConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  currentPlanName,
  freePlanName,
  freePlanId,
  currentPlanEndDate,
  lostBenefits,
}: DowngradeConfirmationDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      toast({
        title: "Plano alterado com sucesso",
        description: `Você mudou para o plano ${freePlanName}.`,
      });
      onClose();
    } catch (error) {
      console.error("Erro ao fazer downgrade do plano:", error);
      toast({
        title: "Erro ao alterar plano",
        description: "Não foi possível completar a alteração do plano. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Formata a data de expiração do plano atual
  const formattedExpirationDate = currentPlanEndDate 
    ? format(new Date(currentPlanEndDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-amber-100 p-3 rounded-full mb-4">
            <ArrowDown className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-xl">Mudar para o plano gratuito?</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Você está prestes a fazer o downgrade do plano <strong>{currentPlanName}</strong> para o plano <strong>{freePlanName}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        {formattedExpirationDate && (
          <div className="border rounded-md p-4 mb-4 bg-muted/50">
            <div className="flex items-center gap-2 font-medium mb-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              Acesso ao plano atual
            </div>
            <p className="text-sm">
              Você continuará tendo acesso aos benefícios do plano <strong>{currentPlanName}</strong> até <strong>{formattedExpirationDate}</strong>.
            </p>
            <p className="text-sm mt-2">
              Após essa data, seu plano será automaticamente alterado para o plano {freePlanName}.
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Você perderá os seguintes benefícios:
            </h3>
            <ul className="space-y-2">
              {lostBenefits.map((benefit, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span> {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="sm:justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Processando..." : "Confirmar mudança"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
