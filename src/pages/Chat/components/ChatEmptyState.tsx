
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ChatEmptyStateProps {
  openCreateDialog: () => void;
  hasConversations: boolean;
}

export function ChatEmptyState({ openCreateDialog, hasConversations }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M17 9C17 12.866 13.866 16 10 16C6.13401 16 3 12.866 3 9C3 5.13401 6.13401 2 10 2C13.866 2 17 5.13401 17 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 21L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      {hasConversations ? (
        <>
          <h3 className="text-lg font-medium mb-2">Nenhuma conversa encontrada</h3>
          <p className="text-muted-foreground mb-6">
            Tente ajustar os critérios de busca ou inicie uma nova conversa.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-2">Sem conversas</h3>
          <p className="text-muted-foreground mb-6">
            Você ainda não tem nenhuma conversa. Inicie uma conversa com outro usuário.
          </p>
        </>
      )}
      
      <Button onClick={openCreateDialog}>
        <Plus className="h-4 w-4 mr-2" />
        Nova conversa
      </Button>
    </div>
  );
}
