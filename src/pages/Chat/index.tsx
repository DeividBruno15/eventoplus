
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Search, MessageSquare } from 'lucide-react';

interface Conversation {
  id: string;
  updated_at: string;
  otherUser: {
    id: string;
    first_name: string;
    last_name: string;
  };
  lastMessage: {
    message: string;
    created_at: string;
    is_read: boolean;
    is_mine: boolean;
  } | null;
}

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchConversations = async () => {
      try {
        // Buscar todas as conversas onde o usuário é participante
        const { data: participations, error: participationsError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id);
          
        if (participationsError) throw participationsError;
        
        if (!participations || participations.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }
        
        const conversationIds = participations.map(p => p.conversation_id);
        
        // Buscar detalhes das conversas
        const { data: conversationsData, error: conversationsError } = await supabase
          .from('conversations')
          .select('id, updated_at')
          .in('id', conversationIds)
          .order('updated_at', { ascending: false });
          
        if (conversationsError) throw conversationsError;
        
        // Para cada conversa, buscar o outro participante e a última mensagem
        const conversationsWithDetails = await Promise.all(
          (conversationsData || []).map(async (conv) => {
            // Buscar o outro participante
            const { data: otherParticipants, error: participantsError } = await supabase
              .from('conversation_participants')
              .select('user_id')
              .eq('conversation_id', conv.id)
              .neq('user_id', user.id);
              
            if (participantsError) throw participantsError;
            
            if (!otherParticipants || otherParticipants.length === 0) {
              return null; // Conversa sem outro participante, ignorar
            }
            
            const otherUserId = otherParticipants[0].user_id;
            
            // Buscar dados do outro usuário
            const { data: otherUserData, error: otherUserError } = await supabase
              .from('user_profiles')
              .select('id, first_name, last_name')
              .eq('id', otherUserId)
              .single();
              
            if (otherUserError) throw otherUserError;
            
            // Buscar última mensagem
            const { data: messages, error: messagesError } = await supabase
              .from('chat_messages')
              .select('message, created_at, sender_id, read')
              .eq('conversation_id', conv.id)
              .order('created_at', { ascending: false })
              .limit(1);
              
            if (messagesError) throw messagesError;
            
            let lastMessage = null;
            if (messages && messages.length > 0) {
              lastMessage = {
                message: messages[0].message,
                created_at: messages[0].created_at,
                is_read: messages[0].read,
                is_mine: messages[0].sender_id === user.id
              };
            }
            
            return {
              id: conv.id,
              updated_at: conv.updated_at,
              otherUser: otherUserData,
              lastMessage
            };
          })
        );
        
        // Filtrar conversas nulas e atualizar estado
        setConversations(conversationsWithDetails.filter(Boolean) as Conversation[]);
      } catch (error) {
        console.error('Erro ao carregar conversas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Configurar subscription para atualização em tempo real
    const channel = supabase
      .channel('chat_updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        () => fetchConversations()
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'conversations' },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    
    const fullName = `${conv.otherUser.first_name} ${conv.otherUser.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    
    // Se for hoje, mostrar apenas a hora
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Se for nos últimos 7 dias, mostrar o dia da semana
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Caso contrário, mostrar a data
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Conversas</h1>
        </div>
        
        <Card className="overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar conversas"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">Nenhuma conversa encontrada</h3>
              <p className="text-muted-foreground mb-6">
                {conversations.length === 0 
                  ? 'Você ainda não tem nenhuma conversa iniciada.' 
                  : 'Nenhuma conversa corresponde à sua busca.'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredConversations.map((conv) => (
                <Button
                  key={conv.id}
                  variant="ghost"
                  className="w-full justify-start px-4 py-6 h-auto hover:bg-muted/50"
                  onClick={() => navigate(`/chat/${conv.id}`)}
                >
                  <div className="flex items-start w-full">
                    <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                      {conv.otherUser.first_name.charAt(0)}
                      {conv.otherUser.last_name.charAt(0)}
                    </div>
                    
                    <div className="ml-4 flex-grow overflow-hidden">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-sm">
                          {conv.otherUser.first_name} {conv.otherUser.last_name}
                        </span>
                        {conv.lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conv.lastMessage.created_at)}
                          </span>
                        )}
                      </div>
                      
                      {conv.lastMessage ? (
                        <p className={`text-sm truncate ${!conv.lastMessage.is_read && !conv.lastMessage.is_mine ? 'font-medium' : 'text-muted-foreground'}`}>
                          {conv.lastMessage.is_mine && 'Você: '}
                          {conv.lastMessage.message}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          Nenhuma mensagem
                        </p>
                      )}
                    </div>
                    
                    {conv.lastMessage && !conv.lastMessage.is_read && !conv.lastMessage.is_mine && (
                      <div className="bg-primary rounded-full w-2 h-2 flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          )}
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
