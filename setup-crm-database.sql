-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  cpf TEXT UNIQUE,
  faixa_preco TEXT,
  modelo_interesse TEXT,
  data_nascimento DATE,
  endereco TEXT,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Notificações de Interesse (para rastreamento)
CREATE TABLE IF NOT EXISTS notificacoes_interesse (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  veiculo_id UUID,
  modelo TEXT NOT NULL,
  faixa_preco TEXT,
  data_notificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  enviado BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de E-mails de Aniversário (para controle)
CREATE TABLE IF NOT EXISTS emails_aniversario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  ano INT NOT NULL,
  enviado BOOLEAN DEFAULT false,
  data_envio TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_cpf ON clientes(cpf);
CREATE INDEX IF NOT EXISTS idx_clientes_data_nascimento ON clientes(data_nascimento);
CREATE INDEX IF NOT EXISTS idx_clientes_modelo_interesse ON clientes(modelo_interesse);
CREATE INDEX IF NOT EXISTS idx_notificacoes_cliente ON notificacoes_interesse(cliente_id);
CREATE INDEX IF NOT EXISTS idx_emails_aniversario_cliente ON emails_aniversario(cliente_id);

-- RLS (Row Level Security) - Descomente se usar autenticação
-- ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notificacoes_interesse ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE emails_aniversario ENABLE ROW LEVEL SECURITY;
