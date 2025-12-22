import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TelaLogin } from './pages/TelaLogin';
import { Dashboard } from './pages/Dashboard';
import { ListaVeiculos } from './pages/ListaVeiculos';
import { FormNovoVeiculo } from './pages/FormNovoVeiculo';
import { DetalheVeiculo } from './pages/DetalheVeiculo';
import { FormEditarVeiculo } from './pages/FormEditarVeiculo';
import { ListaClientes } from './pages/ListaClientes';
import { FormCliente } from './pages/FormCliente';
import { ListaNotificacoes } from './pages/ListaNotificacoes';
import { Aniversariantes } from './pages/Aniversariantes';
import { RotaProtegida } from './components/RotaProtegida';
import { Layout } from './components/Layout';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<TelaLogin />} />
        
        <Route path="/dashboard" element={
          <RotaProtegida>
            <Layout>
              <Dashboard />
            </Layout>
          </RotaProtegida>
        } />

        <Route path="/veiculos" element={
          <RotaProtegida>
            <Layout>
              <ListaVeiculos />
            </Layout>
          </RotaProtegida>
        } />

        <Route path="/veiculos/novo" element={
          <RotaProtegida>
            <Layout>
              <FormNovoVeiculo />
            </Layout>
          </RotaProtegida>
        } />

        <Route path="/veiculos/:id" element={
          <RotaProtegida>
            <Layout>
              <DetalheVeiculo />
            </Layout>
          </RotaProtegida>
        } />

        <Route path="/veiculos/:id/editar" element={
          <RotaProtegida>
            <Layout>
              <FormEditarVeiculo />
            </Layout>
          </RotaProtegida>
        } />

        {/* Rotas CRM Clientes */}
        <Route path="/clientes" element={
          <RotaProtegida>
            <Layout>
              <ListaClientes />
            </Layout>
          </RotaProtegida>
        } />

        <Route path="/clientes/novo" element={
          <RotaProtegida>
            <Layout>
              <FormCliente />
            </Layout>
          </RotaProtegida>
        } />

        <Route path="/clientes/:id/editar" element={
          <RotaProtegida>
            <Layout>
              <FormCliente />
            </Layout>
          </RotaProtegida>
        } />

        <Route path="/notificacoes" element={
          <RotaProtegida>
            <Layout>
              <ListaNotificacoes />
            </Layout>
          </RotaProtegida>
        } />

        <Route path="/aniversariantes" element={
          <RotaProtegida>
            <Layout>
              <Aniversariantes />
            </Layout>
          </RotaProtegida>
        } />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
