import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { veiculosRepository } from '../data/veiculosRepository';
import { storageFotos } from '../data/storageFotos';
import '../styles/detalhe-veiculo.css';

export const DetalheVeiculo = () => {
  const { id } = useParams();
  const [veiculo, setVeiculo] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [fotoAtual, setFotoAtual] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      const dados = await veiculosRepository.obterPorId(id);
      setVeiculo(dados);

      const fotosData = await storageFotos.listarPorVeiculo(id);
      setFotos(fotosData || []);
    } catch (error) {
      console.error('Erro ao carregar veículo:', error);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) return <div className="loading">Carregando...</div>;
  if (!veiculo) return <div className="erro">Veículo não encontrado.</div>;

  const fotosCapa = fotos.filter(f => f.tipo === 'capa');
  const fotosGaleria = fotos.filter(f => f.tipo === 'galeria').sort((a, b) => a.ordem - b.ordem);
  const todasAsFotos = [
    ...fotosCapa.sort((a, b) => a.ordem - b.ordem),
    ...fotosGaleria
  ];

  return (
    <div className="detalhe-container">
      <div className="detalhe-header">
        <button className="btn btn-secondary" onClick={() => navigate('/veiculos')}>
          ← Voltar
        </button>
        <div className="detalhe-titulo">
          <h1>{veiculo.marca} {veiculo.modelo}</h1>
          <span className={`status-badge status-${veiculo.status}`}>{veiculo.status}</span>
        </div>
      </div>

      <div className="detalhe-grid">
        <div className="galeria-container">
          {todasAsFotos.length > 0 ? (
            <>
              <div className="foto-principal">
                <img src={todasAsFotos[fotoAtual]?.url || '/placeholder.png'} alt={veiculo.modelo} />
              </div>
              {todasAsFotos.length > 1 && (
                <div className="thumbnails">
                  {todasAsFotos.map((foto, idx) => (
                    <img
                      key={idx}
                      src={foto.url}
                      alt={`Thumb ${idx}`}
                      className={fotoAtual === idx ? 'ativo' : ''}
                      onClick={() => setFotoAtual(idx)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="sem-foto">Nenhuma foto disponível</div>
          )}
        </div>

        <div className="detalhes-info">
          <div className="info-section">
            <h2>Informações Gerais</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Ano</label>
                <span>{veiculo.ano}</span>
              </div>
              <div className="info-item">
                <label>KM</label>
                <span>{veiculo.km.toLocaleString('pt-BR')} km</span>
              </div>
              <div className="info-item">
                <label>Cor</label>
                <span>{veiculo.cor}</span>
              </div>
              <div className="info-item">
                <label>Combustível</label>
                <span>{veiculo.combustivel}</span>
              </div>
              <div className="info-item">
                <label>Câmbio</label>
                <span>{veiculo.cambio}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h2>Preço</h2>
            <div className="preco-destaque">
              R$ {veiculo.preco.toLocaleString('pt-BR')}
            </div>
          </div>

          {veiculo.descricao && (
            <div className="info-section">
              <h2>Descrição</h2>
              <p>{veiculo.descricao}</p>
            </div>
          )}

          {veiculo.opcionais && veiculo.opcionais.length > 0 && (
            <div className="info-section">
              <h2>Opcionais</h2>
              <ul className="opcionais-list">
                {(Array.isArray(veiculo.opcionais) ? veiculo.opcionais : []).map((opt, idx) => (
                  <li key={idx}>✓ {opt}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="detalhes-acoes">
            <button 
              className="btn btn-primary"
              onClick={() => navigate(`/veiculos/${id}/editar`)}
            >
              Editar
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/veiculos')}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
