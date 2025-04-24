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

// Definindo os tipos adequadamente para contornar problemas de tipagem
interface User {
  id: string;
  first_name: string;
  last_name: string;
}

interface Message {
  message: string;
  created_at: string;
  read: boolean;
  sender_id: string;
}

interface Conversation {
  id: string;
  updated_at: string;
  otherUser: User;
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
        // Buscar todas as conversas onde o usuário é participante usando RPC
        const { data: conversationIds, error: conversationError } = await supabase
          .rpc('get_user_conversations', { p_user_id: user.id });
          
        // Handle caso RPC não exista ainda
        if (conversationError) {
          console.error('Erro ao buscar conversas:', conversationError);
          setConversations([]);
          setLoading(false);
          return;
        }
        
        if (!conversationIds || conversationIds.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }
        
        // Criar array de conversas formatadas
        const formattedConversations: Conversation[] = [];
        
        // Processa cada conversa individualmente
        for (const item of conversationIds) {
          try {
            // Buscar detalhes da conversa usando RPC
            const { data: convData, error: detailsError } = await supabase
              .rpc('get_conversation_details', { 
                p_conversation_id: item.conversation_id, 
                p_user_id: user.id 
              });
              
            if (detailsError || !convData || convData.length === 0) {
              console.error('Erro ao buscar detalhes da conversa:', detailsError);
              continue;
            }
            
            const conversationDetails = convData[0];
            
            // Formatar os dados para o tipo esperado
            formattedConversations.push({
              id: item.conversation_id,
              updated_at: conversationDetails.updated_at || new Date().toISOString(),
              otherUser: {
                id: conversationDetails.other_user_id,
                first_name: conversationDetails.other_user_first_name || 'Usuário',
                last_name: conversationDetails.other_user_last_name || ''
              },
              lastMessage: conversationDetails.last_message ? {
                message: conversationDetails.last_message,
                created_at: conversationDetails.last_message_time || new Date().toISOString(),
                is_read: conversationDetails.is_read || false,
                is_mine: conversationDetails.is_sender === user.id
              } : null
            });
          } catch (err) {
            console.error(`Erro ao processar conversa ${item.conversation_id}:`, err);
          }
        }
        
        // Ordenar por data de atualização mais recente
        formattedConversations.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        
        setConversations(formattedConversations);
      } catch (error) {
        console.error('Erro ao carregar conversas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Configurar subscription para atualização em tempo real
    const channel = supabase.channel('custom-channel-name')
      .on('broadcast', { event: 'chat_update' }, () => {
        fetchConversations();
      })
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
