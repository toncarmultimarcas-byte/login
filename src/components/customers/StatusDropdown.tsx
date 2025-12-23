import { useState } from 'react';
import { CustomerStatus } from '../lib/tipos';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface StatusDropdownProps {
  currentStatus: CustomerStatus;
  onStatusChange: (status: CustomerStatus) => void;
  disabled?: boolean;
}

const statusOptions = Object.values(CustomerStatus);

export function StatusDropdown({
  currentStatus,
  onStatusChange,
  disabled = false,
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (status: CustomerStatus) => {
    if (status !== currentStatus) {
      onStatusChange(status);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
      >
        <span>{currentStatus}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => handleSelect(status)}
              className={`w-full px-4 py-2 text-left hover:bg-blue-50 ${
                status === currentStatus ? 'bg-blue-100 font-semibold' : ''
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
