import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConversationList from '@/components/chat/ConversationList';
import { Conversation } from '@/types/chat';

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
        const { data: conversationIds, error: conversationError } = await supabase
          .rpc('get_user_conversations', { p_user_id: user.id });
          
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
        
        const formattedConversations: Conversation[] = [];
        
        for (const item of conversationIds) {
          try {
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

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Conversas</h1>
        </div>
        
        <ConversationList
          loading={loading}
          conversations={conversations}
          filteredConversations={filteredConversations}
          searchQuery={searchQuery}
          onSearchChange={(value) => setSearchQuery(value)}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
