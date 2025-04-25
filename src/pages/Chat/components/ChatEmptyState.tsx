
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export const ChatEmptyState = () => {
  return (
    <Card className="lg:col-span-2 h-[calc(100vh-15rem)] flex flex-col">
      <div className="flex items-center justify-center h-20 text-muted-foreground p-6">
        <div className="text-center">
          <MessageSquare className="h-10 w-10 mx-auto mb-2" />
          Selecione uma conversa para começar
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-center">
        <div>
          <p>Nenhuma conversa selecionada.</p>
          <p>Clique em uma conversa da lista ou inicie uma nova.</p>
        </div>
      </div>
    </Card>
  );
};
