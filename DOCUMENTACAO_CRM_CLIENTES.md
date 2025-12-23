# Documentacao - CRM Clientes

## Visao Geral

Sistema CRM para agência de carros com gerenciamento de cliente e pipeline de vendas automatizado.

## Arquitetura

### Banco de Dados (Supabase PostgreSQL)

#### Tabela: `customers`
- **id** (UUID): Identificador único
- **name** (TEXT): Nome do cliente
- **phone** (TEXT): Telefone
- **email** (TEXT): Email
- **birth_date** (DATE): Data de nascimento
- **interest_brand** (TEXT): Marca de interesse
- **interest_model** (TEXT): Modelo de interesse
- **interest_year_min / interest_year_max** (INT): Faixa de ano
- **interest_notes** (TEXT): Notas sobre interesse
- **status** (ENUM): NOVO, CURIOSO, INTERESSADO, EM_NEGOCIACAO, PERDIDO, COMPROU, SEM_INTERESSE
- **status_reason** (TEXT): Por que mudou de status
- **next_follow_up_at** (TIMESTAMPTZ): Proxima data de acompanhamento
- **archived_until** (TIMESTAMPTZ): Data até quando o cliente fica arquivado
- **created_at / updated_at** (TIMESTAMPTZ): Timestamps

#### Triggers Automáticos
1. **update_archived_until**: Quando status muda para PERDIDO/COMPROU/SEM_INTERESSE, arquiva por 6 meses. Caso contrário, limpa arquivo.
2. **update_customers_updated_at**: Mantém `updated_at` sincronizado.

#### Views
- **customers_active**: Clientes ativos (archived_until IS NULL OU já expirou)
- **customers_archived**: Clientes arquivados (archived_until > agora)

### Front-end (React + Vite)

#### Estrutura
```
src/
  lib/
    supabaseClient.ts        - Cliente Supabase
    tipos.ts                 - TypeScript types e enums
  services/
    customersService.ts      - Lógica de API/Supabase
  hooks/
    useCustomers.ts          - State e subscriptions em tempo real
  components/customers/
    StatusBadge.tsx          - Badge colorida de status
    StatusDropdown.tsx       - Dropdown para trocar status
    CustomerRowActions.tsx   - Botoes de acao (follow-up, delete)
    CustomersTable.tsx       - Tabela de clientes
  pages/
    CustomersPage.tsx        - Pagina principal
```

#### Fluxo de Dados
1. **CustomersPage** renderiza com filtros (ativos/arquivados, busca, status)
2. **useCustomers** hook busca dados e gerencia estado
3. **customersService** faz chamadas ao Supabase
4. **CustomersTable** renderiza lista
5. Ao clicar em status/follow-up, atualiza via **customersService**
6. Supabase emite evento via RealtimeChannel (subscribeToCustomersChanges)
7. **useCustomers** atualiza estado localmente

#### Recursos
- **Otimismo**: Atualiza UI antes de confirmar no servidor
- **Real-time**: Subscreve a mudancas na tabela customers
- **Filtros**: Busca por nome/telefone/email, status, ativos/arquivados
- **RLS**: Apenas usuários autenticados acessam

### Segurança (RLS - Row Level Security)

Policies configuradas no Supabase:
- SELECT: Usuários autenticados
- INSERT: Usuários autenticados
- UPDATE: Usuários autenticados
- DELETE: Usuários autenticados

Cenario single-tenant: todos logados compartilham dados. Para multi-tenant, adicione `user_id` na tabela e refine policies.

## Fluxo de Uso

### 1. Criar Cliente
```typescript
const newCustomer = await createCustomer({
  name: "João Silva",
  phone: "11999999999",
  email: "joao@example.com",
  interest_brand: "Toyota",
  interest_model: "Corolla",
});
```

### 2. Ver Clientes Ativos
```typescript
const customers = await fetchActiveCustomers();
// Mostra apenas onde archived_until IS NULL ou ja expirou
```

### 3. Trocar Status
```typescript
await updateCustomerStatus(customerId, CustomerStatus.INTERESSADO, "Cliente pediu mais info");
// Triggers automáticos atualizam archived_until se necessário
```

### 4. Agendar Follow-up
```typescript
await updateFollowUpDate(customerId, "2025-01-15T14:00:00Z");
```

### 5. Ver Clientes Arquivados
```typescript
const archived = await fetchArchivedCustomers();
// Mostra apenas onde archived_until > agora
```

### 6. Reativar Cliente Arquivado
Ao mudar status de qualquer cliente arquivado para um status ativo (nao PERDIDO/COMPROU/SEM_INTERESSE), o trigger limpa `archived_until` e ele volta a aparecer em "Ativos".

## Detalhes Tecnicos

### Trigger: update_archived_until
```sql
IF NEW.status IN ('COMPROU', 'SEM_INTERESSE', 'PERDIDO') THEN
  NEW.archived_until = now() + INTERVAL '6 months';
ELSE
  NEW.archived_until = NULL;
END IF;
```

**Efeito**: Garante que arquivo nunca é inconsistente com status.

### Subscrição Real-time
```typescript
supabase
  .channel('public:customers')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'customers' },
    (payload) => {
      // INSERT / UPDATE / DELETE
      // Atualiza estado localmente
    }
  )
  .subscribe();
```

**Efeito**: Se outro usuario no Painel muda cliente X, todos veem atualizado em tempo real.

### Otimismo
```typescript
// Antes de esperar servidor
setCustomers(prev => prev.map(c => c.id === id ? {...c, status: newStatus} : c));

// Depois, se erro, reverter
try {
  await updateCustomerStatus(id, newStatus);
} catch {
  setCustomers(oldCustomers);
}
```

**Efeito**: UI responde imediatamente, mas volta atras se falhar.

## Extensoes Futuras

### Multi-tenant
Adicione `account_id` ou `team_id` na tabela e nas policies RLS.

### Notificacoes
Use Edge Functions do Supabase para avisar sobre follow-ups proximos.

### Integracao com CRM Externo
Sincronize com Pipedrive, HubSpot, etc via cron jobs ou webhooks.

### Dashboard
Graficos de status distribution, conversão, etc.

### Exports
CSV, PDF com dados dos clientes.

### Tags / Categorias
Adicione campo `tags` (array) para categorizar clientes.
