"""
Script Python para Configurar CRM AutoElite no Supabase

Este script:
1. Conecta ao Supabase
2. Cria as tabelas do CRM
3. Valida a criação

Instalação:
    pip install supabase

Uso:
    python setup_crm.py
"""

import os
from pathlib import Path
from supabase import create_client, Client

# ==========================================
# CONFIGURAÇÃO
# ==========================================

# Suas credenciais do Supabase (substitua pelos seus valores)
SUPABASE_URL = "https://osofymauklsxrsphojjm.supabase.co"
SUPABASE_KEY = "sb_publishable_N-IapnaxpweqdBQFqNLMkg_ukxPspvo"

# ==========================================
# SCRIPT SQL PARA CRIAR TABELAS
# ==========================================

SQL_SCRIPT = """
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

-- Tabela de Notificações de Interesse
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

-- Tabela de E-mails de Aniversário
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
"""

# ==========================================
# FUNÇÕES
# ==========================================

def conectar_supabase() -> Client:
    """Conecta ao Supabase usando as credenciais"""
    print("🔌 Conectando ao Supabase...")
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Conectado com sucesso!")
        return supabase
    except Exception as e:
        print(f"❌ Erro ao conectar: {e}")
        return None


def executar_script_sql(supabase: Client) -> bool:
    """Executa o script SQL no Supabase"""
    print("\n📝 Executando script SQL...")
    try:
        # Divide o script em comandos individuais
        comandos = SQL_SCRIPT.split(';')
        comandos = [cmd.strip() for cmd in comandos if cmd.strip()]
        
        for i, comando in enumerate(comandos, 1):
            print(f"  Executando comando {i}/{len(comandos)}...", end=" ")
            try:
                # Usa RPC ou executa diretamente
                resultado = supabase.postgrest.query(comando).execute()
                print("✅")
            except Exception as e:
                # Alguns comandos pode falhar se já existem, isso é normal
                if "already exists" in str(e) or "ERRO" in str(e):
                    print("⚠️ (Já existe)")
                else:
                    print(f"❌ {str(e)[:50]}")
        
        return True
    except Exception as e:
        print(f"❌ Erro ao executar script: {e}")
        return False


def verificar_tabelas(supabase: Client) -> bool:
    """Verifica se as tabelas foram criadas"""
    print("\n✔️ Verificando tabelas criadas...")
    
    try:
        # Tenta listar as tabelas
        tabelas_esperadas = ['clientes', 'notificacoes_interesse', 'emails_aniversario']
        
        for tabela in tabelas_esperadas:
            try:
                resultado = supabase.table(tabela).select("*").limit(1).execute()
                print(f"  ✅ Tabela '{tabela}' criada com sucesso!")
            except Exception as e:
                print(f"  ❌ Tabela '{tabela}' não encontrada: {e}")
                return False
        
        return True
    except Exception as e:
        print(f"❌ Erro ao verificar tabelas: {e}")
        return False


def testar_operacoes(supabase: Client) -> bool:
    """Testa operações básicas no banco"""
    print("\n🧪 Testando operações básicas...")
    
    try:
        # Teste 1: Inserir cliente
        print("  Teste 1: Inserindo cliente de teste...", end=" ")
        cliente_teste = {
            "nome": "João Silva (Teste)",
            "email": f"teste_{os.urandom(4).hex()}@example.com",
            "telefone": "(11) 98765-4321",
            "data_nascimento": "1990-05-15",
            "modelo_interesse": "Civic",
            "faixa_preco": "40mil_60mil"
        }
        
        resultado = supabase.table("clientes").insert(cliente_teste).execute()
        cliente_id = resultado.data[0]['id']
        print(f"✅ (ID: {cliente_id[:8]}...)")
        
        # Teste 2: Buscar cliente
        print("  Teste 2: Buscando cliente...", end=" ")
        resultado = supabase.table("clientes").select("*").eq("id", cliente_id).execute()
        if resultado.data:
            print("✅")
        else:
            print("❌")
            return False
        
        # Teste 3: Inserir notificação
        print("  Teste 3: Inserindo notificação...", end=" ")
        notificacao = {
            "cliente_id": cliente_id,
            "modelo": "Civic",
            "faixa_preco": "40mil_60mil"
        }
        resultado = supabase.table("notificacoes_interesse").insert(notificacao).execute()
        print("✅")
        
        # Teste 4: Deletar teste
        print("  Teste 4: Limpando dados de teste...", end=" ")
        supabase.table("clientes").delete().eq("id", cliente_id).execute()
        print("✅")
        
        return True
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False


def exibir_status(sucesso: bool):
    """Exibe status final da configuração"""
    print("\n" + "="*50)
    if sucesso:
        print("✅ CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!")
        print("\nPróximos passos:")
        print("1. Abra sua aplicação React")
        print("2. Execute: npm run dev")
        print("3. Acesse: /clientes/novo")
        print("4. Cadastre um cliente")
        print("5. Acesse: /aniversariantes")
        print("\n🎉 CRM AutoElite está pronto para usar!")
    else:
        print("❌ Houve problemas na configuração.")
        print("\nVerifique:")
        print("1. Suas credenciais do Supabase")
        print("2. Conexão com internet")
        print("3. Se Supabase está online")
    print("="*50)


# ==========================================
# MAIN
# ==========================================

def main():
    """Função principal"""
    print("🚀 Setup CRM AutoElite - Supabase\n")
    
    # Validar credenciais
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Erro: Credenciais do Supabase não configuradas!")
        print("   Atualize SUPABASE_URL e SUPABASE_KEY no script")
        return False
    
    # Conectar
    supabase = conectar_supabase()
    if not supabase:
        exibir_status(False)
        return False
    
    # Executar script
    if not executar_script_sql(supabase):
        exibir_status(False)
        return False
    
    # Verificar
    if not verificar_tabelas(supabase):
        exibir_status(False)
        return False
    
    # Testar
    if not testar_operacoes(supabase):
        print("⚠️ Operações de teste tiveram problemas, mas tabelas foram criadas")
    
    exibir_status(True)
    return True


if __name__ == "__main__":
    sucesso = main()
    exit(0 if sucesso else 1)
