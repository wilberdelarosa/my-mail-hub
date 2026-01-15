-- Queue requests for n8n + RabbitMQ ingestion
CREATE TABLE IF NOT EXISTS public.queue_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL, -- MANUAL | WHATSAPP | WEB | AI
  status TEXT NOT NULL DEFAULT 'RECEIVED', -- RECEIVED | PENDING | PROCESSED | FAILED
  payload JSONB,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_queue_requests_source ON public.queue_requests(source);
CREATE INDEX IF NOT EXISTS idx_queue_requests_status ON public.queue_requests(status);
CREATE INDEX IF NOT EXISTS idx_queue_requests_created ON public.queue_requests(created_at);
