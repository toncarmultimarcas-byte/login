// tipos.ts - Tipos e enums compartilhados

export enum CustomerStatus {
  NOVO = 'NOVO',
  CURIOSO = 'CURIOSO',
  INTERESSADO = 'INTERESSADO',
  EM_NEGOCIACAO = 'EM_NEGOCIACAO',
  PERDIDO = 'PERDIDO',
  COMPROU = 'COMPROU',
  SEM_INTERESSE = 'SEM_INTERESSE',
}

export interface Customer {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  phone: string | null;
  email: string | null;
  birth_date: string | null;
  interest_brand: string | null;
  interest_model: string | null;
  interest_year_min: number | null;
  interest_year_max: number | null;
  interest_notes: string | null;
  status: CustomerStatus;
  status_reason: string | null;
  next_follow_up_at: string | null;
  archived_until: string | null;
}

export interface CreateCustomerPayload {
  name: string;
  phone?: string;
  email?: string;
  birth_date?: string;
  interest_brand?: string;
  interest_model?: string;
  interest_year_min?: number;
  interest_year_max?: number;
  interest_notes?: string;
}

export interface UpdateCustomerPayload {
  name?: string;
  phone?: string;
  email?: string;
  birth_date?: string;
  interest_brand?: string;
  interest_model?: string;
  interest_year_min?: number;
  interest_year_max?: number;
  interest_notes?: string;
  status?: CustomerStatus;
  status_reason?: string;
  next_follow_up_at?: string | null;
}
