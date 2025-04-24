

-- Função para buscar as conversas de um usuário
CREATE OR REPLACE FUNCTION public.get_user_conversations(p_user_id UUID)
RETURNS TABLE (conversation_id UUID) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT cp.conversation_id
  FROM conversation_participants cp
  WHERE cp.user_id = p_user_id;
END;
$$;

-- Função para buscar detalhes de uma conversa
CREATE OR REPLACE FUNCTION public.get_conversation_details(p_conversation_id UUID, p_user_id UUID)
RETURNS TABLE (
  updated_at TIMESTAMPTZ,
  other_user_id UUID,
  other_user_first_name TEXT,
  other_user_last_name TEXT,
  last_message TEXT,
  last_message_time TIMESTAMPTZ,
  is_read BOOLEAN,
  is_sender UUID
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_other_user_id UUID;
BEGIN
  -- Encontrar o outro usuário da conversa
  SELECT cp.user_id INTO v_other_user_id
  FROM conversation_participants cp
  WHERE cp.conversation_id = p_conversation_id
    AND cp.user_id != p_user_id
  LIMIT 1;

  -- Retornar detalhes da conversa
  RETURN QUERY
  SELECT 
    c.updated_at,
    v_other_user_id as other_user_id,
    up.first_name as other_user_first_name,
    up.last_name as other_user_last_name,
    m.message as last_message,
    m.created_at as last_message_time,
    m.read as is_read,
    m.sender_id as is_sender
  FROM conversations c
  LEFT JOIN user_profiles up ON up.id = v_other_user_id
  LEFT JOIN (
    SELECT DISTINCT ON (conversation_id)
      conversation_id, message, created_at, sender_id, read
    FROM chat_messages
    WHERE conversation_id = p_conversation_id
    ORDER BY conversation_id, created_at DESC
  ) m ON m.conversation_id = c.id
  WHERE c.id = p_conversation_id;
END;
$$;

