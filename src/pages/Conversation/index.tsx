
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Messages from '@/components/chat/Messages';
import MessageInput from '@/components/chat/MessageInput';
import ConversationHeader from '@/components/chat/ConversationHeader';
import type { Message } from '@/types/chat';

export default function Conversation() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<{ first_name: string; last_name: string; } | null>(null);

  useEffect(() => {
    if (!user || !id) {
      navigate('/login');
      return;
    }

    const fetchConversationDetails = async () => {
      try {
        // Verify conversation exists and structure
        const { data: conversation } = await supabase
          .from('conversations')
          .select('id')
          .eq('id', id)
          .single();
          
        if (!conversation) {
          navigate('/chat');
          return;
        }
        
        // Get conversation participants
        const { data: participants } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', id);
          
        if (!participants?.length) {
          navigate('/chat');
          return;
        }
        
        const isParticipant = participants.some(p => p.user_id === user.id);
        if (!isParticipant) {
          navigate('/chat');
          return;
        }
        
        // Get other participant's details
        const otherParticipant = participants.find(p => p.user_id !== user.id);
        if (!otherParticipant) {
          navigate('/chat');
          return;
        }
        
        const { data: otherUserData } = await supabase
          .from('user_profiles')
          .select('first_name, last_name')
          .eq('id', otherParticipant.user_id)
          .single();
          
        if (otherUserData) {
          setOtherUser(otherUserData);
        }
        
        // Fetch messages
        fetchMessages();
      } catch (error) {
        console.error('Error loading conversation details:', error);
        navigate('/chat');
      }
    };

    fetchConversationDetails();

    // Set up real-time subscription
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

  const fetchMessages = async () => {
    if (!id || !user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        setMessages(data);
        
        // Mark unread messages as read
        const unreadMessages = data.filter(msg => 
          !msg.read && msg.sender_id !== user.id
        );
        
        if (unreadMessages?.length > 0) {
          await supabase
            .from('chat_messages')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!id || !user || !otherUser) return;
    
    // Get receiver_id from participants
    const { data: participants } = await supabase
      .from('conversation_participants')
      .select('user_id')
      .eq('conversation_id', id);
      
    const receiver = participants?.find(p => p.user_id !== user.id);
    if (!receiver) return;
    
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: id,
        sender_id: user.id,
        receiver_id: receiver.user_id,
        message: message,
        read: false
      });
      
    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', id);
  };

  if (!otherUser) {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
        <div className="container mx-auto px-4 py-4 flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="container mx-auto px-4 py-4 flex-grow flex flex-col">
        <Card className="flex flex-col flex-grow overflow-hidden">
          <ConversationHeader 
            otherUserName={`${otherUser.first_name} ${otherUser.last_name}`}
            otherUserInitials={`${otherUser.first_name.charAt(0)}${otherUser.last_name.charAt(0)}`}
          />
          
          {loading ? (
            <div className="flex-grow flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Messages messages={messages} currentUserId={user.id} />
          )}
          
          <MessageInput onSendMessage={sendMessage} disabled={loading} />
        </Card>
      </div>
      <Footer />
    </div>
  );
}
