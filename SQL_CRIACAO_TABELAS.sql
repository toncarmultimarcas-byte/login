-- ============================================
-- SQL CRIAÇÃO DE TABELAS CRM AUTOELITE
-- Executar no Supabase SQL Editor
-- ============================================

-- 1. TABELA CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  cpf TEXT UNIQUE,
  faixa_preco TEXT,
  modelo_interesse TEXT,
  data_nascimento DATE,
  endereco TEXT,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA NOTIFICAÇÕES DE INTERESSE
CREATE TABLE IF NOT EXISTS notificacoes_interesse (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  veiculo_id UUID,
  modelo TEXT NOT NULL,
  faixa_preco TEXT NOT NULL,
  data_notificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  enviado BOOLEAN DEFAULT false
);

-- 3. TABELA EMAILS DE ANIVERSÁRIO
CREATE TABLE IF NOT EXISTS emails_aniversario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  ano INT NOT NULL,
  enviado BOOLEAN DEFAULT false,
  data_envio TIMESTAMP
);

-- 4. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_cpf ON clientes(cpf);
CREATE INDEX IF NOT EXISTS idx_clientes_data_nascimento ON clientes(data_nascimento);
CREATE INDEX IF NOT EXISTS idx_clientes_modelo_interesse ON clientes(modelo_interesse);
CREATE INDEX IF NOT EXISTS idx_notificacoes_cliente ON notificacoes_interesse(cliente_id);
CREATE INDEX IF NOT EXISTS idx_emails_aniversario_cliente ON emails_aniversario(cliente_id);

-- ============================================
-- POLÍTICAS DE SEGURANÇA (Row Level Security)
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes_interesse ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails_aniversario ENABLE ROW LEVEL SECURITY;

-- Política CLIENTES - Público pode ler/criar/atualizar
CREATE POLICY "clientes_select_public"
  ON clientes FOR SELECT
  USING (true);

CREATE POLICY "clientes_insert_public"
  ON clientes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "clientes_update_public"
  ON clientes FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "clientes_delete_public"
  ON clientes FOR DELETE
  USING (true);

-- Política NOTIFICAÇÕES - Público pode ler/criar
CREATE POLICY "notificacoes_interesse_select_public"
  ON notificacoes_interesse FOR SELECT
  USING (true);

CREATE POLICY "notificacoes_interesse_insert_public"
  ON notificacoes_interesse FOR INSERT
  WITH CHECK (true);

CREATE POLICY "notificacoes_interesse_update_public"
  ON notificacoes_interesse FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Política EMAILS - Público pode ler/criar
CREATE POLICY "emails_aniversario_select_public"
  ON emails_aniversario FOR SELECT
  USING (true);

CREATE POLICY "emails_aniversario_insert_public"
  ON emails_aniversario FOR INSERT
  WITH CHECK (true);

CREATE POLICY "emails_aniversario_update_public"
  ON emails_aniversario FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Execute os SELECTs abaixo para verificar criação:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM clientes LIMIT 1;
-- SELECT * FROM notificacoes_interesse LIMIT 1;
-- SELECT * FROM emails_aniversario LIMIT 1;
