import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { veiculosRepository } from '../data/veiculosRepository';
import '../styles/dashboard.css';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVeiculos: 0,
    ultimosCadastrados: []
  });
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const veiculos = await veiculosRepository.listar();
      
      setStats({
        totalVeiculos: veiculos.length,
        ultimosCadastrados: veiculos.slice(0, 5)
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>

      {carregando ? (
        <div className="loading">Carregando...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total de Veículos</h3>
              <div className="stat-numero">{stats.totalVeiculos}</div>
            </div>
            <div className="stat-card">
              <h3>Disponíveis</h3>
              <div className="stat-numero">
                {stats.ultimosCadastrados.filter(v => v.status === 'disponível').length}
              </div>
            </div>
            <div className="stat-card">
              <h3>Reservados</h3>
              <div className="stat-numero">
                {stats.ultimosCadastrados.filter(v => v.status === 'reservado').length}
              </div>
            </div>
            <div className="stat-card">
              <h3>Vendidos</h3>
              <div className="stat-numero">
                {stats.ultimosCadastrados.filter(v => v.status === 'vendido').length}
              </div>
            </div>
          </div>

          <div className="ultimos-cadastrados">
            <h2>Últimos Cadastrados</h2>
            <table className="tabela">
              <thead>
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Ano</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {stats.ultimosCadastrados.map(veiculo => (
                  <tr key={veiculo.id}>
                    <td>{veiculo.marca}</td>
                    <td>{veiculo.modelo}</td>
                    <td>{veiculo.ano}</td>
                    <td>R$ {veiculo.preco.toLocaleString('pt-BR')}</td>
                    <td><span className={`status-badge status-${veiculo.status}`}>{veiculo.status}</span></td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => navigate(`/veiculos/${veiculo.id}`)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dashboard-acoes">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/veiculos/novo')}
            >
              + Novo Veículo
            </button>
            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/veiculos')}
            >
              Ver Todos os Veículos
            </button>
          </div>
        </>
      )}
    </div>
  );
};
