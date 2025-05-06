
-- Create payment_refunds table
CREATE TABLE IF NOT EXISTS public.payment_refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_refund_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Impede múltiplos reembolsos completos para o mesmo pagamento
  CONSTRAINT unique_payment_refund UNIQUE (payment_id, stripe_refund_id)
);

-- Enable Row Level Security
ALTER TABLE public.payment_refunds ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view their own refunds"
  ON public.payment_refunds
  FOR SELECT
  USING (user_id = auth.uid());
  
CREATE POLICY "Authenticated users can create refunds"
  ON public.payment_refunds
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS payment_refunds_payment_id_idx ON public.payment_refunds (payment_id);
CREATE INDEX IF NOT EXISTS payment_refunds_user_id_idx ON public.payment_refunds (user_id);

-- Adicionar função para verificar se um pagamento pode receber reembolso
CREATE OR REPLACE FUNCTION public.can_refund_payment(payment_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  payment_record RECORD;
  refund_count INTEGER;
BEGIN
  -- Buscar registro do pagamento
  SELECT * INTO payment_record
  FROM public.payments
  WHERE id = payment_id_param;
  
  -- Se o pagamento não existir ou não estiver com status "succeeded", não pode ser reembolsado
  IF payment_record IS NULL OR payment_record.status != 'succeeded' THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar se já existe um reembolso total para este pagamento
  SELECT COUNT(*) INTO refund_count
  FROM public.payment_refunds
  WHERE payment_id = payment_id_param AND amount >= payment_record.amount;
  
  -- Se não houver reembolso total, pode ser reembolsado
  RETURN refund_count = 0;
END;
$$;

-- Adicionar uma coluna para notificações automáticas de reembolso
ALTER TABLE public.payment_refunds 
ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT FALSE;

-- Adicionar um campo para indicar se foi um reembolso parcial
ALTER TABLE public.payment_refunds
ADD COLUMN IF NOT EXISTS is_partial BOOLEAN DEFAULT FALSE;

