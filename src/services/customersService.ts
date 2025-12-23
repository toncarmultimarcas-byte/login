import { supabase } from '../lib/supabaseClient';
import { Customer, CustomerStatus, CreateCustomerPayload, UpdateCustomerPayload } from '../lib/tipos';

/**
 * Busca clientes ativos (não arquivados ou arquivamento expirado)
 */
export async function fetchActiveCustomers(
  searchTerm?: string,
  statusFilter?: CustomerStatus
): Promise<Customer[]> {
  let query = supabase
    .from('customers_active')
    .select('*')
    .order('created_at', { ascending: false });

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  if (searchTerm) {
    const term = `%${searchTerm}%`;
    query = query.or(`name.ilike.${term},phone.ilike.${term},email.ilike.${term}`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar clientes ativos:', error);
    throw new Error('Falha ao buscar clientes ativos');
  }

  return data || [];
}

/**
 * Busca clientes arquivados (arquivamento > agora)
 */
export async function fetchArchivedCustomers(searchTerm?: string): Promise<Customer[]> {
  let query = supabase
    .from('customers_archived')
    .select('*')
    .order('archived_until', { ascending: false });

  if (searchTerm) {
    const term = `%${searchTerm}%`;
    query = query.or(`name.ilike.${term},phone.ilike.${term},email.ilike.${term}`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar clientes arquivados:', error);
    throw new Error('Falha ao buscar clientes arquivados');
  }

  return data || [];
}

/**
 * Busca um cliente específico por ID
 */
export async function fetchCustomerById(id: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar cliente:', error);
    throw new Error('Falha ao buscar cliente');
  }

  return data || null;
}

/**
 * Cria um novo cliente
 */
export async function createCustomer(payload: CreateCustomerPayload): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar cliente:', error);
    throw new Error('Falha ao criar cliente');
  }

  return data;
}

/**
 * Atualiza um cliente
 */
export async function updateCustomer(
  id: string,
  payload: UpdateCustomerPayload
): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw new Error('Falha ao atualizar cliente');
  }

  return data;
}

/**
 * Atualiza o status do cliente e motivo (se fornecido)
 * archived_until é gerenciado automaticamente pelo trigger
 */
export async function updateCustomerStatus(
  id: string,
  status: CustomerStatus,
  reason?: string
): Promise<Customer> {
  const payload: UpdateCustomerPayload = { status };
  if (reason !== undefined) {
    payload.status_reason = reason || null;
  }

  return updateCustomer(id, payload);
}

/**
 * Atualiza a próxima data de follow-up
 */
export async function updateFollowUpDate(
  id: string,
  nextFollowUpAt: string | null
): Promise<Customer> {
  return updateCustomer(id, { next_follow_up_at: nextFollowUpAt });
}

/**
 * Deleta um cliente (soft delete é opcional - aqui é hard delete)
 */
export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar cliente:', error);
    throw new Error('Falha ao deletar cliente');
  }
}

/**
 * Subscrição em tempo real para mudanças na tabela customers
 */
export function subscribeToCustomersChanges(
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel('public:customers')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'customers' },
      callback
    )
    .subscribe();

  return subscription;
}
