import { useState } from 'react';
import { useCustomers } from '../../hooks/useCustomers';
import { CustomersTable } from './CustomersTable';
import { CustomerStatus } from '../../lib/tipos';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function CustomersPage() {
  const [isArchived, setIsArchived] = useState(false);
  const {
    customers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleStatusChange,
    handleFollowUpChange,
  } = useCustomers(isArchived);

  const statusOptions = Object.values(CustomerStatus);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clientes CRM</h1>
        <p className="text-gray-600">Gerencie seus clientes e acompanhe o pipeline de vendas</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {/* Toggle Ativos / Arquivados */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setIsArchived(false)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              !isArchived
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ativos
          </button>
          <button
            onClick={() => setIsArchived(true)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isArchived
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Arquivados
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Status Filter (apenas para ativos) */}
        {!isArchived && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter(undefined)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === undefined
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos os Status
            </button>
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <CustomersTable
          customers={customers}
          loading={loading}
          error={error}
          onStatusChange={handleStatusChange}
          onFollowUpChange={handleFollowUpChange}
          showDelete={false}
        />
      </div>
    </div>
  );
}
