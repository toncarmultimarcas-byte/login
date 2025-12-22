import React, { useState } from 'react';
import '../styles/modal.css';

export const ModalConfirmacao = ({ titulo, mensagem, onConfirmar, onCancelar, carregando = false }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{titulo}</h2>
        </div>
        <div className="modal-body">
          <p>{mensagem}</p>
        </div>
        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={onCancelar}
            disabled={carregando}
          >
            Cancelar
          </button>
          <button 
            className="btn btn-danger" 
            onClick={onConfirmar}
            disabled={carregando}
          >
            {carregando ? 'Processando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};
