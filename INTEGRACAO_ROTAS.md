# Integração do CRM - Guia de Rotas

## Adicionando Rotas ao App.jsx

Para integrar completamente o CRM no seu aplicativo, você precisa adicionar as rotas no arquivo `App.jsx`.

---

## 📍 Rotas Necessárias

### 1. Formulário de Cliente
```jsx
<Route path="/clientes/novo" element={<FormCliente />} />
<Route path="/clientes/editar/:id" element={<FormCliente />} />
```

### 2. Lista de Clientes (já deve existir)
```jsx
<Route path="/clientes" element={<ListaClientes />} />
```

### 3. Página de Aniversariantes
```jsx
<Route path="/aniversariantes" element={<Aniversariantes />} />
```

---

## 🔗 Exemplo Completo em App.jsx

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

// Páginas
import { TelaLogin } from './pages/TelaLogin';
import { Dashboard } from './pages/Dashboard';
import { ListaClientes } from './pages/ListaClientes';
import { FormCliente } from './pages/FormCliente';
import { ListaVeiculos } from './pages/ListaVeiculos';
import { FormNovoVeiculo } from './pages/FormNovoVeiculo';
import { FormEditarVeiculo } from './pages/FormEditarVeiculo';
import { DetalheVeiculo } from './pages/DetalheVeiculo';
import { Aniversariantes } from './pages/Aniversariantes'; // ← NOVO

// Proteção de rotas
import { RotaProtegida } from './components/RotaProtegida';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<TelaLogin />} />
        
        <Route element={<RotaProtegida><Layout /></RotaProtegida>}>
          <Route path="/" element={<Dashboard />} />
          
          {/* Rotas de Clientes */}
          <Route path="/clientes" element={<ListaClientes />} />
          <Route path="/clientes/novo" element={<FormCliente />} />
          <Route path="/clientes/editar/:id" element={<FormCliente />} />
          
          {/* Rotas de Veículos */}
          <Route path="/veiculos" element={<ListaVeiculos />} />
          <Route path="/veiculos/novo" element={<FormNovoVeiculo />} />
          <Route path="/veiculos/editar/:id" element={<FormEditarVeiculo />} />
          <Route path="/veiculos/:id" element={<DetalheVeiculo />} />
          
          {/* Rotas do CRM */}
          <Route path="/aniversariantes" element={<Aniversariantes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🧭 Integração com Sidebar

Para adicionar link no menu lateral, edite `components/Sidebar.jsx`:

```jsx
// Adicione em seu array de menus:
{
  label: '🎂 Aniversariantes',
  path: '/aniversariantes',
  icon: '🎉'
}
```

---

## 📌 Imports Necessários

Certifique-se de importar:

```javascript
// Em App.jsx
import { Aniversariantes } from './pages/Aniversariantes';

// Em Sidebar.jsx (se aplicável)
// Link já deve estar configurado
```

---

## 🧪 Verificar Integração

Após adicionar as rotas:

1. **Verifique rotas de cliente**
   - Acesse: `http://localhost:5173/clientes`
   - Acesse: `http://localhost:5173/clientes/novo`
   - Acesse: `http://localhost:5173/clientes/editar/[id]`

2. **Verifique página de aniversariantes**
   - Acesse: `http://localhost:5173/aniversariantes`
   - Deve carregar lista de clientes com aniversário

3. **Teste fluxo completo**
   - Cadastre cliente com data de nascimento
   - Acesse página de aniversariantes
   - Tente visualizar e enviar email

---

## ⚙️ Variáveis de Ambiente

Não são necessárias novas variáveis. O CRM usa:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

(Já devem estar em `.env`)

---

## 🎨 Customização

### Mudar Cor do Gradiente

Em `src/styles/aniversariantes.css`:

```css
/* Encontre */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Substitua por suas cores */
background: linear-gradient(135deg, #SUACOR1 0%, #SUACOR2 100%);
```

### Customizar Email

Em `src/utils/emailAniversario.js`, função `gerarConteudoEmail()`:

```javascript
const corpo = `Olá ${cliente.nome},

[Customize a mensagem aqui]

Abraços,
Seu Nome/Empresa`;
```

---

## 🔒 Proteção de Rotas

Todas as rotas do CRM estão protegidas por `<RotaProtegida>`.

Para desproteger (não recomendado):
```jsx
<Route path="/aniversariantes" element={<Aniversariantes />} />
```

---

## 📊 Layout Responsivo

Página já é responsiva para:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

---

## 🚀 Deploy

Para deploy em produção:

1. Execute: `npm run build`
2. Verifique se todas as rotas funcionam
3. Configure variáveis de ambiente no host
4. Deploy normalmente

---

## ❓ Dúvidas Frequentes

**P: Posso remover alguma rota?**  
R: Sim. Remova a rota correspondente do App.jsx

**P: Como adicionar mais campos ao cliente?**  
R: Edite tabela no Supabase, depois formário em FormCliente.jsx

**P: Posso mudar a URL da rota?**  
R: Sim. Edite path em App.jsx e atualize links

**P: Email não funciona?**  
R: Necessário cliente de email configurado no SO. Teste manualmente.

---

## 📝 Checklist Final

- [ ] Rotas adicionadas ao App.jsx
- [ ] Componente importado corretamente
- [ ] Layout (Sidebar) atualizado
- [ ] Variáveis de ambiente verificadas
- [ ] Banco de dados configurado (setup-crm-database.sql)
- [ ] Página carrega sem erros (F12 Console)
- [ ] Teste cadastro de cliente com data
- [ ] Teste página de aniversariantes
- [ ] Teste notificação ao adicionar veículo

---

**Pronto para usar!** 🎉
