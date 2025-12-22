import { supabase } from '../config/supabase';

export const clientesRepository = {
  async listar(filtros = {}) {
    let query = supabase
      .from('clientes')
      .select('*')
      .order('criado_em', { ascending: false });

    if (filtros.nome) {
      query = query.ilike('nome', `%${filtros.nome}%`);
    }

    if (filtros.modelo_interesse) {
      query = query.ilike('modelo_interesse', `%${filtros.modelo_interesse}%`);
    }

    if (filtros.faixa_preco) {
      query = query.eq('faixa_preco', filtros.faixa_preco);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async buscarPorId(id) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(cliente) {
    const { data, error } = await supabase
      .from('clientes')
      .insert([cliente])
      .select();

    if (error) throw error;
    return data[0];
  },

  async atualizar(id, cliente) {
    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deletar(id) {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Buscar clientes interessados em um modelo específico
  async buscarClientesPorModelo(modelo) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .ilike('modelo_interesse', `%${modelo}%`)
      .eq('ativo', true);

    if (error) throw error;
    return data;
  },

  // Buscar clientes por faixa de preço
  async buscarClientesPorFaixa(faixa) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('faixa_preco', faixa)
      .eq('ativo', true);

    if (error) throw error;
    return data;
  },

  // Buscar clientes com aniversário hoje/próximo
  async buscarAniversariantes(dias = 7) {
    const { data: clientes, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('ativo', true);

    if (error) throw error;

    const hoje = new Date();
    const dataFim = new Date(hoje.getTime() + dias * 24 * 60 * 60 * 1000);

    return clientes.filter(cliente => {
      if (!cliente.data_nascimento) return false;

      const [ano, mes, dia] = cliente.data_nascimento.split('-');
      const proximoAniversario = new Date(hoje.getFullYear(), parseInt(mes) - 1, parseInt(dia));

      if (proximoAniversario < hoje) {
        proximoAniversario.setFullYear(proximoAniversario.getFullYear() + 1);
      }

      return proximoAniversario >= hoje && proximoAniversario <= dataFim;
    });
  },

  // Registrar notificação de interesse
  async criarNotificacaoInteresse(clienteId, veiculoId, modelo, faixa_preco) {
    const { data, error } = await supabase
      .from('notificacoes_interesse')
      .insert([{
        cliente_id: clienteId,
        veiculo_id: veiculoId,
        modelo,
        faixa_preco
      }])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Listar notificações de interesse
  async listarNotificacoes() {
    const { data, error } = await supabase
      .from('notificacoes_interesse')
      .select(`
        *,
        clientes (nome, email, telefone)
      `)
      .order('data_notificacao', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Registrar envio de email de aniversário
  async registrarEmailAniversario(clienteId) {
    const ano = new Date().getFullYear();
    const { data, error } = await supabase
      .from('emails_aniversario')
      .insert([{
        cliente_id: clienteId,
        ano,
        enviado: true,
        data_envio: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return data[0];
  }
};
