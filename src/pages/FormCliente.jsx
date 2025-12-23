import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientesRepository } from '../data/clientesRepository';
import { Input, TextArea } from '../components/FormInputs';
import { ToastNotificacao } from '../components/ToastNotificacao';
import SeletorStatusCliente from '../components/SeletorStatusCliente';
import '../styles/form-veiculo.css'; // Reutilizando estilos de form

export const FormCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    faixa_preco: '',
    modelo_interesse: '',
    marca_interesse: '',
    data_nascimento: '',
    endereco: '',
    observacoes: '',
    status: 'NOVO',
    ativo: true
  });
  const [carregando, setCarregando] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (id) {
      carregarCliente();
    }
  }, [id]);

  const carregarCliente = async () => {
    try {
      setCarregando(true);
      const dados = await clientesRepository.buscarPorId(id);
      if (dados) {
        setFormData(dados);
      }
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
      setToast({ tipo: 'erro', mensagem: 'Erro ao carregar dados do cliente.' });
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome) {
      setToast({ tipo: 'erro', mensagem: 'O nome é obrigatório.' });
      return;
    }

    try {
      setCarregando(true);
      if (id) {
        await clientesRepository.atualizar(id, formData);
        setToast({ tipo: 'sucesso', mensagem: 'Cliente atualizado com sucesso!' });
      } else {
        await clientesRepository.criar(formData);
        setToast({ tipo: 'sucesso', mensagem: 'Cliente cadastrado com sucesso!' });
        // Limpar form se for novo cadastro
        if (!id) {
          setFormData({
            nome: '',
            email: '',
            telefone: '',
            cpf: '',
            faixa_preco: '',
            modelo_interesse: '',
            marca_interesse: '',
            data_nascimento: '',
            endereco: '',
            observacoes: '',
            status: 'NOVO',
            ativo: true
          });
        }
      }
      
      // Redirecionar após breve delay
      setTimeout(() => {
        navigate('/clientes');
      }, 1500);

    } catch (error) {
      console.error('Erro ao salvar:', error);
      setToast({ tipo: 'erro', mensagem: 'Erro ao salvar cliente.' });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="form-container">
      <h1>{id ? 'Editar Cliente' : 'Novo Cliente'}</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Dados Pessoais</h2>
          
          <div className="form-row">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <Input
                label="Nome Completo"
                name="nome"
                valor={formData.nome}
                onChange={handleChange}
                obrigatorio
              />
            </div>
            <div className="form-group">
              <Input
                label="CPF"
                name="cpf"
                valor={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <Input
                label="Telefone/WhatsApp"
                name="telefone"
                valor={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <Input
                label="E-mail"
                name="email"
                type="email"
                valor={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <TextArea
              label="Endereço Completo"
              name="endereco"
              valor={formData.endereco}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Interesses de Compra</h2>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <SeletorStatusCliente
              valor={formData.status}
              onChange={(novoStatus) => setFormData(prev => ({ ...prev, status: novoStatus }))}
              mostrarDescricao={true}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <Input
                label="Data de Nascimento"
                name="data_nascimento"
                type="date"
                valor={formData.data_nascimento}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <Input
                label="Marca de Interesse"
                name="marca_interesse"
                valor={formData.marca_interesse}
                onChange={handleChange}
                placeholder="Ex: Volkswagen, Toyota, Chevrolet..."
              />
            </div>
            <div className="form-group">
              <Input
                label="Modelo de Interesse"
                name="modelo_interesse"
                valor={formData.modelo_interesse}
                onChange={handleChange}
                placeholder="Ex: Gol, Civic, Corolla..."
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="faixa_preco" className="label-form">
              Faixa de Preço
            </label>
            <select
              id="faixa_preco"
              name="faixa_preco"
              value={formData.faixa_preco}
              onChange={handleChange}
              className="input-form"
            >
              <option value="">Selecione uma faixa</option>
              <option value="até_20mil">Até R$ 20 mil</option>
              <option value="20mil_40mil">R$ 20 mil - R$ 40 mil</option>
              <option value="40mil_60mil">R$ 40 mil - R$ 60 mil</option>
              <option value="60mil_100mil">R$ 60 mil - R$ 100 mil</option>
              <option value="acima_100mil">Acima de R$ 100 mil</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h2>Observações</h2>
          <div className="form-group">
            <TextArea
              label="Notas Internas"
              name="observacoes"
              valor={formData.observacoes}
              onChange={handleChange}
              placeholder="Preferências do cliente, histórico, etc..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/clientes')}
            disabled={carregando}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Salvar Cliente'}
          </button>
        </div>
      </form>

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
