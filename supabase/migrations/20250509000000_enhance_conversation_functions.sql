
-- Função para criar ou obter uma conversa entre dois usuários
CREATE OR REPLACE FUNCTION public.create_or_get_conversation(user_id_one uuid, user_id_two uuid)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
    conversation_id UUID;
BEGIN
    -- Verificar se já existe uma conversa entre os dois usuários
    SELECT c.id INTO conversation_id
    FROM conversations c
    JOIN conversation_participants cp1 ON cp1.conversation_id = c.id
    JOIN conversation_participants cp2 ON cp2.conversation_id = c.id
    WHERE cp1.user_id = user_id_one
      AND cp2.user_id = user_id_two
      AND cp1.conversation_id = cp2.conversation_id
    LIMIT 1;
    
    -- Se não encontrar, criar uma nova conversa
    IF conversation_id IS NULL THEN
        -- Inserir nova conversa
        INSERT INTO conversations (created_at, updated_at)
        VALUES (now(), now())
        RETURNING id INTO conversation_id;
        
        -- Adicionar os participantes
        INSERT INTO conversation_participants (conversation_id, user_id)
        VALUES 
            (conversation_id, user_id_one),
            (conversation_id, user_id_two);
    END IF;
    
    RETURN conversation_id;
END;
$$;

-- Adicionar um gatilho para atualizar o timestamp da conversa quando uma mensagem é enviada
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations
    SET updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Verificar se o trigger já existe antes de criar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'update_conversation_timestamp_trigger'
    ) THEN
        CREATE TRIGGER update_conversation_timestamp_trigger
        AFTER INSERT ON chat_messages
        FOR EACH ROW
        EXECUTE FUNCTION update_conversation_timestamp();
    END IF;
END $$;
