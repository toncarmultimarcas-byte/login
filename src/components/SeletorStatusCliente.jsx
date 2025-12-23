import React from 'react';
import { STATUS_CLIENTE, STATUS_CLIENTE_DESCRICAO } from '../config/constantes';
import '../styles/SeletorStatusCliente.css';

const StatusIcons = {
  NOVO: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  CURIOSO: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <path d="M12 17h.01"/>
    </svg>
  ),
  INTERESSADO: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  EM_NEGOCIACAO: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  COMPROU: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  PERDIDO: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  SEM_INTERESSE: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  )
};

export default function SeletorStatusCliente({ valor, onChange, mostrarDescricao = true }) {
  const [statusSelecionado, setStatusSelecionado] = React.useState(null);

  const handleChange = (novoStatus) => {
    setStatusSelecionado(novoStatus);
    if (onChange) onChange(novoStatus);
  };

  return (
    <div className="seletor-status-cliente">
      <label className="label-status">Status do Cliente</label>
      <div className="opcoes-status">
        {Object.entries(STATUS_CLIENTE).map(([key, status]) => (
          <div
            key={key}
            className={`opcao-status ${valor === status ? 'ativa' : ''}`}
            onClick={() => handleChange(status)}
            title={STATUS_CLIENTE_DESCRICAO[key]}
          >
            <input
              type="radio"
              name="status_cliente"
              value={status}
              checked={valor === status}
              onChange={() => handleChange(status)}
              id={`status-${key}`}
            />
            <label htmlFor={`status-${key}`} className="label-opcao">
              <span className="icon-status">{StatusIcons[key]}</span>
              <span className="texto-status">{status}</span>
            </label>
          </div>
        ))}
      </div>

      {mostrarDescricao && valor && (
        <div className="descricao-status">
          <div className="descricao-header">
            {StatusIcons[Object.keys(STATUS_CLIENTE).find(k => STATUS_CLIENTE[k] === valor)]}
            <strong>{valor}</strong>
          </div>
          <p>{STATUS_CLIENTE_DESCRICAO[Object.keys(STATUS_CLIENTE).find(k => STATUS_CLIENTE[k] === valor)]}</p>
        </div>
      )}
    </div>
  );
}
