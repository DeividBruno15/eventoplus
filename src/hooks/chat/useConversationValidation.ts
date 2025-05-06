
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function useConversationValidation(conversationId: string, userId: string | undefined) {
  const [otherUser, setOtherUser] = useState<{ first_name: string; last_name: string; } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper function to check if id is a valid UUID
  const isValidUUID = (id: string) => {
    if (!id) return false;
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(id);
  };

  // For demo/mock conversations with numeric IDs
  const getMockConversation = (id: string) => {
    const userIdVal = userId || 'current-user';
    
    // Only create mock data if we explicitly have a temporary ID format
    if (id.startsWith('new-')) {
      // Extract the name from the ID or use a default
      const nameParts = id.split('-');
      const firstName = nameParts.length > 2 ? nameParts[1] : 'Unnamed';
      const lastName = nameParts.length > 3 ? nameParts[2] : 'User';
      
      return {
        otherUser: { first_name: firstName, last_name: lastName },
        messages: []
      };
    }
    
    return null;
  };

  const verifyConversation = async (fetchMessagesCallback: () => Promise<void>) => {
    console.log('Verificando conversa', conversationId, userId);
    
    try {
      if (!userId) {
        console.log('Usuário não autenticado, redirecionando para login');
        navigate('/login');
        return;
      }
      
      // For temporary conversations, use mock data
      if (!isValidUUID(conversationId)) {
        console.log('ID temporário, usando dados mockados');
        const mockData = getMockConversation(conversationId);
        if (mockData) {
          setOtherUser(mockData.otherUser);
          await fetchMessagesCallback();
          return;
        }
        
        // If no mock data found, navigate to chat
        navigate('/chat');
        toast({
          title: "Conversa não encontrada",
          description: "A conversa solicitada não existe",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Verificando conversa no banco de dados:', conversationId);
      
      // For real data, verify conversation exists and structure
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', conversationId)
        .single();
        
      if (conversationError || !conversation) {
        console.error('Erro ao buscar conversa:', conversationError);
        navigate('/chat');
        toast({
          title: "Conversa não encontrada",
          description: "A conversa solicitada não existe",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Conversa encontrada, verificando participantes');
      
      // Get conversation participants
      const { data: participants, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId);
        
      if (participantsError || !participants?.length) {
        console.error('Erro ao buscar participantes:', participantsError);
        navigate('/chat');
        toast({
          title: "Conversa inválida",
          description: "Esta conversa não tem participantes",
          variant: "destructive"
        });
        return;
      }
      
      const isParticipant = participants.some(p => p.user_id === userId);
      if (!isParticipant) {
        console.log('Usuário não é participante da conversa');
        navigate('/chat');
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta conversa",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Usuário é participante, buscando outro participante');
      
      // Get other participant's details
      const otherParticipant = participants.find(p => p.user_id !== userId);
      if (!otherParticipant) {
        console.log('Outro participante não encontrado');
        navigate('/chat');
        return;
      }
      
      console.log('Buscando dados do outro usuário:', otherParticipant.user_id);
      
      const { data: otherUserData, error: userError } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('id', otherParticipant.user_id)
        .single();
        
      if (userError) {
        console.error('Erro ao buscar dados do outro usuário:', userError);
      }
      
      if (otherUserData) {
        console.log('Dados do outro usuário encontrados:', otherUserData);
        setOtherUser(otherUserData);
      } else {
        console.log('Dados do outro usuário não encontrados');
      }
      
      // Fetch messages
      console.log('Buscando mensagens');
      await fetchMessagesCallback();
    } catch (error) {
      console.error('Erro ao verificar conversa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes da conversa",
        variant: "destructive"
      });
      navigate('/chat');
    }
  };

  return {
    otherUser,
    verifyConversation
  };
}
