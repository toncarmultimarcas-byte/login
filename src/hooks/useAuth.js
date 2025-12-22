import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { verificarSessao, logout } from '../utils/auth';

export const useProtecaoRota = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!verificarSessao()) {
      logout();
      navigate('/login');
    }
  }, [navigate]);

  return null;
};

export const useAuth = () => {
  const navigate = useNavigate();

  const fazerLogout = () => {
    logout();
    navigate('/login');
  };

  return {
    estaAutenticado: verificarSessao(),
    logout: fazerLogout
  };
};
