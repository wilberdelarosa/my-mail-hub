-- Create enum for document types
CREATE TYPE public.document_type AS ENUM ('cotizacion', 'proforma', 'factura');

-- Create enum for document status
CREATE TYPE public.document_status AS ENUM ('borrador', 'enviado', 'aprobado', 'rechazado', 'pagado', 'cancelado');

-- Create enum for unit types
CREATE TYPE public.unit_type AS ENUM ('PA', 'VJ', 'DIA', 'M3', 'UN', 'HR', 'KG', 'LT');

-- Company settings table (for ALITO GROUP SRL info)
CREATE TABLE public.company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'ALITO GROUP SRL',
  rnc TEXT NOT NULL DEFAULT '133-20669-2',
  address TEXT DEFAULT 'Cruce Domingo Maiz No.07, Sector Las dos jardas, Interior de veron.',
  city TEXT DEFAULT 'Punta Cana, Prov. La Altagracia',
  phone TEXT DEFAULT '809-381-0252',
  cell TEXT DEFAULT '849-315-0511',
  email TEXT,
  logo_url TEXT,
  bank_account_usd TEXT DEFAULT '844032847',
  bank_account_dop TEXT DEFAULT '844032771',
  bank_name TEXT DEFAULT 'BANCO POPULAR',
  authorized_by TEXT DEFAULT 'ALITO DE LA ROSA',
  authorized_title TEXT DEFAULT 'Gerente General',
  authorized_phone TEXT DEFAULT '809 693 3106',
  itbis_rate DECIMAL(5,2) DEFAULT 18.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rnc TEXT,
  address TEXT,
  city TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Equipment/Products catalog
CREATE TABLE public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  default_unit unit_type DEFAULT 'UN',
  default_price DECIMAL(12,2) DEFAULT 0,
  is_taxable BOOLEAN DEFAULT true,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Documents (cotizaciones, proformas, facturas)
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type document_type NOT NULL,
  document_number TEXT NOT NULL,
  ncf TEXT, -- Número de Comprobante Fiscal for facturas
  ncf_expiry DATE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  location TEXT,
  status document_status DEFAULT 'borrador',
  notes TEXT,
  payment_terms TEXT,
  subtotal_exempt DECIMAL(12,2) DEFAULT 0,
  subtotal_taxable DECIMAL(12,2) DEFAULT 0,
  subtotal DECIMAL(12,2) DEFAULT 0,
  itbis_amount DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) DEFAULT 0,
  prepared_by TEXT,
  prepared_by_title TEXT,
  prepared_by_phone TEXT,
  received_by TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Document items
CREATE TABLE public.document_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE SET NULL,
  control_number TEXT,
  execution_date DATE,
  equipment_name TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(12,4) NOT NULL DEFAULT 1,
  unit unit_type DEFAULT 'UN',
  unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  is_taxable BOOLEAN DEFAULT true,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  title TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_documents_client ON public.documents(client_id);
CREATE INDEX idx_documents_type ON public.documents(document_type);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_documents_date ON public.documents(issue_date);
CREATE INDEX idx_document_items_document ON public.document_items(document_id);
CREATE INDEX idx_clients_rnc ON public.clients(rnc);
CREATE INDEX idx_equipment_code ON public.equipment(code);

-- Enable RLS on all tables
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for company_settings (all authenticated users can read, only admins can modify)
CREATE POLICY "Anyone can view company settings"
  ON public.company_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update company settings"
  ON public.company_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for clients
CREATE POLICY "Authenticated users can view clients"
  ON public.clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create clients"
  ON public.clients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients"
  ON public.clients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete clients"
  ON public.clients FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for equipment
CREATE POLICY "Authenticated users can view equipment"
  ON public.equipment FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create equipment"
  ON public.equipment FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update equipment"
  ON public.equipment FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete equipment"
  ON public.equipment FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for documents
CREATE POLICY "Authenticated users can view documents"
  ON public.documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create documents"
  ON public.documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update documents"
  ON public.documents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete documents"
  ON public.documents FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for document_items
CREATE POLICY "Authenticated users can view document items"
  ON public.document_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create document items"
  ON public.document_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update document items"
  ON public.document_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete document items"
  ON public.document_items FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Trigger for new user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_document_items_updated_at
  BEFORE UPDATE ON public.document_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate document totals
CREATE OR REPLACE FUNCTION public.calculate_document_totals()
RETURNS TRIGGER AS $$
DECLARE
  v_subtotal_exempt DECIMAL(12,2);
  v_subtotal_taxable DECIMAL(12,2);
  v_itbis_rate DECIMAL(5,2);
BEGIN
  -- Get ITBIS rate from company settings
  SELECT COALESCE(itbis_rate, 18.00) INTO v_itbis_rate FROM public.company_settings LIMIT 1;
  
  -- Calculate subtotals
  SELECT 
    COALESCE(SUM(CASE WHEN NOT is_taxable THEN total ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN is_taxable THEN total ELSE 0 END), 0)
  INTO v_subtotal_exempt, v_subtotal_taxable
  FROM public.document_items
  WHERE document_id = COALESCE(NEW.document_id, OLD.document_id);
  
  -- Update document totals
  UPDATE public.documents
  SET 
    subtotal_exempt = v_subtotal_exempt,
    subtotal_taxable = v_subtotal_taxable,
    subtotal = v_subtotal_exempt + v_subtotal_taxable,
    itbis_amount = ROUND(v_subtotal_taxable * v_itbis_rate / 100, 2),
    total = v_subtotal_exempt + v_subtotal_taxable + ROUND(v_subtotal_taxable * v_itbis_rate / 100, 2)
  WHERE id = COALESCE(NEW.document_id, OLD.document_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to auto-calculate totals when items change
CREATE TRIGGER calculate_totals_on_item_change
  AFTER INSERT OR UPDATE OR DELETE ON public.document_items
  FOR EACH ROW EXECUTE FUNCTION public.calculate_document_totals();

-- Function to generate next document number
CREATE OR REPLACE FUNCTION public.get_next_document_number(doc_type document_type)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  next_num INTEGER;
  result TEXT;
BEGIN
  CASE doc_type
    WHEN 'cotizacion' THEN prefix := 'COT-';
    WHEN 'proforma' THEN prefix := 'PRO-';
    WHEN 'factura' THEN prefix := 'FAC-';
  END CASE;
  
  SELECT COALESCE(MAX(
    CASE 
      WHEN document_number ~ (prefix || '[0-9]+$')
      THEN CAST(SUBSTRING(document_number FROM (prefix || '([0-9]+)$')) AS INTEGER)
      ELSE 0 
    END
  ), 0) + 1 INTO next_num
  FROM public.documents
  WHERE document_type = doc_type;
  
  result := prefix || LPAD(next_num::TEXT, 5, '0');
  RETURN result;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Insert default company settings
INSERT INTO public.company_settings (id) VALUES (gen_random_uuid());