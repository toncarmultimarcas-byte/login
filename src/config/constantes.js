export const STATUS_VEICULO = {
  DISPONIVEL: 'disponível',
  RESERVADO: 'reservado',
  VENDIDO: 'vendido'
};

export const STATUS_CLIENTE = {
  NOVO: 'NOVO',
  CURIOSO: 'CURIOSO',
  INTERESSADO: 'INTERESSADO',
  EM_NEGOCIACAO: 'EM_NEGOCIACAO',
  PERDIDO: 'PERDIDO',
  COMPROU: 'COMPROU',
  SEM_INTERESSE: 'SEM_INTERESSE'
};

export const STATUS_CLIENTE_DESCRICAO = {
  NOVO: 'Novo (não qualificado) - Entrou agora, ainda não falou direito com a loja.',
  CURIOSO: 'Curioso (sem urgência) - Tá olhando, perguntando, mas não tem decisão nem prazo.',
  INTERESSADO: 'Interessado (qualificado) - Já tem preferência clara (modelo/ano/faixa), prazo, forma de pagamento ou entrada.',
  EM_NEGOCIACAO: 'Em negociação - Já recebeu proposta, tá alinhando detalhes (entrada, aprovação, troca, documentação).',
  PERDIDO: 'Perdido - Sumiu, respondeu "depois vejo", escolheu outra loja, ou não fechou por preço/condição.',
  COMPROU: 'Comprou - Fechou com você (meta batida).',
  SEM_INTERESSE: 'Sem interesse - Falou explicitamente que não quer mais, ou era curioso que "não vai rolar".'
};

export const COMBUSTIVEL = {
  GASOLINA: 'gasolina',
  DIESEL: 'diesel',
  ALCOOL: 'álcool',
  HIBRIDO: 'híbrido',
  ELETRICO: 'elétrico'
};

export const CAMBIO = {
  MANUAL: 'manual',
  AUTOMATICO: 'automático',
  CVT: 'cvt'
};

export const ROTAS = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  VEICULOS: '/veiculos',
  NOVO_VEICULO: '/veiculos/novo',
  EDITAR_VEICULO: '/veiculos/:id/editar',
  DETALHE_VEICULO: '/veiculos/:id'
};
