import React, { useState } from 'react';
import { STATUS_CLIENTE, STATUS_CLIENTE_DESCRICAO } from '../config/constantes';
import '../styles/BadgeStatusCliente.css';

export default function BadgeStatusCliente({ status, tamanho = 'medio', clicavel = false, onClick }) {
  const [mostrarTooltip, setMostrarTooltip] = useState(false);

  const statusKey = Object.keys(STATUS_CLIENTE).find(k => STATUS_CLIENTE[k] === status);

  return (
    <div
      className={`badge-status-wrapper tamanho-${tamanho} ${clicavel ? 'clicavel' : ''}`}
      onMouseEnter={() => setMostrarTooltip(true)}
      onMouseLeave={() => setMostrarTooltip(false)}
      onClick={onClick}
    >
      <span className={`badge-status status-${statusKey?.toLowerCase() || 'novo'}`}>
        {status}
      </span>

      {mostrarTooltip && statusKey && (
        <div className="tooltip-descricao">
          <strong>{status}</strong>
          <p>{STATUS_CLIENTE_DESCRICAO[statusKey]}</p>
        </div>
      )}
    </div>
  );
}
