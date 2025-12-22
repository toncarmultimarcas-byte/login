import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientesRepository } from '../data/clientesRepository';
import { Input } from '../components/FormInputs';
import { ModalConfirmacao } from '../components/ModalConfirmacao';
import { ToastNotificacao } from '../components/ToastNotificacao';
import '../styles/clientes.css';

export const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [modalDeletar, setModalDeletar] = useState(null);
  const [toast, setToast] = useState(null);
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
        <h1>CRM - Clientes</h1>
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
        <div className="clientes-grid">
          {clientes.map(cliente => (
            <div key={cliente.id} className="cliente-card">
              <div className="cliente-header">
                <div className="cliente-nome">{cliente.nome}</div>
              </div>
              
              <div className="cliente-info">
                {cliente.telefone && (
                  <div className="info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    {cliente.telefone}
                  </div>
                )}
                {cliente.email && (
                  <div className="info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    {cliente.email}
                  </div>
                )}
                {cliente.cpf && (
                  <div className="info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {cliente.cpf}
                  </div>
                )}
              </div>

              <div className="cliente-acoes">
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
                >
                  Editar
                </button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => setModalDeletar(cliente)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
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
    </div>
  );
};
