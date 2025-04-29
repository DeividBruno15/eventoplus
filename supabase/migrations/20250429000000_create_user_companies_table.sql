
-- Create the user_companies table
CREATE TABLE IF NOT EXISTS public.user_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  zipcode TEXT NOT NULL,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.user_companies ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to manage their own companies
CREATE POLICY "Users can manage their own companies"
  ON public.user_companies
  USING (auth.uid() = user_id);

-- Add the table to the public API
GRANT ALL ON public.user_companies TO authenticated;
GRANT ALL ON public.user_companies TO service_role;
