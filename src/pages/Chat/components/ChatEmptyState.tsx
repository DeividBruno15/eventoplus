
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatEmptyStateProps {
  onNewMessage?: () => void;
}

export function ChatEmptyState({ onNewMessage }: ChatEmptyStateProps) {
  const navigate = useNavigate();

  const handleNewMessage = () => {
    if (onNewMessage) {
      onNewMessage();
    } else {
      navigate('/chat');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="bg-primary/10 p-4 rounded-full mb-6">
          <MessageSquarePlus className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-3">Suas mensagens</h2>
        <p className="text-muted-foreground mb-6">
          Comece uma conversa com prestadores de serviços ou veja suas mensagens anteriores
        </p>
        <Button onClick={handleNewMessage} className="flex items-center gap-2">
          <MessageSquarePlus className="h-4 w-4" />
          Nova mensagem
        </Button>
      </div>
    </div>
  );
}
