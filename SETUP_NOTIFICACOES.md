# 🔧 SETUP DAS NOTIFICAÇÕES - INSTRUÇÕES

## ⚠️ Problema Identificado
A tabela `notificacoes` não foi criada no banco de dados Supabase.

## ✅ Como Resolver

### Passo 1: Abrir o Supabase Console
1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto **AutoElite-Painel**

### Passo 2: Ir para SQL Editor
1. No painel esquerdo, clique em **SQL Editor**
2. Clique em **"New Query"** ou **"+"**

### Passo 3: Copiar e Executar o SQL

Copie todo o código abaixo e cole no editor:

```sql
-- Tabela de Notificações Combinadas
-- Armazena notificações de interesse em veículos e aniversários

CREATE TABLE public.notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  criada_em TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  -- Relação com cliente
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  
  -- Tipo de notificação: 'veiculo_novo' ou 'aniversario'
  tipo VARCHAR(50) NOT NULL DEFAULT 'veiculo_novo',
  
  -- Conteúdo da notificação
  titulo TEXT NOT NULL,
  descricao TEXT,
  
  -- Dados do veículo (JSON) para notificações de interesse
  dados_veiculo JSONB,
  
  -- Status de leitura/envio
  lida BOOLEAN DEFAULT FALSE,
  
  -- Índices para performance
  CONSTRAINT tipo_valido CHECK (tipo IN ('veiculo_novo', 'aniversario'))
);

-- Índices
CREATE INDEX idx_notificacoes_cliente_id ON public.notificacoes(cliente_id);
CREATE INDEX idx_notificacoes_tipo ON public.notificacoes(tipo);
CREATE INDEX idx_notificacoes_lida ON public.notificacoes(lida);
CREATE INDEX idx_notificacoes_criada_em ON public.notificacoes(criada_em DESC);

-- Política de RLS (se usar)
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- Adicionar campos ao clientes para controle de notificação de aniversário
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS marca_interesse TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS notificacao_aniversario_enviada BOOLEAN DEFAULT FALSE;
```

### Passo 4: Executar
1. Clique em **"Run"** (play) ou pressione `Ctrl+Enter`
2. Aguarde a mensagem de sucesso

### ✅ Pronto!

Agora o sistema de notificações está totalmente funcional:
- ✨ **Notificações de Interesse**: Quando um veículo é cadastrado, clientes com interesse naquela marca/modelo/faixa de preço são notificados
- 🎂 **Notificações de Aniversário**: Clientes com aniversário próximo (15 dias) recebem notificação
- 💬 **Integração WhatsApp**: Botões para enviar mensagens via WhatsApp direto da notificação
- 📋 **Filtros**: Tabs para visualizar Todas, Interesse em Veículos, ou apenas Aniversários

## 🚀 Como Usar

1. **Cadastre clientes** com:
   - `modelo_interesse` (ex: "Civic, Corolla")
   - `marca_interesse` (ex: "Honda, Toyota")
   - `faixa_preco` (até_20mil, 20mil_40mil, etc)
   - `data_nascimento` (para aniversários)

2. **Cadastre veículos** - as notificações serão geradas automaticamente para clientes que combinam

3. **Acesse Notificações** - veja todas as notificações filtradas
