import React from 'react';
import { STATUS_CLIENTE, STATUS_CLIENTE_DESCRICAO } from '../config/constantes';
import '../styles/GuiaStatusCliente.css';

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

export default function GuiaStatusCliente({ aberto, onFechar }) {
  if (!aberto) return null;

  const statusOrdenado = [
    'NOVO',
    'CURIOSO',
    'INTERESSADO',
    'EM_NEGOCIACAO',
    'COMPROU',
    'PERDIDO',
    'SEM_INTERESSE'
  ];

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-guia-status" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Guia de Status de Clientes</h2>
          <button className="btn-fechar" onClick={onFechar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <p className="intro-texto">
            Entenda cada estágio do funil de vendas e como classificar seus clientes corretamente.
          </p>

          <div className="timeline-status">
            {statusOrdenado.map((key, index) => (
              <div key={key} className={`item-timeline status-${key.toLowerCase()}`}>
                <div className="numero-etapa">
                  {StatusIcons[key]}
                </div>
                <div className="conteudo-etapa">
                  <span className="status-titulo">{STATUS_CLIENTE[key]}</span>
                  <p className="status-descricao">
                    {STATUS_CLIENTE_DESCRICAO[key]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="dicas-uteis">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
                <path d="M9 21h6"/>
              </svg>
              Dicas Úteis
            </h3>
            <ul>
              <li><strong>Follow-up importante:</strong> Clientes em "INTERESSADO" precisam de atenção rápida (24-48h)</li>
              <li><strong>Limite de tempo:</strong> "CURIOSO" sem movimento por 30 dias → considere "PERDIDO"</li>
              <li><strong>Documentação:</strong> Registre o motivo ao marcar como "PERDIDO" ou "SEM_INTERESSE"</li>
              <li><strong>Próximo contato:</strong> Sempre defina a data do próximo follow-up</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onFechar}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
