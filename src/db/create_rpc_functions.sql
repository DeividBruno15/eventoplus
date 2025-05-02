-- Função RPC para rejeitar uma candidatura
-- Essa função será chamada se o método direto falhar
CREATE OR REPLACE FUNCTION public.reject_application(application_id uuid, rejection_text text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    event_owner_id uuid;
    current_user_id uuid := auth.uid();
BEGIN
    -- Verificar se o usuário atual é o dono do evento
    SELECT e.user_id, e.contractor_id INTO event_owner_id
    FROM public.event_applications a
    JOIN public.events e ON a.event_id = e.id
    WHERE a.id = application_id;
    
    -- Se o usuário atual é o dono do evento, permitir a atualização
    IF event_owner_id = current_user_id THEN
        UPDATE public.event_applications
        SET 
            status = 'rejected',
            rejection_reason = rejection_text,
            updated_at = now()
        WHERE id = application_id;
        
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$;

-- Função RPC mais agressiva para forçar a atualização do status
-- Use como último recurso
CREATE OR REPLACE FUNCTION public.force_update_application_status(app_id uuid, new_status text, reason_text text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Esta função ignora permissões pois é SECURITY DEFINER
    -- Apenas use em último caso quando os outros métodos falharem
    
    UPDATE public.event_applications
    SET 
        status = new_status,
        rejection_reason = CASE 
                            WHEN new_status = 'rejected' THEN reason_text
                            ELSE rejection_reason
                           END,
        updated_at = now()
    WHERE id = app_id;
    
    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$;

-- Garantir que a tabela de log exista
CREATE TABLE IF NOT EXISTS public.event_rejection_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id uuid NOT NULL,
    provider_id uuid NOT NULL,
    event_id uuid NOT NULL,
    rejected_by uuid,
    rejection_date timestamp with time zone DEFAULT now(),
    reason text,
    applied_to_main_table boolean DEFAULT false
);

-- Permitir inserções na tabela de logs para usuários autenticados
ALTER TABLE public.event_rejection_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserções de rejeições por usuários autenticados"
ON public.event_rejection_log
FOR INSERT
TO authenticated
WITH CHECK (true); 