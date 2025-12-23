import { useEffect, useState } from 'react';
import {
  fetchActiveCustomers,
  fetchArchivedCustomers,
  updateCustomerStatus,
  updateFollowUpDate,
  subscribeToCustomersChanges,
} from '../services/customersService';
import { Customer, CustomerStatus } from '../lib/tipos';

export function useCustomers(isArchived: boolean = false) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | undefined>();

  // Busca inicial e quando filtros mudam
  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        setError(null);

        let data;
        if (isArchived) {
          data = await fetchArchivedCustomers(searchTerm);
        } else {
          data = await fetchActiveCustomers(searchTerm, statusFilter);
        }

        setCustomers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, [isArchived, searchTerm, statusFilter]);

  // Subscrição em tempo real
  useEffect(() => {
    const subscription = subscribeToCustomersChanges((payload) => {
      // Recarrega a lista quando há mudanças
      if (payload.eventType === 'INSERT') {
        setCustomers((prev) => [payload.new as Customer, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setCustomers((prev) =>
          prev.map((c) => (c.id === payload.new.id ? (payload.new as Customer) : c))
        );
      } else if (payload.eventType === 'DELETE') {
        setCustomers((prev) => prev.filter((c) => c.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Atualizar status (com otimismo)
  const handleStatusChange = async (customerId: string, newStatus: CustomerStatus) => {
    const oldCustomers = customers;
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status: newStatus } : c))
    );

    try {
      await updateCustomerStatus(customerId, newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      setCustomers(oldCustomers);
    }
  };

  // Atualizar follow-up date
  const handleFollowUpChange = async (customerId: string, date: string | null) => {
    const oldCustomers = customers;
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, next_follow_up_at: date } : c))
    );

    try {
      await updateFollowUpDate(customerId, date);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar follow-up');
      setCustomers(oldCustomers);
    }
  };

  return {
    customers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleStatusChange,
    handleFollowUpChange,
  };
}
