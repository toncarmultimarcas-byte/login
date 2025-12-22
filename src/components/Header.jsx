import React, { useState, useEffect, useRef } from 'react';
import { emailAniversario } from '../utils/emailAniversario';
import '../styles/header.css';

export const Header = () => {
  const [aniversariantesHoje, setAniversariantesHoje] = useState([]);
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    carregarAniversariantesHoje();
    
    // Fechar dropdown ao clicar fora
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarNotificacoes(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const carregarAniversariantesHoje = async () => {
    const aniversariantes = await emailAniversario.buscarAniversariantesDoDia();
    setAniversariantesHoje(aniversariantes);
  };

  const handleEnviarEmail = (cliente) => {
    const link = emailAniversario.gerarMailtoLink(cliente);
    window.location.href = link;
    
    // Opcional: Marcar como enviado no banco
    emailAniversario.registrarEmailEnviado(cliente.id);
  };

  return (
    <header className="top-header">
      <div className="header-content">
        <div className="header-title">
          <h2>Painel de Controle</h2>
        </div>
        
        <div className="header-actions" ref={dropdownRef}>
          <div 
            className="notification-bell" 
            onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            
            {aniversariantesHoje.length > 0 && (
              <span className="notification-badge">{aniversariantesHoje.length}</span>
            )}
          </div>

          {mostrarNotificacoes && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h3>Aniversariantes de Hoje 🎉</h3>
              </div>
              
              <div className="dropdown-body">
                {aniversariantesHoje.length === 0 ? (
                  <p className="no-notifications">Nenhum aniversariante hoje.</p>
                ) : (
                  aniversariantesHoje.map(cliente => (
                    <div key={cliente.id} className="notification-item">
                      <div className="notification-info">
                        <strong>{cliente.nome}</strong>
                        <span>{emailAniversario.calcularIdade(cliente.data_nascimento)} anos</span>
                      </div>
                      <button 
                        className="btn-send-email"
                        onClick={() => handleEnviarEmail(cliente)}
                        title="Enviar Email"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
