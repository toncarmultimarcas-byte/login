import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientesRepository } from '../data/clientesRepository';
import { Input } from '../components/FormInputs';
import { ModalConfirmacao } from '../components/ModalConfirmacao';
import { ToastNotificacao } from '../components/ToastNotificacao';
import BadgeStatusCliente from '../components/BadgeStatusCliente';
import GuiaStatusCliente from '../components/GuiaStatusCliente';
import '../styles/clientes.css';

export const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [modalDeletar, setModalDeletar] = useState(null);
  const [toast, setToast] = useState(null);
  const [mostrarGuia, setMostrarGuia] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async (termo = '') => {
    try {
      setCarregando(true);
      const dados = await clientesRepository.listar({ nome: termo });
      setClientes(dados || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setToast({ tipo: 'erro', mensagem: 'Erro ao carregar clientes.' });
    } finally {
      setCarregando(false);
    }
  };

  const handleBusca = (e) => {
    const termo = e.target.value;
    setBusca(termo);
    // Debounce simples
    const timeoutId = setTimeout(() => carregarClientes(termo), 500);
    return () => clearTimeout(timeoutId);
  };

  const handleDelete = async () => {
    try {
      await clientesRepository.deletar(modalDeletar.id);
      setClientes(prev => prev.filter(c => c.id !== modalDeletar.id));
      setToast({ tipo: 'sucesso', mensagem: 'Cliente removido com sucesso!' });
    } catch (error) {
      setToast({ tipo: 'erro', mensagem: 'Erro ao remover cliente.' });
    } finally {
      setModalDeletar(null);
    }
  };

  return (
    <div className="clientes-container">
      <div className="clientes-header">
        <div>
          <h1>CRM - Clientes</h1>
          <button 
            className="btn btn-sm btn-outline-dark"
            onClick={() => setMostrarGuia(true)}
            title="Ver guia de status"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            Guia de Status
          </button>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/clientes/novo')}
        >
          + Novo Cliente
        </button>
      </div>

      <div className="clientes-filtros">
        <div style={{ flex: 1 }}>
          <Input
            label="Buscar Cliente"
            placeholder="Digite o nome do cliente..."
            valor={busca}
            onChange={handleBusca}
          />
        </div>
      </div>

      {carregando ? (
        <div className="loading">Carregando clientes...</div>
      ) : clientes.length === 0 ? (
        <div className="vazio">
          <p>Nenhum cliente encontrado.</p>
        </div>
      ) : (
        <div className="clientes-lista">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Status</th>
                <th>Telefone / WhatsApp</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id}>
                  <td>
                    <div className="cliente-nome-lista">{cliente.nome}</div>
                  </td>
                  <td>
                    <BadgeStatusCliente 
                      status={cliente.status || 'NOVO'} 
                      tamanho="pequeno"
                      clicavel
                      onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
                    />
                  </td>
                  <td>
                    {cliente.telefone ? (
                      <div className="telefone-container">
                        <span>{cliente.telefone}</span>
                        <a 
                          href={`https://wa.me/55${cliente.telefone.replace(/\D/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-whatsapp"
                          title="Conversar no WhatsApp"
                        >
                          <i className="fab fa-whatsapp"></i>
                        </a>
                      </div>
                    ) : '-'}
                  </td>
                  <td>
                    {cliente.email ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{cliente.email}</span>
                        <a 
                          href={`mailto:${cliente.email}`}
                          className="btn-email"
                          title="Enviar Email"
                        >
                          <i className="fas fa-envelope"></i>
                        </a>
                      </div>
                    ) : '-'}
                  </td>
                  <td>{cliente.cpf || '-'}</td>
                  <td>
                    <div className="acoes-cell">
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => setModalDeletar(cliente)}
                        title="Excluir"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalDeletar && (
        <ModalConfirmacao
          titulo="Excluir Cliente"
          mensagem={`Tem certeza que deseja excluir o cliente ${modalDeletar.nome}?`}
          onConfirmar={handleDelete}
          onCancelar={() => setModalDeletar(null)}
        />
      )}

      {toast && (
        <ToastNotificacao
          tipo={toast.tipo}
          mensagem={toast.mensagem}
          onClose={() => setToast(null)}
        />
      )}

      <GuiaStatusCliente 
        aberto={mostrarGuia} 
        onFechar={() => setMostrarGuia(false)}
      />
    </div>
  );
};
