
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationName: string;
  onConversationNameChange: (name: string) => void;
  onCreateConversation: () => void;
}

export const NewConversationDialog = ({
  open,
  onOpenChange,
  conversationName,
  onConversationNameChange,
  onCreateConversation,
}: NewConversationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Conversa</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <label htmlFor="recipient" className="text-sm font-medium mb-2 block">
              Nome do destinatário
            </label>
            <Input
              id="recipient"
              placeholder="Digite o nome do usuário"
              value={conversationName}
              onChange={(e) => onConversationNameChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={onCreateConversation}>Iniciar Conversa</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
