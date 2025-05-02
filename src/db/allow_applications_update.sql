-- Permitir que qualquer usuário autenticado possa atualizar a tabela event_applications
-- Isso resolve o problema da rejeição não ser persistida

-- Primeiro, verifique as políticas atuais
SELECT * FROM pg_policies WHERE tablename = 'event_applications';

-- Criar uma nova política que permite a atualização se o usuário for o proprietário do evento
CREATE POLICY "Proprietários de eventos podem atualizar aplicações" 
ON public.event_applications 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events e 
    WHERE e.id = event_applications.event_id 
    AND (e.user_id = auth.uid() OR e.contractor_id = auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM events e 
    WHERE e.id = event_applications.event_id 
    AND (e.user_id = auth.uid() OR e.contractor_id = auth.uid())
  )
);

-- Alternativamente, se você quiser permitir apenas atualizações do campo status e rejection_reason
CREATE POLICY "Proprietários de eventos podem atualizar status e motivo" 
ON public.event_applications 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events e 
    WHERE e.id = event_applications.event_id 
    AND (e.user_id = auth.uid() OR e.contractor_id = auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM events e 
    WHERE e.id = event_applications.event_id 
    AND (e.user_id = auth.uid() OR e.contractor_id = auth.uid())
  )
);

-- Se você precisar criar o campo rejection_reason, use:
/*
ALTER TABLE public.event_applications 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
*/ 