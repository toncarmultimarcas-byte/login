# 🎯 Tutorial Prático - CRM AutoElite

## Passo a Passo Completo

Este tutorial mostra como usar o CRM do zero até enviar um email de aniversário.

---

## 📋 Fase 1: Configuração Inicial

### Passo 1.1: Executar Script SQL no Supabase

**Tempo: 2 minutos**

1. Abra seu painel Supabase
2. Clique em "SQL Editor" no menu lateral
3. Clique em "New Query"
4. Copie todo o conteúdo de `setup-crm-database.sql`
5. Cole no editor
6. Clique "Run" ou pressione Ctrl+Enter
7. Verifique se aparece "Success"

**Resultado esperado:**
```
Executed successfully. Created 3 tables.
```

### Passo 1.2: Integrar Rotas no App.jsx

**Tempo: 2 minutos**

1. Abra `src/App.jsx`
2. Importe a página: 
   ```jsx
   import { Aniversariantes } from './pages/Aniversariantes';
   ```
3. Adicione a rota:
   ```jsx
   <Route path="/aniversariantes" element={<Aniversariantes />} />
   ```

### Passo 1.3: Iniciar Aplicação

**Tempo: 30 segundos**

```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## 👥 Fase 2: Cadastrar Cliente

### Passo 2.1: Acessar Formulário

**Tempo: 1 minuto**

1. Navegue até: `/clientes/novo`
2. Preencha os dados:

**Exemplo:**
```
Nome Completo:    João Silva
CPF:              123.456.789-00
Telefone:         (11) 98765-4321
Email:            joao@example.com
Endereço:         Rua Principal, 123 - São Paulo

Modelo Interesse: Civic
Faixa de Preço:   40mil_60mil
Data Nascimento:  1990-05-15

Observações:      Cliente preferencialista, visitou showroom
```

### Passo 2.2: Salvar Cliente

1. Clique em "Salvar Cliente"
2. Aguarde notificação de sucesso
3. Será redirecionado para `/clientes`

**Dica:** Cadastre mais alguns clientes com diferentes modelos e datas de nascimento.

---

## 🚗 Fase 3: Cadastrar Veículo (com Notificação)

### Passo 3.1: Novo Veículo

**Tempo: 5 minutos**

1. Navegue até: `/veiculos/novo`
2. Preencha com dados de um **Civic** (modelo que o João está interessado):

**Exemplo:**
```
Marca:           Honda
Modelo:          Civic
Ano:             2023
KM:              15000
Cor:             Preto Metálico
Combustível:     Gasolina
Câmbio:          Automático
Preço:           52500
Status:          Disponível

Descrição:       Veículo completo, com todas as opcionais
Opcionais:       Ar condicionado, Vidro elétrico, Direção elétrica
```

### Passo 3.2: Verificar Notificação

**Resultado esperado:**

```
┌─────────────────────────────────────────┐
│ ✓ Cliente(s) Interessado(s)             │
│                                         │
│ 1 cliente está interessado em Civic!    │
│                                         │
│ João Silva                              │
│                                         │
│ [Fechar]                                │
└─────────────────────────────────────────┘
```

✅ **Sistema funcionando!**

---

## 🎂 Fase 4: Enviar Email de Aniversário

### Passo 4.1: Acessar Página de Aniversariantes

**Tempo: 2 minutos**

1. Navegue até: `/aniversariantes`
2. Você verá lista com todos os clientes:

```
┌───────────────────────────────────────┐
│ 🎂 Aniversariantes do Mês             │
│                                       │
│ 2 cliente(s) fazendo aniversário      │
└───────────────────────────────────────┘
```

### Passo 4.2: Visualizar Email (Opcional)

1. Encontre "João Silva" na lista
2. Clique em **"👁️ Visualizar"**
3. Uma janela abrirá com preview:

```
Para: joao@example.com
Assunto: Feliz Aniversário, João Silva! 🎉

Olá João,

Hoje é seu dia especial! 34 anos

A AutoElite vem desejando um FELIZ ANIVERSÁRIO 
para você! 🎊

[continua...]
```

### Passo 4.3: Enviar Email

**Método 1: Direto (recomendado)**

1. Na lista, clique em **"📧 Enviar Email"** para João
2. Seu cliente de email padrão abrirá com:
   - ✅ Email preenchido
   - ✅ Assunto preenchido
   - ✅ Corpo preenchido
3. Revise e clique "Enviar" no seu cliente de email
4. Botão mudará para **"✓ Enviado"**

**Método 2: Via Preview Modal**

1. Clique em **"👁️ Visualizar"**
2. Clique em **"📧 Enviar via Email"** no modal
3. Mesmo resultado do Método 1

---

## 📊 Fase 5: Verificar Dados no Banco

### Opção A: Verificar no Supabase UI

1. Abra seu dashboard Supabase
2. Clique em "Table Editor"
3. Selecione tabela `clientes`
4. Verifique que "João Silva" está lá

### Opção B: Executar Query SQL

```sql
-- Ver todos os clientes
SELECT * FROM clientes ORDER BY criado_em DESC;

-- Ver notificações de interesse
SELECT * FROM notificacoes_interesse;

-- Ver emails de aniversário enviados
SELECT * FROM emails_aniversario WHERE enviado = true;
```

---

## 🔄 Fluxo Completo Resumido

```
┌─────────────────┐
│  1. SQL Setup   │ ← Execute setup-crm-database.sql
└────────┬────────┘
         │
┌────────▼────────┐
│ 2. Cadastrar    │ ← /clientes/novo
│    Cliente      │   - Dados pessoais
└────────┬────────┘   - Modelo interesse
         │            - Data nascimento
┌────────▼────────┐
│ 3. Cadastrar    │ ← /veiculos/novo
│    Veículo      │   → Sistema compara
└────────┬────────┘   → Notificação exibida
         │
┌────────▼────────┐
│ 4. Verificar    │ ← /aniversariantes
│    Aniversário  │   - Visualizar email
└────────┬────────┘   - Enviar com clique
         │
┌────────▼────────┐
│ 5. Email Enviado│ ← Cliente de email abre
│    ✓ Registrado │   Email com all dados
└─────────────────┘
```

---

## 🎓 Exemplo de Uso Prático Completo

### Cenário: Loja AutoElite em Ação

**Terça-feira, 10h:**
- Vendedor cadastra "Maria Santos", interessada em Gol (até 20k)
- Data de nascimento: 1985-10-20

**Quarta-feira, 14h:**
- Chega novo Gol, preço: R$ 18.500
- Sistema notifica: "Maria Santos está interessada!"
- Vendedor liga para Maria imediatamente

**20 de outubro (aniversário de Maria):**
- Gerente acessa `/aniversariantes`
- Vê Maria na lista
- Clica "Enviar Email"
- Email personalizado abre:
  ```
  Para: maria@email.com
  Assunto: Feliz Aniversário, Maria Santos! 🎉
  
  [Email customizado com parabéns e oferta especial]
  ```
- Envia email
- Maria recebe mensagem carinhosa

**Resultado:**
- ✅ Cliente se sente especial
- ✅ Oportunidade de venda no aniversário
- ✅ Relacionamento fortalecido

---

## 💡 Dicas e Truques

### Dica 1: Múltiplos Modelos de Interesse

Cliente pode ter interesse em vários modelos:
```
Modelo Interesse: Civic, Corolla, HB20
```

Sistema busca por cada um!

### Dica 2: Personalizar Email

Edite `src/utils/emailAniversario.js`:
```javascript
const corpo = `Olá ${cliente.nome},

[Sua mensagem personalizada aqui]

Abraços,
AutoElite`;
```

### Dica 3: Verificar Antes de Enviar

Sempre clique em **"👁️ Visualizar"** antes de enviar!

### Dica 4: Testar com Datas Próximas

Para testar aniversariantes do mês, altere data de nascimento para próximas datas.

### Dica 5: Filtros na Lista de Clientes

Em `/clientes`, você pode filtrar por:
- Nome
- Modelo de interesse
- Faixa de preço

---

## ❌ Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Email não abre | Verifique se tem cliente de email configurado no SO |
| Notificação não aparece | Verifique modelo_interesse preenchido e modelo do carro |
| Aniversariantes não aparecem | Verifique data_nascimento no formato YYYY-MM-DD |
| Erro no banco | Verifique se SQL foi executado corretamente |
| Página branca | Pressione F12, veja console para erros |

---

## 🧪 Teste Rápido (5 minutos)

1. **T0:00** - Cadastre cliente com aniversário em 2 dias
2. **T1:00** - Cadastre veículo com modelo de interesse
3. **T2:00** - Verifique notificação
4. **T3:00** - Acesse `/aniversariantes`
5. **T4:00** - Envie email de teste
6. **T5:00** - Verifique dados no Supabase

---

## 📞 Próximas Etapas

Depois de dominado o básico:
- [ ] Explorar relatórios de interesse
- [ ] Customizar emails
- [ ] Integrar com WhatsApp (futura)
- [ ] Configurar automações (futura)
- [ ] Treinar equipe de vendas

---

## ✅ Checklist de Sucesso

- [x] Banco de dados configurado
- [x] Rotas integradas
- [x] Aplicação iniciada
- [x] Cliente cadastrado
- [x] Veículo cadastrado
- [x] Notificação apareceu
- [x] Email visualizado
- [x] Email enviado
- [x] Dados confirmados no banco

**Parabéns! 🎉 CRM está completamente funcional!**

---

**Tempo Total de Setup: ~20 minutos**

Aproveita o sistema e aumente suas vendas! 🚗💰
