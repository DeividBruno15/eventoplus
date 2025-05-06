
-- Create ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Um usuário não pode avaliar a mesma pessoa mais de uma vez para o mesmo evento
  CONSTRAINT unique_user_reviewer_event UNIQUE (user_id, reviewer_id, event_id),
  
  -- Um usuário não pode se avaliar a si mesmo
  CONSTRAINT no_self_rating CHECK (user_id <> reviewer_id)
);

-- Enable Row Level Security
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view ratings"
  ON public.ratings
  FOR SELECT
  USING (true);
  
CREATE POLICY "Authenticated users can create ratings"
  ON public.ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = auth.uid() -- Apenas o próprio revisor pode criar suas avaliações
  );
  
CREATE POLICY "Users can update their own ratings"
  ON public.ratings
  FOR UPDATE
  TO authenticated
  USING (reviewer_id = auth.uid())
  WITH CHECK (reviewer_id = auth.uid());
  
CREATE POLICY "Users can delete their own ratings"
  ON public.ratings
  FOR DELETE
  TO authenticated
  USING (reviewer_id = auth.uid());

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS ratings_user_id_idx ON public.ratings (user_id);
CREATE INDEX IF NOT EXISTS ratings_reviewer_id_idx ON public.ratings (reviewer_id);
CREATE INDEX IF NOT EXISTS ratings_event_id_idx ON public.ratings (event_id);

-- Criar função para calcular classificação média
CREATE OR REPLACE FUNCTION public.get_user_average_rating(user_id_param UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
  avg_rating NUMERIC;
BEGIN
  SELECT COALESCE(AVG(rating), 0)
  INTO avg_rating
  FROM public.ratings
  WHERE user_id = user_id_param;
  
  RETURN avg_rating;
END;
$$;
