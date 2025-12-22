# AutoElite CRM - Guia de Início Rápido

## ⚡ 5 Minutos para Começar

### 1️⃣ Executar SQL (2 min)
- Abra Supabase Dashboard
- SQL Editor → New Query
- Cole `setup-crm-database.sql`
- Clique Run

### 2️⃣ Integrar Rotas (2 min)
Em `src/App.jsx`:
```jsx
import { Aniversariantes } from './pages/Aniversariantes';
// ... adicione a rota
<Route path="/aniversariantes" element={<Aniversariantes />} />
```

### 3️⃣ Iniciar App (1 min)
```bash
npm run dev
```

---

## 🎯 Fluxo Principal

### Cadastrar Cliente
`/clientes/novo` → Preencha dados + data de nascimento + modelo interesse

### Cadastrar Veículo
`/veiculos/novo` → Sistema notifica clientes interessados automáticamente ✓

### Enviar Email de Aniversário
`/aniversariantes` → Clique "Enviar Email" → Email abre → Envie ✓

---

## 📋 Estrutura de Dados

### Faixas de Preço Disponíveis
- `até_20mil`
- `20mil_40mil`
- `40mil_60mil`
- `60mil_100mil`
- `acima_100mil`

### Campos de Cliente Obrigatórios
- Nome
- Email
- Dados de interesse (modelo, faixa, data nascimento)

---

## 📚 Documentação

| Arquivo | Para Quem | Tempo |
|---------|-----------|-------|
| CRM_RESUMO.md | Todos | 5 min |
| TUTORIAL_PRATICO.md | Práticos | 20 min |
| CONFIGURACAO_CRM.md | Desenvolvedores | 30 min |
| INTEGRACAO_ROTAS.md | Setup | 5 min |

**👉 Comece por: CRM_RESUMO.md**

---

## ✅ Checklist Rápido

- [ ] SQL executado no Supabase
- [ ] Rotas adicionadas ao App.jsx
- [ ] Aplicação iniciada
- [ ] Cliente cadastrado em `/clientes/novo`
- [ ] Veículo cadastrado em `/veiculos/novo`
- [ ] Notificação apareceu
- [ ] Acessou `/aniversariantes`
- [ ] Email foi enviado

**Tudo pronto! 🚀**

---

## 🆘 Problemas Comuns

| Erro | Solução |
|------|---------|
| Rota não existe | Adicione ao App.jsx |
| Tabelas não criadas | Execute SQL no Supabase |
| Email não abre | Configure cliente de email no SO |
| Sem notificação | Verifique modelo_interesse preenchido |

---

## 🔗 Links Rápidos

- Supabase: https://supabase.com
- React: https://react.dev
- Docs: Veja INDICE_DOCUMENTACAO.md

---

**Tempo Total: ~30 minutos do setup ao primeiro email enviado**

Aproveita! 🎉
