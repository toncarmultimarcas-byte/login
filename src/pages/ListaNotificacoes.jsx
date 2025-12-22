import React, { useState, useEffect } from 'react';
import { clientesRepository } from '../data/clientesRepository';
import { ToastNotificacao } from '../components/ToastNotificacao';
import '../styles/notificacoes.css';

export const ListaNotificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  const carregarNotificacoes = async () => {
    try {
      setCarregando(true);
      const dados = await clientesRepository.listarNotificacoes();
      setNotificacoes(dados || []);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      setToast({ tipo: 'erro', mensagem: 'Erro ao carregar notificações.' });
    } finally {
      setCarregando(false);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="notificacoes-container">
      <div className="notificacoes-header">
        <h1>Notificações de Interesse</h1>
      </div>

      {carregando ? (
        <div className="loading">Carregando notificações...</div>
      ) : notificacoes.length === 0 ? (
        <div className="vazio">
          <p>Nenhuma notificação encontrada.</p>
        </div>
      ) : (
        <div className="notificacoes-lista">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Veículo de Interesse</th>
                <th>Faixa de Preço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {notificacoes.map(notificacao => (
                <tr key={notificacao.id}>
                  <td>
                    <div className="notificacao-data">{formatarData(notificacao.data_notificacao)}</div>
                  </td>
                  <td>
                    <div className="cliente-nome-lista">{notificacao.clientes?.nome || 'Cliente Removido'}</div>
                    <div className="cliente-contato" style={{ fontSize: '0.85rem', color: '#666' }}>
                      {notificacao.clientes?.telefone}
                    </div>
                  </td>
                  <td>
                    <div className="notificacao-modelo">{notificacao.modelo}</div>
                  </td>
                  <td>{notificacao.faixa_preco}</td>
                  <td>
                    <span className={`status-badge ${notificacao.enviado ? 'status-enviado' : 'status-pendente'}`}>
                      {notificacao.enviado ? 'Enviado' : 'Pendente'}
                    </span>
                  </td>
                  <td>
                    {notificacao.clientes?.telefone && (
                      <a 
                        href={`https://wa.me/55${notificacao.clientes.telefone.replace(/\D/g, '')}?text=Olá ${notificacao.clientes.nome}, vimos que você tem interesse no modelo ${notificacao.modelo}. Chegou uma novidade que pode te interessar!`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-whatsapp"
                        title="Enviar WhatsApp"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && (
        <ToastNotificacao
          tipo={toast.tipo}
          mensagem={toast.mensagem}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
