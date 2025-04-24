
import { MessageSquare } from 'lucide-react';

interface EmptyStateProps {
  totalConversations: number;
}

export default function EmptyState({ totalConversations }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-1">Nenhuma conversa encontrada</h3>
      <p className="text-muted-foreground mb-6">
        {totalConversations === 0 
          ? 'Você ainda não tem nenhuma conversa iniciada.' 
          : 'Nenhuma conversa corresponde à sua busca.'}
      </p>
    </div>
  );
}
