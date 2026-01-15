export type DocumentType = 'cotizacion' | 'proforma' | 'factura';
export type DocumentStatus = 'borrador' | 'enviado' | 'aprobado' | 'rechazado' | 'pagado' | 'cancelado';
export type UnitType = 'PA' | 'VJ' | 'DIA' | 'M3' | 'UN' | 'HR' | 'KG' | 'LT';

export interface CompanySettings {
  id: string;
  name: string;
  rnc: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  cell: string | null;
  email: string | null;
  logo_url: string | null;
  bank_account_usd: string | null;
  bank_account_dop: string | null;
  bank_name: string | null;
  authorized_by: string | null;
  authorized_title: string | null;
  authorized_phone: string | null;
  itbis_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  rnc: string | null;
  address: string | null;
  city: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Equipment {
  id: string;
  code: string | null;
  name: string;
  description: string | null;
  default_unit: UnitType;
  default_price: number;
  is_taxable: boolean;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  document_type: DocumentType;
  document_number: string;
  ncf: string | null;
  ncf_expiry: string | null;
  client_id: string | null;
  issue_date: string;
  location: string | null;
  status: DocumentStatus;
  notes: string | null;
  payment_terms: string | null;
  subtotal_exempt: number;
  subtotal_taxable: number;
  subtotal: number;
  itbis_amount: number;
  total: number;
  prepared_by: string | null;
  prepared_by_title: string | null;
  prepared_by_phone: string | null;
  received_by: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
}

export interface DocumentItem {
  id: string;
  document_id: string;
  equipment_id: string | null;
  control_number: string | null;
  execution_date: string | null;
  equipment_name: string;
  description: string | null;
  quantity: number;
  unit: UnitType;
  unit_price: number;
  is_taxable: boolean;
  total: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  equipment?: Equipment;
}

export interface Profile {
  id: string;
  full_name: string | null;
  title: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  cotizacion: 'Cotización',
  proforma: 'Proforma',
  factura: 'Factura',
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  borrador: 'Borrador',
  enviado: 'Enviado',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  pagado: 'Pagado',
  cancelado: 'Cancelado',
};

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  PA: 'P/A',
  VJ: 'VJ',
  DIA: 'DÍA',
  M3: 'M³',
  UN: 'UN',
  HR: 'HR',
  KG: 'KG',
  LT: 'LT',
};
