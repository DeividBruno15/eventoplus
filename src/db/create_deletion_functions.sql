-- Função RPC para garantir que a tabela de log exista
CREATE OR REPLACE FUNCTION public.ensure_rejection_log_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Criar tabela de rejeições se não existir
    CREATE TABLE IF NOT EXISTS public.event_rejections (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        application_id uuid NOT NULL,
        provider_id uuid NOT NULL,
        event_id uuid NOT NULL,
        rejected_by uuid,
        rejection_date timestamp with time zone DEFAULT now(),
        reason text,
        application_data jsonb
    );
    
    -- Garantir que a tabela tenha RLS habilitado
    ALTER TABLE public.event_rejections ENABLE ROW LEVEL SECURITY;
    
    -- Criar política para permitir inserções de usuários autenticados
    BEGIN
        CREATE POLICY "Permitir inserções de rejeições por usuários autenticados"
        ON public.event_rejections
        FOR INSERT
        TO authenticated
        WITH CHECK (true);
    EXCEPTION WHEN OTHERS THEN
        NULL; -- Ignorar erros se a política já existir
    END;
    
    -- Criar política para permitir leitura de usuários autenticados
    BEGIN
        CREATE POLICY "Permitir leitura de rejeições por usuários autenticados"
        ON public.event_rejections
        FOR SELECT
        TO authenticated
        USING (true);
    EXCEPTION WHEN OTHERS THEN
        NULL; -- Ignorar erros se a política já existir
    END;
END;
$$;

-- Função RPC para excluir uma candidatura
CREATE OR REPLACE FUNCTION public.delete_application(app_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    event_owner_id uuid;
    event_contractor_id uuid;
    current_user_id uuid := auth.uid();
BEGIN
    -- Verificar se o usuário atual é dono ou contratante do evento
    SELECT e.user_id, e.contractor_id 
    INTO event_owner_id, event_contractor_id
    FROM public.event_applications a
    JOIN public.events e ON a.event_id = e.id
    WHERE a.id = app_id;
    
    -- Se o usuário atual é dono ou contratante do evento, permitir a exclusão
    IF current_user_id = event_owner_id OR current_user_id = event_contractor_id THEN
        DELETE FROM public.event_applications
        WHERE id = app_id;
        
        RETURN true;
    ELSE
        -- Se não for dono ou contratante, verificar se é o próprio prestador
        IF EXISTS (
            SELECT 1 FROM public.event_applications 
            WHERE id = app_id AND provider_id = current_user_id
        ) THEN
            DELETE FROM public.event_applications
            WHERE id = app_id;
            
            RETURN true;
        ELSE
            RETURN false;
        END IF;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$;

-- Função de emergência para forçar a exclusão de uma candidatura (usar apenas como último recurso)
CREATE OR REPLACE FUNCTION public.force_delete_application(app_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Esta função ignora permissões pois é SECURITY DEFINER
    -- Apenas use em último caso quando os outros métodos falharem
    
    DELETE FROM public.event_applications
    WHERE id = app_id;
    
    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$; 