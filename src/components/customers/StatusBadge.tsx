import { CustomerStatus } from '../lib/tipos';

interface StatusBadgeProps {
  status: CustomerStatus;
}

const statusColors: Record<CustomerStatus, { bg: string; text: string; label: string }> = {
  [CustomerStatus.NOVO]: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Novo' },
  [CustomerStatus.CURIOSO]: { bg: 'bg-cyan-100', text: 'text-cyan-800', label: 'Curioso' },
  [CustomerStatus.INTERESSADO]: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Interessado' },
  [CustomerStatus.EM_NEGOCIACAO]: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Em Negociacao' },
  [CustomerStatus.PERDIDO]: { bg: 'bg-red-100', text: 'text-red-800', label: 'Perdido' },
  [CustomerStatus.COMPROU]: { bg: 'bg-green-100', text: 'text-green-800', label: 'Comprou' },
  [CustomerStatus.SEM_INTERESSE]: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Sem Interesse' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = statusColors[status];

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
      {colors.label}
    </span>
  );
}
