import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProtecaoRota } from '../hooks/useAuth';

export const RotaProtegida = ({ children }) => {
  useProtecaoRota();
  return children;
};
