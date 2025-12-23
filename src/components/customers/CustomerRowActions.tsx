import { useState } from 'react';
import { Customer, CustomerStatus } from '../lib/tipos';
import { StatusDropdown } from './StatusDropdown';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

interface CustomerRowActionsProps {
  customer: Customer;
  onStatusChange: (status: CustomerStatus) => void;
  onFollowUpChange: (date: string | null) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export function CustomerRowActions({
  customer,
  onStatusChange,
  onFollowUpChange,
  onDelete,
  showDelete = false,
}: CustomerRowActionsProps) {
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(customer.next_follow_up_at || '');

  const handleFollowUpSave = () => {
    onFollowUpChange(followUpDate || null);
    setShowFollowUpModal(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Dropdown de Status */}
      <div className="w-32">
        <StatusDropdown
          currentStatus={customer.status}
          onStatusChange={onStatusChange}
        />
      </div>

      {/* Botao Follow-up */}
      <button
        onClick={() => setShowFollowUpModal(true)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Agendar follow-up"
      >
        <PencilIcon className="w-5 h-5" />
      </button>

      {/* Botao Delete (opcional) */}
      {showDelete && onDelete && (
        <button
          onClick={() => onDelete(customer.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Deletar cliente"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      )}

      {/* Modal de Follow-up */}
      {showFollowUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Proxima Data de Follow-up</h3>
            <input
              type="datetime-local"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowFollowUpModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleFollowUpSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
