-- =====================================================
-- TABELA DE CLIENTES (CRM)
-- =====================================================

CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefone VARCHAR(20),
  cpf VARCHAR(14),
  endereco TEXT,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON clientes(nome);
CREATE INDEX IF NOT EXISTS idx_clientes_created_at ON clientes(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso (Permitir tudo para usuários autenticados/anonimos conforme configuração atual)
-- Ajuste conforme sua necessidade de segurança. Aqui seguindo o padrão do projeto:

CREATE POLICY "Clientes podem ser lidos"
  ON clientes FOR SELECT
  USING (true);

CREATE POLICY "Clientes podem ser inseridos"
  ON clientes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Clientes podem ser atualizados"
  ON clientes FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Clientes podem ser deletados"
  ON clientes FOR DELETE
  USING (true);

-- Trigger para updated_at
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
