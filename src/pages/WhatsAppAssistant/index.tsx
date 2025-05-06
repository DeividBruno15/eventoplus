
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Send, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WhatsAppMessage } from '@/types/whatsapp';
import { useWhatsAppMessages } from '@/hooks/useWhatsAppMessages';

const WhatsAppAssistant = () => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use our custom hook
  const { 
    messages, 
    isLoading, 
    phoneNumber, 
    whatsappEnabled,
    sendMessage, 
    toggleWhatsAppPreference 
  } = useWhatsAppMessages();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      // Optimistic update for better UX
      const optimisticMsg: WhatsAppMessage = {
        id: `temp-${Date.now()}`,
        user_id: 'temp',
        message: newMessage,
        direction: 'outbound',
        created_at: new Date().toISOString(),
        read: true,
        sending: true
      };
      
      setNewMessage('');

      const success = await sendMessage(newMessage);
      
      if (!success) {
        throw new Error('Falha ao enviar mensagem');
      }
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso via WhatsApp",
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Não foi possível enviar sua mensagem. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleWhatsApp = async () => {
    const success = await toggleWhatsAppPreference();
    
    if (success) {
      toast({
        title: whatsappEnabled ? "WhatsApp desativado" : "WhatsApp ativado",
        description: whatsappEnabled 
          ? "Você não receberá mais notificações via WhatsApp" 
          : "Você receberá notificações via WhatsApp",
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar sua preferência de WhatsApp",
        variant: "destructive",
      });
    }
  };

  const formatMessageDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { 
        addSuffix: true,
        locale: ptBR
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Assistente WhatsApp</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-[70vh] flex flex-col">
            <CardHeader>
              <CardTitle>Mensagens</CardTitle>
              <CardDescription>Todas as suas conversas via WhatsApp</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden p-0">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-4">
                  <div className="bg-muted rounded-full p-4 mb-4">
                    <Send className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Nenhuma mensagem</h3>
                  <p className="text-center text-muted-foreground max-w-md">
                    Inicie uma conversa enviando uma mensagem. Nosso assistente responderá via WhatsApp.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-full px-4">
                  <div className="space-y-4 py-4">
                    {messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] px-4 py-2 rounded-lg ${
                            message.direction === 'outbound' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary'
                          } ${message.sending ? 'opacity-70' : ''}`}
                        >
                          <p>{message.message}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className={`text-xs ${message.direction === 'outbound' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                              {formatMessageDate(message.created_at)}
                            </span>
                            {message.is_auto_reply && (
                              <span className="text-xs ml-2 bg-primary-foreground/20 px-1 rounded text-primary-foreground">Auto</span>
                            )}
                            {message.sending && (
                              <span className="text-xs ml-2 animate-pulse">enviando...</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              )}
            </CardContent>
            
            <CardFooter className="pt-2">
              <form onSubmit={handleSendMessage} className="w-full flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                  disabled={isSending || !whatsappEnabled || !phoneNumber}
                />
                <Button type="submit" disabled={isSending || !newMessage.trim() || !whatsappEnabled || !phoneNumber}>
                  {isSending ? (
                    <div className="h-4 w-4 border-t-2 border-r-2 rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="whatsapp-notifications"
                  checked={whatsappEnabled} 
                  onCheckedChange={handleToggleWhatsApp}
                />
                <Label htmlFor="whatsapp-notifications">Receber notificações por WhatsApp</Label>
              </div>
              
              {!phoneNumber && (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Você precisa adicionar um número de telefone ao seu perfil para usar o WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-sm mb-1">Seu número</h3>
                <p className="text-muted-foreground">
                  {phoneNumber || 'Nenhum número cadastrado'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sobre o WhatsApp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                Nossa integração com WhatsApp permite que você receba notificações importantes
                diretamente no seu telefone.
              </p>
              <p>
                Você receberá mensagens sobre:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Novos eventos</li>
                <li>Aprovação de aplicações</li>
                <li>Pagamentos processados</li>
                <li>Novas avaliações</li>
                <li>Mensagens diretas</li>
              </ul>
              <p className="text-muted-foreground">
                Você pode desativar as notificações a qualquer momento usando o botão acima.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppAssistant;
