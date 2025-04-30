
-- Function to create a conversation between two users or return an existing one
CREATE OR REPLACE FUNCTION public.create_or_get_conversation(user_id_one UUID, user_id_two UUID)
RETURNS TABLE(id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_conversation_id UUID;
BEGIN
  -- Check if a conversation already exists between these two users
  SELECT c.id INTO v_conversation_id
  FROM conversations c
  JOIN conversation_participants cp1 ON cp1.conversation_id = c.id
  JOIN conversation_participants cp2 ON cp2.conversation_id = c.id
  WHERE cp1.user_id = user_id_one
    AND cp2.user_id = user_id_two
  LIMIT 1;
  
  -- If no conversation exists, create a new one
  IF v_conversation_id IS NULL THEN
    -- Create a new conversation
    INSERT INTO conversations (created_at, updated_at)
    VALUES (now(), now())
    RETURNING id INTO v_conversation_id;
    
    -- Add both users as participants
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES (v_conversation_id, user_id_one), (v_conversation_id, user_id_two);
  END IF;
  
  -- Return the conversation ID (either existing or newly created)
  RETURN QUERY SELECT v_conversation_id;
END;
$$;
