import { supabase } from '../config/supabase';
import { clientesRepository } from './clientesRepository';

export const notificacoesRepository = {
  // Gerar notificações de interesse quando veículo é criado
  async verificarClientesMatches(veiculo) {
    try {
      const clientes = await clientesRepository.listar();
      const notificacoes = [];

      for (const cliente of clientes) {
        if (!cliente.ativo) continue;

        let match = false;
        let motivo = '';

        // Verificar se o modelo/marca combina
        if (cliente.modelo_interesse) {
          const modelosInteresse = cliente.modelo_interesse.toLowerCase().split(',').map(m => m.trim());
          const veiculo_modelo = veiculo.modelo.toLowerCase();
          
          if (modelosInteresse.some(m => veiculo_modelo.includes(m))) {
            match = true;
            motivo = `Corresponde ao modelo de interesse: ${cliente.modelo_interesse}`;
          }
        }

        // Verificar marca
        if (cliente.marca_interesse && !match) {
          const marcasInteresse = cliente.marca_interesse.toLowerCase().split(',').map(m => m.trim());
          const veiculo_marca = veiculo.marca.toLowerCase();
          
          if (marcasInteresse.some(m => veiculo_marca.includes(m))) {
            match = true;
            motivo = `Corresponde à marca de interesse: ${cliente.marca_interesse}`;
          }
        }

        // Verificar faixa de preço
        if (cliente.faixa_preco) {
          const veiculoPreco = veiculo.preco || 0;
          const faixaCorresponde = this.verificarFaixa(veiculoPreco, cliente.faixa_preco);
          
          if (faixaCorresponde) {
            match = true;
            motivo = motivo ? motivo + ` | Faixa de preço: ${cliente.faixa_preco}` : `Faixa de preço compatível: ${cliente.faixa_preco}`;
          }
        }

        if (match) {
          notificacoes.push({
            cliente_id: cliente.id,
            tipo: 'veiculo_novo',
            titulo: `Novo veículo disponível: ${veiculo.marca} ${veiculo.modelo}`,
            descricao: motivo,
            dados_veiculo: {
              marca: veiculo.marca,
              modelo: veiculo.modelo,
              ano: veiculo.ano,
              preco: veiculo.preco
            }
          });
        }
      }

      // Salvar notificações no banco
      if (notificacoes.length > 0) {
        const { error } = await supabase
          .from('notificacoes')
          .insert(notificacoes);

        if (error) throw error;
      }

      return notificacoes;
    } catch (error) {
      console.error('Erro ao verificar matches:', error);
      throw error;
    }
  },

  // Gerar notificações de aniversário
  async gerarNotificacoesAniversario() {
    try {
      console.log('🎂 Gerando notificações de aniversário...');
      const hoje = new Date();
      const clientes = await clientesRepository.buscarAniversariantes(7); // Buscar nos próximos 7 dias
      
      console.log('Clientes com aniversário próximo:', clientes);

      const notificacoes = clientes
        .filter(cliente => {
          // Verificar se já não foi notificado hoje
          return !cliente.notificacao_aniversario_enviada;
        })
        .map(cliente => ({
          cliente_id: cliente.id,
          tipo: 'aniversario',
          titulo: `🎂 Aniversário de ${cliente.nome}`,
          descricao: `${cliente.nome} faz aniversário hoje! Envie uma mensagem especial.`,
          dados_veiculo: {
            data_nascimento: cliente.data_nascimento
          }
        }));

      console.log('Notificações a inserir:', notificacoes);

      if (notificacoes.length > 0) {
        const { error } = await supabase
          .from('notificacoes')
          .insert(notificacoes);

        if (error) {
          console.error('Erro ao inserir aniversários:', error);
          throw error;
        }
        console.log('✅ Aniversários inseridos com sucesso');
      } else {
        console.log('Nenhum cliente com aniversário próximo');
      }

      return notificacoes;
    } catch (error) {
      console.error('Erro ao gerar notificações de aniversário:', error);
      throw error;
    }
  },

  // Listar todas as notificações (interesse + aniversário)
  async listarTodas(filtros = {}) {
    try {
      // Query simples sem relações
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .order('criada_em', { ascending: false });

      console.log('Notificações obtidas:', data);
      console.log('Erro (se houver):', error);

      if (error) {
        console.error('Erro na query:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Erro ao listar notificações:', error);
      throw error;
    }
  },

  // Listar notificações de interesse (veículos)
  async listarInteresse() {
    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .select(`
          *,
          clientes (id, nome, email, telefone)
        `)
        .eq('tipo', 'veiculo_novo')
        .order('criada_em', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao listar notificações de interesse:', error);
      throw error;
    }
  },

  // Listar notificações de aniversário
  async listarAniversarios() {
    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .select(`
          *,
          clientes (id, nome, email, telefone, data_nascimento)
        `)
        .eq('tipo', 'aniversario')
        .order('criada_em', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao listar aniversários:', error);
      throw error;
    }
  },

  // Marcar notificação como lida
  async marcarComoLida(notificacaoId) {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('id', notificacaoId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  },

  // Deletar notificação
  async deletar(notificacaoId) {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .delete()
        .eq('id', notificacaoId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      throw error;
    }
  },

  // Verificar se preço está na faixa
  verificarFaixa(preco, faixa) {
    const faixas = {
      'ate_20mil': { min: 0, max: 20000 },
      '20mil_40mil': { min: 20000, max: 40000 },
      '40mil_60mil': { min: 40000, max: 60000 },
      '60mil_100mil': { min: 60000, max: 100000 },
      'acima_100mil': { min: 100000, max: Infinity }
    };

    const faixaData = faixas[faixa];
    if (!faixaData) return false;

    return preco >= faixaData.min && preco <= faixaData.max;
  }
};
