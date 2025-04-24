
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  read: boolean;
}

interface ConversationParticipant {
  id: string;
  first_name: string;
  last_name: string;
}

const Conversation = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<ConversationParticipant | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !id) {
      navigate('/login');
      return;
    }

    const fetchConversationDetails = async () => {
      try {
        // Verificar se a conversa existe e a estrutura
        const { data: conversation, error: conversationError } = await supabase
          .from('conversations')
          .select('id')
          .eq('id', id)
          .single();
          
        if (conversationError) {
          console.error('Erro ao buscar conversa:', conversationError);
          navigate('/chat');
          return;
        }
        
        // Verificar se o usuário é participante da conversa
        const { data: participants, error: participantsError } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', id);
          
        if (participantsError) {
          console.error('Erro ao buscar participantes:', participantsError);
          navigate('/chat');
          return;
        }
        
        const isParticipant = participants.some(p => p.user_id === user.id);
        if (!isParticipant) {
          console.error('Usuário não é participante desta conversa');
          navigate('/chat');
          return;
        }
        
        // Buscar o outro participante
        const otherParticipant = participants.find(p => p.user_id !== user.id);
        if (!otherParticipant) {
          console.error('Outro participante não encontrado');
          navigate('/chat');
          return;
        }
        
        // Buscar dados do outro usuário
        const { data: otherUserData, error: otherUserError } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name')
          .eq('id', otherParticipant.user_id)
          .single();
          
        if (otherUserError) {
          console.error('Erro ao buscar dados do outro usuário:', otherUserError);
          navigate('/chat');
          return;
        }
        
        setOtherUser(otherUserData);
        
        // Buscar mensagens
        fetchMessages();
      } catch (error) {
        console.error('Erro ao carregar detalhes da conversa:', error);
        navigate('/chat');
      }
    };

    fetchConversationDetails();

    // Configurar subscription para atualização em tempo real
    const channel = supabase
      .channel('conversation_messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `conversation_id=eq.${id}`
        },
        () => fetchMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user, navigate]);

  useEffect(() => {
    // Rolar para o final das mensagens quando novas mensagens são adicionadas
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!id || !user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Erro ao buscar mensagens:', error);
        setMessages([]);
      } else if (data) {
        setMessages(data as Message[]);
        
        // Marcar mensagens não lidas como lidas
        const unreadMessages = data.filter(msg => 
          !msg.read && msg.sender_id !== user.id
        );
        
        if (unreadMessages && unreadMessages.length > 0) {
          await supabase
            .from('chat_messages')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || !id || !otherUser) return;
    
    try {
      setSending(true);
      
      // Enviar nova mensagem
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: id,
          sender_id: user.id,
          receiver_id: otherUser.id,
          message: newMessage.trim(),
          read: false
        });

      if (error) {
        throw error;
      }
      
      // Atualizar timestamp da conversa
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id);
      
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'HH:mm', { locale: ptBR });
  };

  const formatMessageDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return format(date, "dd 'de' MMMM", { locale: ptBR });
    }
  };

  // Agrupar mensagens por data
  const groupMessagesByDate = () => {
    const groups: { date: string, messages: Message[] }[] = [];
    
    messages.forEach(message => {
      const dateStr = new Date(message.created_at).toDateString();
      const existingGroup = groups.find(group => new Date(group.date).toDateString() === dateStr);
      
      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        groups.push({
          date: message.created_at,
          messages: [message]
        });
      }
    });
    
    return groups;
  };

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="container mx-auto px-4 py-4 flex-grow flex flex-col">
        <Card className="flex flex-col flex-grow overflow-hidden">
          {/* Cabeçalho */}
          <div className="p-4 border-b flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/chat')}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            {otherUser && (
              <div className="flex items-center">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  {otherUser.first_name.charAt(0)}
                  {otherUser.last_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">
                    {otherUser.first_name} {otherUser.last_name}
                  </h3>
                </div>
              </div>
            )}
          </div>
          
          {/* Área de mensagens */}
          <div className="flex-grow overflow-y-auto p-4 bg-muted/30">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <p>Nenhuma mensagem ainda.</p>
                <p>Seja o primeiro a enviar uma mensagem!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {groupMessagesByDate().map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <div className="flex justify-center mb-4">
                      <span className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                        {formatMessageDate(group.date)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {group.messages.map((message) => {
                        const isMine = message.sender_id === user?.id;
                        
                        return (
                          <div 
                            key={message.id}
                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[75%] px-4 py-2 rounded-lg break-words ${
                                isMine 
                                  ? 'bg-primary text-primary-foreground rounded-br-none' 
                                  : 'bg-muted rounded-bl-none'
                              }`}
                            >
                              <p className="whitespace-pre-line">{message.message}</p>
                              <div 
                                className={`text-xs mt-1 ${
                                  isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                }`}
                              >
                                {formatMessageTime(message.created_at)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Área de envio de mensagens */}
          <div className="p-4 border-t">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-grow"
                disabled={sending}
              />
              <Button 
                type="submit"
                disabled={!newMessage.trim() || sending}
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Conversation;
