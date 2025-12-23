// EXEMPLO DE INTEGRACAO NO App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CustomersPage } from './pages/CustomersPage';
import Dashboard from './pages/Dashboard';
import TelaLogin from './pages/TelaLogin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Sua rota de login existente */}
        <Route path="/login" element={<TelaLogin />} />

        {/* Dashboard existente */}
        <Route path="/" element={<Dashboard />} />

        {/* NOVA ROTA: Clientes CRM */}
        <Route path="/clientes" element={<CustomersPage />} />

        {/* Outras rotas existentes */}
        <Route path="/veiculos" element={/* ... */} />
        <Route path="/aniversariantes" element={/* ... */} />
        {/* ... mais rotas ... */}
      </Routes>
    </Router>
  );
}

export default App;


// ─────────────────────────────────────────────────────────────────
// ALTERNATIVA: Se usar React Router v6 com Layout

import { Layout } from './components/Layout';
import { CustomersPage } from './pages/CustomersPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<CustomersPage />} />
          <Route path="/veiculos" element={/* ... */} />
        </Route>
        <Route path="/login" element={<TelaLogin />} />
      </Routes>
    </Router>
  );
}

export default App;


// ─────────────────────────────────────────────────────────────────
// NAVEGACAO: Adicionar link no Sidebar ou Menu

// Em seu Sidebar.jsx ou Header.jsx:

import { Link } from 'react-router-dom';

export function Sidebar() {
  return (
    <nav className="w-64 bg-gray-900 text-white p-4">
      <ul className="space-y-4">
        <li>
          <Link to="/" className="hover:text-blue-400">
            Dashboard
          </Link>
        </li>

        {/* NOVO LINK: Clientes */}
        <li>
          <Link to="/clientes" className="hover:text-blue-400">
            Clientes CRM
          </Link>
        </li>

        <li>
          <Link to="/veiculos" className="hover:text-blue-400">
            Veiculos
          </Link>
        </li>

        <li>
          <Link to="/aniversariantes" className="hover:text-blue-400">
            Aniversariantes
          </Link>
        </li>

        {/* ... mais links ... */}
      </ul>
    </nav>
  );
}


// ─────────────────────────────────────────────────────────────────
// OPCIONAL: Proteger rota com autenticacao

// Em RotaProtegida.jsx (que ja existe no seu projeto):

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function RotaProtegida({ element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return element;
}

// Usar assim:
<Route
  path="/clientes"
  element={
    <RotaProtegida element={<CustomersPage />} />
  }
/>


// ─────────────────────────────────────────────────────────────────
// VERIFICACAO DE .env.local

// No seu main.jsx ou index.jsx, você pode adicionar uma verificacao:

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Verificar variaveis de ambiente
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error(
    'ERRO: Faltam variaveis de ambiente. Configure .env.local com:',
    'VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY'
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// ─────────────────────────────────────────────────────────────────
// ESTILOS GLOBAIS (Tailwind)

// Se precisar customizar cores do CRM, adicione em seu Tailwind config:

// tailwind.config.js

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'status-novo': '#3b82f6',
        'status-curioso': '#06b6d4',
        'status-interessado': '#eab308',
        'status-negociacao': '#a855f7',
        'status-perdido': '#ef4444',
        'status-comprou': '#22c55e',
        'status-sem-interesse': '#6b7280',
      },
    },
  },
  plugins: [],
};

// Depois pode usar: className="bg-status-novo" etc


// ─────────────────────────────────────────────────────────────────
// DICA: Importar CustomersPage dinamicamente (para code splitting)

import { lazy, Suspense } from 'react';

const CustomersPage = lazy(() =>
  import('./pages/CustomersPage').then(m => ({
    default: m.CustomersPage
  }))
);

<Route
  path="/clientes"
  element={
    <Suspense fallback={<div>Carregando CRM...</div>}>
      <CustomersPage />
    </Suspense>
  }
/>
