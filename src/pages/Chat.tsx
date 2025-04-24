
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chat = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Chat</h2>
        <p className="text-muted-foreground mt-2">
          Comunique-se com outros usuários da plataforma.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Conversas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Conteúdo da página de Chat</p>
          <p className="text-muted-foreground">
            Esta é a página de chat onde você pode conversar com outros usuários.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
