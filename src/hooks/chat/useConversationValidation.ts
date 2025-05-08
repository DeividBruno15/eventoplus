
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OtherUserType {
  id: string;
  first_name: string;
  last_name: string | null;
}

export const useConversationValidation = (conversationId: string, userId?: string) => {
  const [otherUser, setOtherUser] = useState<OtherUserType | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  
  // Função para verificar se a conversa existe e se o usuário tem permissão para acessá-la
  const verifyConversation = async (onValid?: () => Promise<void>) => {
    if (!userId || !conversationId) return false;
    
    console.log('Verificando conversa:', conversationId, 'para usuário:', userId);
    
    try {
      // Verificar se a conversa existe e se o usuário atual é participante
      const { data: participants, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId);
      
      if (participantsError) {
        console.error('Erro ao verificar participantes:', participantsError);
        setIsValid(false);
        return false;
      }
      
      const userIds = participants.map(p => p.user_id);
      const userIsParticipant = userIds.includes(userId);
      
      if (!userIsParticipant) {
        console.error('Usuário não é participante desta conversa');
        setIsValid(false);
        return false;
      }
      
      // Encontrar o outro participante da conversa
      const otherUserId = userIds.find(id => id !== userId);
      
      if (otherUserId) {
        // Buscar detalhes do outro usuário
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name')
          .eq('id', otherUserId)
          .single();
        
        if (userError) {
          console.error('Erro ao buscar detalhes do outro usuário:', userError);
        } else {
          setOtherUser(userData as OtherUserType);
        }
      }
      
      setIsValid(true);
      
      // Executar callback se fornecido
      if (onValid) {
        await onValid();
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao verificar conversa:', error);
      setIsValid(false);
      return false;
    }
  };

  useEffect(() => {
    if (userId && conversationId) {
      verifyConversation();
    }
  }, [userId, conversationId]);

  return { otherUser, isValid, verifyConversation };
};
