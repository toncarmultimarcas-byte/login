# CHECKLIST DE IMPLEMENTACAO - CRM CLIENTES

## Fase 1: Preparacao (Antes de Codificar)

- [ ] Ter conta no Supabase criada
- [ ] Projeto Supabase criado
- [ ] Copiar URL do projeto (VITE_SUPABASE_URL)
- [ ] Copiar chave anonima (VITE_SUPABASE_ANON_KEY)
- [ ] Projeto React + Vite ja funcionando

## Fase 2: Backend (Supabase)

- [ ] Executar SQL completo de `migrations/001_create_customers_table.sql`
  - [ ] Enum `customer_status` criado
  - [ ] Tabela `customers` criada com todos campos
  - [ ] Trigger `update_archived_until` criado
  - [ ] Trigger `update_customers_updated_at` criado
  - [ ] View `customers_active` criada
  - [ ] View `customers_archived` criada
  - [ ] Indices criados (status, archived_until, next_follow_up_at, created_at, name)
  - [ ] RLS ativado na tabela customers
  - [ ] Policies criadas (SELECT, INSERT, UPDATE, DELETE)

## Fase 3: Instalacao de Dependencias

- [ ] `npm install @supabase/supabase-js`
- [ ] `npm install date-fns`
- [ ] `npm install @heroicons/react`
- [ ] TypeScript ja configurado (ou usar .js/.jsx)

## Fase 4: Arquivos Front-end

- [ ] Copiar `src/lib/supabaseClient.ts` para projeto
- [ ] Copiar `src/lib/tipos.ts` para projeto
- [ ] Copiar `src/services/customersService.ts` para projeto
- [ ] Copiar `src/hooks/useCustomers.ts` para projeto
- [ ] Copiar `src/components/customers/StatusBadge.tsx` para projeto
- [ ] Copiar `src/components/customers/StatusDropdown.tsx` para projeto
- [ ] Copiar `src/components/customers/CustomerRowActions.tsx` para projeto
- [ ] Copiar `src/components/customers/CustomersTable.tsx` para projeto
- [ ] Copiar `src/pages/CustomersPage.tsx` para projeto

## Fase 5: Configuracao de Variaveis de Ambiente

- [ ] Criar arquivo `.env.local` na raiz do projeto
- [ ] Adicionar `VITE_SUPABASE_URL=seu_url_aqui`
- [ ] Adicionar `VITE_SUPABASE_ANON_KEY=sua_chave_aqui`
- [ ] Nao commitar `.env.local` no git (adicionar a `.gitignore`)

## Fase 6: Integracao no App

- [ ] Importar `CustomersPage` em `App.jsx` ou `App.tsx`
- [ ] Adicionar rota `/clientes` apontando para `CustomersPage`
  - Se usando React Router: `<Route path="/clientes" element={<CustomersPage />} />`
  - Se usando outra solucao: adaptar conforme necessário

## Fase 7: Testes Locais

- [ ] `npm run dev` - projeto inicia sem erros
- [ ] Conseguir acessar pagina `/clientes` no navegador
- [ ] Ver lista vazia ou clientes (se ja existem no banco)
- [ ] Conseguir buscar por nome/telefone/email
- [ ] Conseguir filtrar por status (somente ativos)
- [ ] Conseguir trocar status via dropdown
- [ ] Conseguir agendar follow-up
- [ ] Toggle entre "Ativos" e "Arquivados" funciona

## Fase 8: Testes de Logica

- [ ] Criar novo cliente via API ou Supabase direto
  - [ ] Cliente aparece em "Ativos"
- [ ] Trocar status para COMPROU
  - [ ] `archived_until` seta automaticamente (6 meses)
  - [ ] Cliente desaparece de "Ativos" (se refresh)
  - [ ] Cliente aparece em "Arquivados"
- [ ] Trocar status de cliente arquivado para NOVO
  - [ ] `archived_until` limpa
  - [ ] Cliente volta a "Ativos"
- [ ] Agendar follow-up
  - [ ] Data aparece na lista
  - [ ] Data formatada corretamente (relative: "em 3 dias")
- [ ] Buscar cliente
  - [ ] Busca por nome funciona
  - [ ] Busca por telefone funciona
  - [ ] Busca por email funciona
- [ ] Filtrar por status
  - [ ] Mostra somente clientes do status selecionado

## Fase 9: Real-time (Opcional - Avancado)

- [ ] Abrir mesma pagina em 2 abas
- [ ] Trocar status em uma aba
- [ ] Verificar se outra aba atualiza automaticamente
  - [ ] Sim = subscricoes real-time funcionando
  - [ ] Nao = verificar console para erros

## Fase 10: Producao

- [ ] Code review (revisar codigo antes de deploy)
- [ ] Testar com dados reais
- [ ] Verificar RLS funciona (tentar acessar dados nao autenticado)
- [ ] Treinar usuarios
- [ ] Criar backup do banco
- [ ] Documentar processo de backup/restore
- [ ] Monitorar erro em producao (Sentry, etc)

## Proximos Passos Apos Go-live

- [ ] [ ] Criar modal para editar cliente (nome, telefone, email, interesse, etc)
- [ ] [ ] Criar formulario para novo cliente
- [ ] [ ] Adicionar campo `status_reason` modal quando trocar status
- [ ] [ ] Dashboard com graficos (status distribution, conversao, etc)
- [ ] [ ] Exportacao em CSV
- [ ] [ ] Notificacoes para follow-up proximo
- [ ] [ ] Integracao com CRM externo (Pipedrive, HubSpot, etc)
- [ ] [ ] Adicionar auditoria (log de mudancas)
- [ ] [ ] Multi-tenant (se necessario)
- [ ] [ ] Mobile app (React Native)

## Troubleshooting Comum

### Erro: "Faltam variáveis de ambiente"
- [ ] Verificar se `.env.local` existe
- [ ] Verificar se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estao preenchidas
- [ ] Recarregar a aplicacao (`npm run dev`)

### Erro: "RLS violation"
- [ ] Verificar se usuario esta autenticado
- [ ] Verificar se policies foram criadas corretamente
- [ ] No Supabase, ir em Authentication > Policies e revisar

### Lista vazia
- [ ] Verificar se ha dados na tabela `customers` (Supabase > SQL Editor > SELECT * FROM customers)
- [ ] Se vazio, criar cliente primeiro via API ou SQL

### Mudanca de status nao funciona
- [ ] Verificar console do navegador para erros
- [ ] Verificar se RLS permite UPDATE
- [ ] Testar diretamente no Supabase SQL Editor

### Real-time nao funciona
- [ ] Verificar se Realtime esta ativado no Supabase (Project Settings > Realtime)
- [ ] Verificar console para erros
- [ ] Hard refresh do navegador (Ctrl+Shift+R)

---

**Tempo estimado de implementacao:** 1-2 horas
**Dificuldade:** Intermediaria (necessario conhecimento basico de React, Supabase e Tailwind)

Aproveite seu CRM!
