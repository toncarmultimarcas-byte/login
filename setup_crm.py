"""
Script Python para Verificar CRM AutoElite no Supabase

Este script:
1. Conecta ao Supabase
2. Verifica se as tabelas existem
3. Testa operações básicas

IMPORTANTE: Execute primeiro o SQL_CRIACAO_TABELAS.sql no Supabase SQL Editor

Instalação:
    pip install supabase

Uso:
    python setup_crm.py
"""

import os
from supabase import create_client, Client

# ==========================================
# CONFIGURAÇÃO
# ==========================================

# Suas credenciais do Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://osofymauklsxrsphojjm.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "sb_publishable_N-IapnaxpweqdBQFqNLMkg_ukxPspvo")

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
        print("✅ VERIFICAÇÃO CONCLUÍDA COM SUCESSO!")
        print("\nPróximos passos:")
        print("1. Abra sua aplicação React")
        print("2. Execute: npm run dev")
        print("3. Acesse: /clientes/novo")
        print("4. Cadastre um cliente")
        print("5. Acesse: /aniversariantes")
        print("\n🎉 CRM AutoElite está pronto para usar!")
    else:
        print("❌ Houve problemas na verificação.")
        print("\nVerifique:")
        print("1. Execute SQL_CRIACAO_TABELAS.sql no Supabase SQL Editor")
        print("2. Suas credenciais do Supabase")
        print("3. Conexão com internet")
    print("="*50)


# ==========================================
# MAIN
# ==========================================

def main():
    """Função principal"""
    print("🚀 Verificação CRM AutoElite - Supabase\n")
    print("⚠️  Execute primeiro: SQL_CRIACAO_TABELAS.sql no Supabase SQL Editor\n")
    
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
    
    # Verificar
    if not verificar_tabelas(supabase):
        print("\n⚠️  As tabelas não existem. Execute SQL_CRIACAO_TABELAS.sql primeiro!")
        exibir_status(False)
        return False
    
    # Testar
    if not testar_operacoes(supabase):
        print("⚠️ Operações de teste tiveram problemas")
        exibir_status(False)
        return False
    
    exibir_status(True)
    return True


if __name__ == "__main__":
    sucesso = main()
    exit(0 if sucesso else 1)
