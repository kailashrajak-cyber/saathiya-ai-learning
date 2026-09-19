CREATE TABLE public.saved_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  source TEXT NOT NULL DEFAULT 'workspace',
  title TEXT NOT NULL,
  file_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_outputs TO authenticated;
GRANT ALL ON public.saved_outputs TO service_role;

ALTER TABLE public.saved_outputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own saved outputs"
  ON public.saved_outputs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved outputs"
  ON public.saved_outputs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved outputs"
  ON public.saved_outputs FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved outputs"
  ON public.saved_outputs FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX saved_outputs_user_created_idx ON public.saved_outputs (user_id, created_at DESC);