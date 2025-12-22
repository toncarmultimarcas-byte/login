import { supabase } from '../config/supabase';

export const storageFotos = {
  async upload(arquivo, veiculoId, tipo = 'galeria') {
    try {
      const timestamp = Date.now();
      const nomeArquivo = `${veiculoId}/${tipo}_${timestamp}_${arquivo.name}`;
      
      const { data, error } = await supabase
        .storage
        .from('veiculos-fotos')
        .upload(nomeArquivo, arquivo);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase
        .storage
        .from('veiculos-fotos')
        .getPublicUrl(nomeArquivo);
      
      return {
        caminho: nomeArquivo,
        url: publicUrl,
        tipo
      };
    } catch (error) {
      console.error('Erro ao fazer upload de foto:', error);
      throw error;
    }
  },

  async listarPorVeiculo(veiculoId) {
    try {
      const { data, error } = await supabase
        .from('fotos_veiculos')
        .select('*')
        .eq('veiculo_id', veiculoId)
        .order('ordem', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao listar fotos:', error);
      throw error;
    }
  },

  async salvarMetadadosFoto(veiculoId, foto) {
    try {
      const { data, error } = await supabase
        .from('fotos_veiculos')
        .insert([{
          veiculo_id: veiculoId,
          caminho: foto.caminho,
          url: foto.url,
          tipo: foto.tipo,
          ordem: foto.ordem || 0
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erro ao salvar metadados da foto:', error);
      throw error;
    }
  },

  async deletar(caminhoArquivo, fotoId) {
    try {
      // Deletar arquivo do storage
      const { error: erroStorage } = await supabase
        .storage
        .from('veiculos-fotos')
        .remove([caminhoArquivo]);
      
      if (erroStorage) throw erroStorage;

      // Deletar registro do banco
      const { error: erroBanco } = await supabase
        .from('fotos_veiculos')
        .delete()
        .eq('id', fotoId);
      
      if (erroBanco) throw erroBanco;
      return true;
    } catch (error) {
      console.error('Erro ao deletar foto:', error);
      throw error;
    }
  }
};
