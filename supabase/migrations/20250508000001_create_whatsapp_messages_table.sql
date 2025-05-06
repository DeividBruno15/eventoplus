
-- Create bot_messages table para armazenar mensagens enviadas e recebidas via WhatsApp
CREATE TABLE IF NOT EXISTS public.bot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  twilio_message_id TEXT,
  is_auto_reply BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE public.bot_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own messages"
  ON public.bot_messages
  FOR SELECT
  USING (user_id = auth.uid());

-- Add whatsapp_opt_in column to user_profiles if it doesn't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS whatsapp_opt_in BOOLEAN DEFAULT TRUE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS bot_messages_user_id_idx ON public.bot_messages (user_id);
CREATE INDEX IF NOT EXISTS bot_messages_direction_idx ON public.bot_messages (direction);
