# Setup CRM - Clientes

## 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto AutoElite-Painel:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

Obtenha essas chaves no painel do Supabase > Project Settings > API.

## 2. Instalar Dependências

```bash
npm install @supabase/supabase-js date-fns @heroicons/react
```

Se ainda não tiver TypeScript configurado (e quiser):
```bash
npm install -D typescript @types/react @types/react-dom
```

## 3. Executar SQL no Supabase

No painel do Supabase:
1. Vá em **SQL Editor** > **New Query**
2. Cole o conteúdo de `migrations/001_create_customers_table.sql`
3. Clique **Run**

Isso criará:
- Enum `customer_status`
- Tabela `customers`
- Triggers para `updated_at` e `archived_until`
- Views `customers_active` e `customers_archived`
- Índices de performance
- Policies RLS

## 4. Estrutura de Pastas

Após seguir os passos acima, seu projeto terá:

```
AutoElite-Painel/
  migrations/
    001_create_customers_table.sql
  src/
    lib/
      supabaseClient.ts
      tipos.ts
    services/
      customersService.ts
    hooks/
      useCustomers.ts
    components/customers/
      StatusBadge.tsx
      StatusDropdown.tsx
      CustomerRowActions.tsx
      CustomersTable.tsx
    pages/
      CustomersPage.tsx
```

## 5. Integrar no App.jsx

No seu arquivo `src/App.jsx`, importe e use:

```jsx
import { CustomersPage } from './pages/CustomersPage';

function App() {
  return (
    <div>
      {/* outras rotas */}
      <CustomersPage />
    </div>
  );
}

export default App;
```

Ou, se usar React Router:

```jsx
import { CustomersPage } from './pages/CustomersPage';

<Route path="/clientes" element={<CustomersPage />} />
```

## 6. Recursos

- **Arquivos de SQL**: Definem triggers automáticos para `archived_until` baseado em status
- **Services**: Encapsulam lógica de API (fetchActiveCustomers, updateCustomerStatus, etc)
- **Hooks**: Gerenciam estado (loading, filtering, real-time subscriptions)
- **Components**: UI reusável (StatusBadge, StatusDropdown, CustomersTable)
- **RLS**: Apenas usuários autenticados podem acessar

## 7. Fluxo de Funcionalidades

### Clientes Ativos
- Busca clientes onde `archived_until IS NULL OR archived_until <= now()`
- Dropdowns para trocar status
- Campo para próximo follow-up
- Busca por nome/telefone/email
- Filtro por status

### Clientes Arquivados
- Busca clientes onde `archived_until > now()`
- Mostra quando desarchivará automaticamente
- Clique em status para reativar manualmente (muda para um status não-final)

### Automação
- Se mudar status para PERDIDO, COMPROU ou SEM_INTERESSE:
  `archived_until = agora + 6 meses`
- Se mudar para qualquer outro status:
  `archived_until = NULL`
- Tudo automático via trigger SQL

## 8. Próximos Passos (Opcional)

- Criar modal para editar todos os campos do cliente
- Adicionar formulário de novo cliente
- Integrar com dashboard de dashboard de estatísticas
- Adicionar notificações para follow-up próximo
- Exportar clientes para CSV
- Integrar com API de CRM externo (Pipedrive, etc)
