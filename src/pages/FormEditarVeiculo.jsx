import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { veiculosRepository } from '../data/veiculosRepository';
import { storageFotos } from '../data/storageFotos';
import { Input, TextArea, Select } from '../components/FormInputs';
import { ToastNotificacao } from '../components/ToastNotificacao';
import { ModalConfirmacao } from '../components/ModalConfirmacao';
import { STATUS_VEICULO, COMBUSTIVEL, CAMBIO } from '../config/constantes';
import '../styles/form-veiculo.css';

export const FormEditarVeiculo = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [novasFotos, setNovasFotos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [toast, setToast] = useState(null);
  const [modalDeletarFoto, setModalDeletarFoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      const veiculo = await veiculosRepository.obterPorId(id);
      setFormData(veiculo);

      const fotosData = await storageFotos.listarPorVeiculo(id);
      setFotos(fotosData || []);
    } catch (error) {
      console.error('Erro ao carregar veículo:', error);
      setToast({
        tipo: 'erro',
        mensagem: 'Erro ao carregar veículo.'
      });
    } finally {
      setCarregando(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFoto = (novasFotosArquivos) => {
    setNovasFotos(prev => [...prev, ...novasFotosArquivos]);
  };

  const handleRemoverFoto = async () => {
    try {
      await storageFotos.deletar(
        modalDeletarFoto.caminho,
        modalDeletarFoto.id
      );
      setFotos(prev => prev.filter(f => f.id !== modalDeletarFoto.id));
      setToast({
        tipo: 'sucesso',
        mensagem: 'Foto removida com sucesso!'
      });
      setModalDeletarFoto(null);
    } catch (error) {
      console.error('Erro ao remover foto:', error);
      setToast({
        tipo: 'erro',
        mensagem: 'Erro ao remover foto.'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);

    try {
      // Atualizar dados do veículo
      const opcionaisArray = Array.isArray(formData.opcionais)
        ? formData.opcionais
        : formData.opcionais.split(',').map(o => o.trim()).filter(Boolean);

      await veiculosRepository.atualizar(id, {
        ...formData,
        ano: parseInt(formData.ano),
        km: parseInt(formData.km),
        preco: parseFloat(formData.preco),
        opcionais: opcionaisArray
      });

      // Upload novas fotos
      if (novasFotos.length > 0) {
        const proximaOrdem = fotos.length;
        for (let i = 0; i < novasFotos.length; i++) {
          const uploadedFoto = await storageFotos.upload(novasFotos[i], id, 'galeria');
          await storageFotos.salvarMetadadosFoto(id, {
            ...uploadedFoto,
            ordem: proximaOrdem + i
          });
        }
      }

      setToast({
        tipo: 'sucesso',
        mensagem: 'Veículo atualizado com sucesso!'
      });

      setTimeout(() => {
        navigate('/veiculos');
      }, 2000);
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      setToast({
        tipo: 'erro',
        mensagem: 'Erro ao atualizar veículo.'
      });
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) return <div className="loading">Carregando...</div>;
  if (!formData) return <div className="erro">Veículo não encontrado.</div>;

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
      <h1>Editar Veículo</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Informações Básicas</h2>
          <div className="form-row">
            <Input
              label="Marca"
              valor={formData.marca}
              onChange={handleInputChange}
              name="marca"
              obrigatorio
            />
            <Input
              label="Modelo"
              valor={formData.modelo}
              onChange={handleInputChange}
              name="modelo"
              obrigatorio
            />
          </div>

          <div className="form-row">
            <Input
              label="Ano"
              tipo="number"
              valor={formData.ano}
              onChange={handleInputChange}
              name="ano"
              obrigatorio
            />
            <Input
              label="KM"
              tipo="number"
              valor={formData.km}
              onChange={handleInputChange}
              name="km"
              obrigatorio
            />
            <Input
              label="Cor"
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
              name="combustivel"
              obrigatorio
            />
            <Select
              label="Câmbio"
              opcoes={opcoesCambio}
              valor={formData.cambio}
              onChange={handleInputChange}
              name="cambio"
              obrigatorio
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
            valor={formData.preco}
            onChange={handleInputChange}
            name="preco"
            obrigatorio
          />

          <TextArea
            label="Descrição"
            valor={formData.descricao || ''}
            onChange={handleInputChange}
            name="descricao"
          />

          <Input
            label="Opcionais (separados por vírgula)"
            valor={Array.isArray(formData.opcionais) ? formData.opcionais.join(', ') : formData.opcionais || ''}
            onChange={handleInputChange}
            name="opcionais"
          />
        </div>

        <div className="form-section">
          <h2>Gerenciar Fotos</h2>
          <h3>Fotos Atuais</h3>
          {fotos.length > 0 ? (
            <div className="fotos-lista">
              {fotos.map(foto => (
                <div key={foto.id} className="foto-item">
                  <img src={foto.url} alt="Foto" />
                  <div className="foto-info">
                    <p>{foto.tipo}</p>
                    <p className="foto-ordem">Ordem: {foto.ordem}</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setModalDeletarFoto(foto)}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhuma foto adicionada ainda.</p>
          )}

          <h3>Adicionar Novas Fotos</h3>
          <div className="form-group">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleAddFoto(Array.from(e.target.files))}
            />
          </div>

          {novasFotos.length > 0 && (
            <p>{novasFotos.length} nova(s) foto(s) para upload</p>
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
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Atualizar Veículo'}
          </button>
        </div>
      </form>

      {modalDeletarFoto && (
        <ModalConfirmacao
          titulo="Remover Foto"
          mensagem="Tem certeza que deseja remover esta foto? Esta ação não pode ser desfeita."
          onConfirmar={handleRemoverFoto}
          onCancelar={() => setModalDeletarFoto(null)}
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
