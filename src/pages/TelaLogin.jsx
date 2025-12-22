import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validarLogin, criarSessao } from '../utils/auth';
import { Input } from '../components/FormInputs';
import { ToastNotificacao } from '../components/ToastNotificacao';
import logo from '../assets/logo-toncar.svg';
import '../styles/login.css';

export const TelaLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setCarregando(true);

    setTimeout(() => {
      if (validarLogin(email, senha)) {
        criarSessao(email);
        navigate('/dashboard');
      } else {
        setErro('Email ou senha inválidos');
      }
      setCarregando(false);
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo-container">
          <img src={logo} alt="TonCar Multimarcas" className="login-logo" />
        </div>
        <p className="login-subtitle">Gerenciador de Veículos</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email ou Usuário"
            tipo="email"
            placeholder="admin@toncar.com.br"
            valor={email}
            onChange={(e) => setEmail(e.target.value)}
            obrigatorio
          />

          <Input
            label="Senha"
            tipo="password"
            placeholder="••••••••"
            valor={senha}
            onChange={(e) => setSenha(e.target.value)}
            erro={erro}
            obrigatorio
          />

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-info">
          <p><strong>Demo:</strong></p>
          <p>Email: admin@toncar.com.br</p>
          <p>Senha: admin123456</p>
        </div>
      </div>
    </div>
  );
};
