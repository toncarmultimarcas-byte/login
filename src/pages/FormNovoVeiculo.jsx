import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { veiculosRepository } from '../data/veiculosRepository';
import { storageFotos } from '../data/storageFotos';
import { Input, TextArea, Select } from '../components/FormInputs';
import { Upload } from '../components/Upload';
import { ToastNotificacao } from '../components/ToastNotificacao';
import { notificadorInteresse } from '../utils/notificadorInteresse';
import { STATUS_VEICULO, COMBUSTIVEL, CAMBIO } from '../config/constantes';
import '../styles/form-veiculo.css';

export const FormNovoVeiculo = () => {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    km: '',
    cor: '',
    cambio: '',
    combustivel: '',
    preco: '',
    descricao: '',
    status: STATUS_VEICULO.DISPONIVEL,
    opcionais: ''
  });

  const [fotos, setFotos] = useState([]);
  const [fotoCapa, setFotoCapa] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [toast, setToast] = useState(null);
  const [notificacao, setNotificacao] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadFotoCapa = (arquivos) => {
    if (arquivos.length > 0) {
      setFotoCapa(arquivos[0]);
    }
  };

  const handleUploadGaleria = (arquivos) => {
    setFotos(prev => [...prev, ...arquivos]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      // Salvar veículo
      const veiculo = await veiculosRepository.criar({
        ...formData,
        ano: parseInt(formData.ano),
        km: parseInt(formData.km),
        preco: parseFloat(formData.preco),
        opcionais: formData.opcionais.split(',').map(o => o.trim()).filter(Boolean)
      });

      // Upload fotos
      if (fotoCapa) {
        const uploadedFotoCapa = await storageFotos.upload(fotoCapa, veiculo.id, 'capa');
        await storageFotos.salvarMetadadosFoto(veiculo.id, { ...uploadedFotoCapa, ordem: 0 });
        
        // Atualizar veículo com foto capa
        await veiculosRepository.atualizar(veiculo.id, {
          foto_capa: uploadedFotoCapa.url
        });
      }

      // Upload galeria
      for (let i = 0; i < fotos.length; i++) {
        const uploadedFoto = await storageFotos.upload(fotos[i], veiculo.id, 'galeria');
        await storageFotos.salvarMetadadosFoto(veiculo.id, { ...uploadedFoto, ordem: i + 1 });
      }
// Verificar clientes interessados
      const clientesInteressados = await notificadorInteresse.verificarClientesInteressados(veiculo);
      if (clientesInteressados.length > 0) {
        // Registrar notificações no banco
        await notificadorInteresse.registrarNotificacoes(veiculo, clientesInteressados);
        
        // Mostrar notificação formatada
        const notif = notificadorInteresse.formatarNotificacao(veiculo, clientesInteressados);
        setNotificacao(notif);
      }

      
      setToast({
        tipo: 'sucesso',
        mensagem: 'Veículo cadastrado com sucesso!'
      });

      setTimeout(() => {
        navigate('/veiculos');
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      setToast({
        tipo: 'erro',
        mensagem: 'Erro ao cadastrar veículo. Tente novamente.'
      });
    } finally {
      setCarregando(false);
    }
  };

  const opcoesCombustivel = Object.entries(COMBUSTIVEL).map(([key, value]) => ({
    valor: value,
    label: value.charAt(0).toUpperCase() + value.slice(1)
  }));

  const opcoesCambio = Object.entries(CAMBIO).map(([key, value]) => ({
    valor: value,
    label: value.charAt(0).toUpperCase() + value.slice(1)
  }));

  const opcoesStatus = Object.entries(STATUS_VEICULO).map(([key, value]) => ({
    valor: value,
    label: value.charAt(0).toUpperCase() + value.slice(1)
  }));

  return (
    <div className="form-container">
      <h1>Novo Veículo</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Informações Básicas</h2>
          <div className="form-row">
            <Input
              label="Marca"
              placeholder="Ex: BMW"
              valor={formData.marca}
              onChange={handleInputChange}
              obrigatorio
              name="marca"
            />
            <Input
              label="Modelo"
              placeholder="Ex: X5"
              valor={formData.modelo}
              onChange={handleInputChange}
              obrigatorio
              name="modelo"
            />
          </div>

          <div className="form-row">
            <Input
              label="Ano"
              tipo="number"
              valor={formData.ano}
              onChange={handleInputChange}
              obrigatorio
              name="ano"
            />
            <Input
              label="KM"
              tipo="number"
              valor={formData.km}
              onChange={handleInputChange}
              obrigatorio
              name="km"
            />
            <Input
              label="Cor"
              placeholder="Ex: Preto"
              valor={formData.cor}
              onChange={handleInputChange}
              name="cor"
            />
          </div>

          <div className="form-row">
            <Select
              label="Combustível"
              opcoes={opcoesCombustivel}
              valor={formData.combustivel}
              onChange={handleInputChange}
              obrigatorio
              name="combustivel"
            />
            <Select
              label="Câmbio"
              opcoes={opcoesCambio}
              valor={formData.cambio}
              onChange={handleInputChange}
              obrigatorio
              name="cambio"
            />
            <Select
              label="Status"
              opcoes={opcoesStatus}
              valor={formData.status}
              onChange={handleInputChange}
              name="status"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Preço e Descrição</h2>
          <Input
            label="Preço"
            tipo="number"
            placeholder="0.00"
            valor={formData.preco}
            onChange={handleInputChange}
            obrigatorio
            name="preco"
          />

          <TextArea
            label="Descrição"
            placeholder="Descreva o veículo..."
            valor={formData.descricao}
            onChange={handleInputChange}
            name="descricao"
          />

          <Input
            label="Opcionais (separados por vírgula)"
            placeholder="Ar condicionado, Vidro elétrico..."
            valor={formData.opcionais}
            onChange={handleInputChange}
            name="opcionais"
          />
        </div>

        <div className="form-section">
          <h2>Fotos</h2>
          <h3>Foto de Capa (Principal)</h3>
          <Upload
            onUpload={handleUploadFotoCapa}
            aceita="image/*"
            multiplo={false}
          />

          <h3>Galeria (Múltiplas fotos)</h3>
          <Upload
            onUpload={handleUploadGaleria}
            aceita="image/*"
            multiplo={true}
          />

          {fotos.length > 0 && (
            <div className="fotos-preview">
              <p>{fotos.length} foto(s) selecionada(s)</p>
            </div>
          )}
        </div>

        <div className="form-acoes">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/veiculos')}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Salvar Veículo'}
          </button>
        </div>
      </form>

      {toast && (
        <ToastNotificacao
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onFechar={() => setToast(null)}
        />
      )}

      {notificacao && (
        <div className="notificacao-interesse" style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e8f5e9',
          border: '2px solid #4caf50',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>
            ✓ {notificacao.titulo}
          </h3>
          <p style={{ margin: '5px 0', color: '#333' }}>
            <strong>{notificacao.mensagem}</strong>
          </p>
          <p style={{ margin: '5px 0', color: '#555', fontSize: '14px' }}>
            {notificacao.detalhes}
          </p>
          <button
            onClick={() => setNotificacao(null)}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};
