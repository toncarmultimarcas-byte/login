export const STATUS_VEICULO = {
  DISPONIVEL: 'disponível',
  RESERVADO: 'reservado',
  VENDIDO: 'vendido'
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
