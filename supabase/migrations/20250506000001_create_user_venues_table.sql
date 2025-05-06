
-- Create user_venues table
CREATE TABLE IF NOT EXISTS public.user_venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  zipcode TEXT NOT NULL,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up RLS policies
ALTER TABLE public.user_venues ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select their own venues
CREATE POLICY select_own_venues
  ON public.user_venues
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own venues
CREATE POLICY insert_own_venues
  ON public.user_venues
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own venues
CREATE POLICY update_own_venues
  ON public.user_venues
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own venues
CREATE POLICY delete_own_venues
  ON public.user_venues
  FOR DELETE
  USING (auth.uid() = user_id);
