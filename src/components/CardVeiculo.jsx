import React from 'react';
import '../styles/cards.css';

export const CardVeiculo = ({ veiculo, onEditar, onDelete, onDetalhes }) => {
  return (
    <div className="card-veiculo">
      <div className="card-imagem">
        <img src={veiculo.foto_capa || '/placeholder.png'} alt={veiculo.modelo} />
        <span className={`status-badge status-${veiculo.status}`}>
          {veiculo.status}
        </span>
      </div>
      <div className="card-conteudo">
        <h3>{veiculo.marca} {veiculo.modelo}</h3>
        <div className="card-specs">
          <span>{veiculo.ano}</span>
          <span>{veiculo.km.toLocaleString('pt-BR')} km</span>
          <span>{veiculo.combustivel}</span>
        </div>
        <div className="card-preco">
          R$ {veiculo.preco.toLocaleString('pt-BR')}
        </div>
        <div className="card-acoes">
          <button className="btn btn-sm btn-primary" onClick={() => onDetalhes(veiculo.id)}>
            Ver
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => onEditar(veiculo.id)}>
            Editar
          </button>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(veiculo.id)}>
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
};
