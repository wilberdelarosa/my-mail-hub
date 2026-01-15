-- Create telegram_sessions table for bot conversation state
CREATE TABLE public.telegram_sessions (
  chat_id BIGINT PRIMARY KEY,
  state TEXT NOT NULL DEFAULT 'idle',
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.telegram_sessions ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (bot uses service role)
CREATE POLICY "Service role has full access to telegram_sessions"
ON public.telegram_sessions
FOR ALL
USING (true)
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_telegram_sessions_updated_at
  BEFORE UPDATE ON public.telegram_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();