import { clientesRepository } from '../data/clientesRepository';

/**
 * Notificador de interesse de clientes
 * Verifica quais clientes têm interesse em um veículo específico
 */
export const notificadorInteresse = {
  /**
   * Verificar clientes interessados em um novo veículo
   * @param {Object} veiculo - Dados do veículo
   * @returns {Array} Lista de clientes interessados
   */
  async verificarClientesInteressados(veiculo) {
    try {
      const interessados = [];

      // Buscar clientes interessados no modelo
      const porModelo = await clientesRepository.buscarClientesPorModelo(veiculo.modelo || '');
      
      // Filtrar por faixa de preço
      const clientesFiltroCombinado = porModelo.filter(cliente => {
        if (!cliente.faixa_preco) return true;
        return this._verificarFaixa(veiculo.preco, cliente.faixa_preco);
      });

      return clientesFiltroCombinado;
    } catch (error) {
      console.error('Erro ao verificar clientes interessados:', error);
      return [];
    }
  },

  /**
   * Verificar se o preço do veículo está dentro da faixa do cliente
   * @private
   */
  _verificarFaixa(preco, faixa) {
    const precoNum = parseFloat(preco) || 0;

    const faixas = {
      'até_20mil': { min: 0, max: 20000 },
      '20mil_40mil': { min: 20000, max: 40000 },
      '40mil_60mil': { min: 40000, max: 60000 },
      '60mil_100mil': { min: 60000, max: 100000 },
      'acima_100mil': { min: 100000, max: Infinity }
    };

    const faixaConfig = faixas[faixa];
    if (!faixaConfig) return true;

    return precoNum >= faixaConfig.min && precoNum <= faixaConfig.max;
  },

  /**
   * Gerar notificação formatada para exibir ao usuário
   */
  formatarNotificacao(veiculo, clientesInteressados) {
    if (clientesInteressados.length === 0) {
      return null;
    }

    const nomes = clientesInteressados.map(c => c.nome).join(', ');
    const plural = clientesInteressados.length > 1 ? 's' : '';

    return {
      titulo: 'Cliente(s) Interessado(s)',
      mensagem: `${clientesInteressados.length} cliente${plural} está${plural} interessado${plural} em ${veiculo.modelo || 'este veículo'}!`,
      clientes: clientesInteressados,
      detalhes: `${nomes}`,
      tipo: 'sucesso'
    };
  },

  /**
   * Registrar notificações no banco de dados
   */
  async registrarNotificacoes(veiculo, clientesInteressados) {
    try {
      const promises = clientesInteressados.map(cliente =>
        clientesRepository.criarNotificacaoInteresse(
          cliente.id,
          veiculo.id,
          veiculo.modelo,
          veiculo.preco
        )
      );

      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Erro ao registrar notificações:', error);
      return false;
    }
  }
};
