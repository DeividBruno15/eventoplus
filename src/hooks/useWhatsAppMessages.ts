
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { WhatsAppMessage } from '@/types/whatsapp';

export const useWhatsAppMessages = () => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const { user } = useAuth();

  const fetchUserProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('phone_number, whatsapp_opt_in')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setPhoneNumber(data.phone_number);
      setWhatsappEnabled(data.whatsapp_opt_in ?? true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchMessages = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bot_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
      
      // Mark all inbound messages as read
      const unreadIds = data
        ?.filter(msg => msg.direction === 'inbound' && !msg.read)
        .map(msg => msg.id) || [];
      
      if (unreadIds.length > 0) {
        await supabase
          .from('bot_messages')
          .update({ read: true })
          .in('id', unreadIds);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWhatsAppPreference = async () => {
    if (!user?.id) return;
    
    try {
      const newValue = !whatsappEnabled;
      setWhatsappEnabled(newValue);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ whatsapp_opt_in: newValue })
        .eq('id', user.id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating WhatsApp preference:', error);
      setWhatsappEnabled(!whatsappEnabled); // Revert UI on error
      return false;
    }
  };

  const sendMessage = async (message: string): Promise<boolean> => {
    if (!message.trim() || !user?.id || !phoneNumber) return false;

    try {
      // Send the message through our edge function
      const { data, error } = await supabase.functions.invoke('send-whatsapp-notification', {
        body: {
          user_id: user.id,
          phone_number: phoneNumber,
          message
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Falha ao enviar mensagem');
      }

      // Refresh messages
      await fetchMessages();
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
      fetchMessages();
    }
  }, [user]);

  return {
    messages,
    isLoading,
    phoneNumber,
    whatsappEnabled,
    fetchMessages,
    sendMessage,
    toggleWhatsAppPreference
  };
};
