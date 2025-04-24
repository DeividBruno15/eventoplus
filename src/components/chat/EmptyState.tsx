
import { ReactNode } from 'react';
import { MessageSquare } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  totalConversations: number;
}

export default function EmptyState({ 
  title = "Nenhuma conversa encontrada",
  description,
  icon = <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />,
  totalConversations 
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      {icon}
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-muted-foreground mb-6">
        {description || (totalConversations === 0 
          ? 'Você ainda não tem nenhuma conversa iniciada.' 
          : 'Nenhuma conversa corresponde à sua busca.')}
      </p>
    </div>
  );
}
