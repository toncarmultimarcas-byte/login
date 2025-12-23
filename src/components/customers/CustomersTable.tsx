import { Customer, CustomerStatus } from '../lib/tipos';
import { StatusBadge } from './StatusBadge';
import { CustomerRowActions } from './CustomerRowActions';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CustomersTableProps {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  onStatusChange: (customerId: string, status: CustomerStatus) => void;
  onFollowUpChange: (customerId: string, date: string | null) => void;
  onDelete?: (customerId: string) => void;
  showDelete?: boolean;
}

export function CustomersTable({
  customers,
  loading,
  error,
  onStatusChange,
  onFollowUpChange,
  onDelete,
  showDelete = false,
}: CustomersTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Carregando clientes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Erro: {error}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum cliente encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Telefone</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Interesse</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Prox. Follow-up</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acoes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{customer.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{customer.phone || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{customer.email || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {customer.interest_brand && customer.interest_model
                  ? `${customer.interest_brand} ${customer.interest_model}`
                  : customer.interest_brand || '-'}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={customer.status} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {customer.next_follow_up_at
                  ? formatDistanceToNow(parseISO(customer.next_follow_up_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })
                  : '-'}
              </td>
              <td className="px-6 py-4">
                <CustomerRowActions
                  customer={customer}
                  onStatusChange={(status) => onStatusChange(customer.id, status)}
                  onFollowUpChange={(date) => onFollowUpChange(customer.id, date)}
                  onDelete={onDelete ? () => onDelete(customer.id) : undefined}
                  showDelete={showDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
