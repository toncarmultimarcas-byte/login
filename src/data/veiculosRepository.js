import { supabase } from '../config/supabase';

export const veiculosRepository = {
  async criar(veiculo) {
    try {
      console.log('Criando veículo:', veiculo);
      
      const { data, error } = await supabase
        .from('veiculos')
        .insert([veiculo])
        .select();
      
      if (error) {
        console.error('Erro Supabase ao criar:', error);
        throw new Error(`${error.code}: ${error.message}`);
      }
      
      console.log('Veículo criado com sucesso:', data);
      return data[0];
    } catch (error) {
      console.error('Erro ao criar veículo:', error.message);
      throw error;
    }
  },

  async listar(filtros = {}) {
    try {
      let query = supabase
        .from('veiculos')
        .select('*')
        .order('created_at', { ascending: false });

      if (filtros.modelo) {
        query = query.ilike('modelo', `%${filtros.modelo}%`);
      }
      if (filtros.ano) {
        query = query.eq('ano', filtros.ano);
      }
      if (filtros.status) {
        query = query.eq('status', filtros.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao listar veículos:', error);
      throw error;
    }
  },

  async obterPorId(id) {
    try {
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao obter veículo:', error);
      throw error;
    }
  },

  async atualizar(id, veiculo) {
    try {
      const { data, error } = await supabase
        .from('veiculos')
        .update(veiculo)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      throw error;
    }
  },

  async deletar(id) {
    try {
      const { error } = await supabase
        .from('veiculos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
      throw error;
    }
  }
};
