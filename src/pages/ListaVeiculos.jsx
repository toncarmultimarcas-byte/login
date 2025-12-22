import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { veiculosRepository } from '../data/veiculosRepository';
import { CardVeiculo } from '../components/CardVeiculo';
import { ModalConfirmacao } from '../components/ModalConfirmacao';
import { ToastNotificacao } from '../components/ToastNotificacao';
import { Input, Select } from '../components/FormInputs';
import { STATUS_VEICULO } from '../config/constantes';
import '../styles/lista-veiculos.css';

export const ListaVeiculos = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalDeletar, setModalDeletar] = useState(null);
  const [toast, setToast] = useState(null);
  const [filtros, setFiltros] = useState({
    modelo: '',
    ano: '',
    status: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    carregarVeiculos();
  }, []);

  const carregarVeiculos = async () => {
    try {
      const dados = await veiculosRepository.listar(filtros);
      setVeiculos(dados || []);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      setToast({
        tipo: 'erro',
        mensagem: 'Erro ao carregar veículos.'
      });
    } finally {
      setCarregando(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBuscar = () => {
    setCarregando(true);
    carregarVeiculos();
  };

  const handleDelete = async () => {
    try {
      await veiculosRepository.deletar(modalDeletar.id);
      setVeiculos(prev => prev.filter(v => v.id !== modalDeletar.id));
      setToast({
        tipo: 'sucesso',
        mensagem: 'Veículo deletado com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao deletar:', error);
      setToast({
        tipo: 'erro',
        mensagem: 'Erro ao deletar veículo.'
      });
    } finally {
      setModalDeletar(null);
    }
  };

  const opcoesStatus = Object.entries(STATUS_VEICULO).map(([key, value]) => ({
    valor: value,
    label: value.charAt(0).toUpperCase() + value.slice(1)
  }));

  return (
    <div className="lista-container">
      <div className="lista-header">
        <h1>Veículos</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/veiculos/novo')}
        >
          + Novo Veículo
        </button>
      </div>

      <div className="filtros">
        <Input
          label="Modelo"
          placeholder="Filtrar por modelo..."
          valor={filtros.modelo}
          onChange={handleFiltroChange}
          name="modelo"
        />
        <Input
          label="Ano"
          tipo="number"
          placeholder="Filtrar por ano..."
          valor={filtros.ano}
          onChange={handleFiltroChange}
          name="ano"
        />
        <Select
          label="Status"
          opcoes={opcoesStatus}
          valor={filtros.status}
          onChange={handleFiltroChange}
          name="status"
        />
        <button className="btn btn-secondary" onClick={handleBuscar}>
          Buscar
        </button>
      </div>

      {carregando ? (
        <div className="loading">Carregando veículos...</div>
      ) : veiculos.length === 0 ? (
        <div className="vazio">
          <p>Nenhum veículo encontrado.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/veiculos/novo')}
          >
            Adicionar Primeiro Veículo
          </button>
        </div>
      ) : (
        <div className="veiculos-grid">
          {veiculos.map(veiculo => (
            <CardVeiculo
              key={veiculo.id}
              veiculo={veiculo}
              onEditar={(id) => navigate(`/veiculos/${id}/editar`)}
              onDetalhes={(id) => navigate(`/veiculos/${id}`)}
              onDelete={(id) => setModalDeletar({ id, marca: veiculo.marca, modelo: veiculo.modelo })}
            />
          ))}
        </div>
      )}

      {modalDeletar && (
        <ModalConfirmacao
          titulo="Deletar Veículo"
          mensagem={`Tem certeza que deseja deletar ${modalDeletar.marca} ${modalDeletar.modelo}? Esta ação não pode ser desfeita.`}
          onConfirmar={handleDelete}
          onCancelar={() => setModalDeletar(null)}
        />
      )}

      {toast && (
        <ToastNotificacao
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onFechar={() => setToast(null)}
        />
      )}
    </div>
  );
};
