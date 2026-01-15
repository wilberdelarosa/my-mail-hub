-- Function to generate incremental NCF
CREATE OR REPLACE FUNCTION get_next_ncf(p_type text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    v_sequence int;
    v_prefix text;
BEGIN
    -- Determine prefix based on type (Simplified logic for Example)
    -- B01: Crédito Fiscal (31), B02: Consumo Final (02), etc.
    IF p_type = '31' THEN
        v_prefix := 'B01';
    ELSIF p_type = '02' THEN
        v_prefix := 'B02';
    ELSE
        v_prefix := 'B01'; -- Default
    END IF;

    -- Update sequence table (needs to be created if not exists)
    UPDATE public.ncf_sequences
    SET current_value = current_value + 1
    WHERE type = p_type
    RETURNING current_value INTO v_sequence;

    -- If no sequence found, insert generic start
    IF NOT FOUND THEN
        INSERT INTO public.ncf_sequences (type, current_value, prefix)
        VALUES (p_type, 1, v_prefix);
        v_sequence := 1;
    END IF;

    -- Format: Prefix + 8 digits (e.g., B0100000001)
    RETURN v_prefix || lpad(v_sequence::text, 8, '0');
END;
$$;

-- Table to store NCF sequences
CREATE TABLE IF NOT EXISTS public.ncf_sequences (
    type text PRIMARY KEY,
    current_value bigint DEFAULT 0,
    prefix text,
    updated_at timestamp with time zone default now()
);

-- Invoices table update (ensure it exists)
CREATE TABLE IF NOT EXISTS public.invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id text NOT NULL,
    quote_id text,
    ncf_sequence text,
    status text NOT NULL DEFAULT 'DRAFT',
    issue_date timestamp with time zone DEFAULT now(),
    due_date timestamp with time zone,
    subtotal numeric(15,2) DEFAULT 0,
    tax_amount numeric(15,2) DEFAULT 0,
    total numeric(15,2) DEFAULT 0,
    balance numeric(15,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
