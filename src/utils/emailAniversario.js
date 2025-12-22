import { clientesRepository } from '../data/clientesRepository';

/**
 * Gerenciador de emails de aniversário
 * Detecta aniversariantes e gera emails formatados
 */
export const emailAniversario = {
  /**
   * Calcular próximo aniversário do cliente
   */
  calcularProximoAniversario(dataNascimento) {
    if (!dataNascimento) return null;

    const [ano, mes, dia] = dataNascimento.split('-');
    const hoje = new Date();
    
    let proximoAniversario = new Date(hoje.getFullYear(), parseInt(mes) - 1, parseInt(dia));
    
    if (proximoAniversario < hoje) {
      proximoAniversario = new Date(hoje.getFullYear() + 1, parseInt(mes) - 1, parseInt(dia));
    }

    return proximoAniversario;
  },

  /**
   * Verificar se é hoje ou está próximo (dentro de N dias)
   */
  ehAniversarioProximo(dataNascimento, diasAntecipacao = 0) {
    const proximoAniversario = this.calcularProximoAniversario(dataNascimento);
    if (!proximoAniversario) return false;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const dataVerificacao = new Date(hoje.getTime() + diasAntecipacao * 24 * 60 * 60 * 1000);
    dataVerificacao.setHours(0, 0, 0, 0);

    return proximoAniversario.toDateString() === dataVerificacao.toDateString();
  },

  /**
   * Extrair idade do cliente baseado em data de nascimento
   */
  calcularIdade(dataNascimento) {
    if (!dataNascimento) return null;

    const [ano, mes, dia] = dataNascimento.split('-');
    const hoje = new Date();
    
    let idade = hoje.getFullYear() - parseInt(ano);
    const mesAtual = hoje.getMonth();
    const mesNascimento = parseInt(mes) - 1;

    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < parseInt(dia))) {
      idade--;
    }

    return idade;
  },

  /**
   * Gerar email formatado com conteúdo personalizado
   */
  gerarConteudoEmail(cliente) {
    const idade = this.calcularIdade(cliente.data_nascimento);
    const idadeText = idade ? ` ${idade} anos` : '';

    const assunto = `Feliz Aniversário, ${cliente.nome}! 🎉`;
    
    const corpo = `Olá ${cliente.nome},\n\n` +
      `Hoje é seu dia especial!${idadeText}\n\n` +
      `A AutoElite vem desejando um FELIZ ANIVERSÁRIO para você! 🎊\n\n` +
      `Aproveitamos para oferecer um atendimento especial em nossa concessionária.\n` +
      `Visite-nos e conheça nossas ofertas exclusivas para você neste mês!\n\n` +
      `Conte conosco para encontrar o carro perfeito.\n\n` +
      `Abraços,\n` +
      `Equipe AutoElite 🚗`;

    return {
      assunto,
      corpo,
      para: cliente.email,
      cliente: cliente.nome
    };
  },

  /**
   * Gerar link mailto com email pré-formatado
   */
  gerarMailtoLink(cliente) {
    const conteudo = this.gerarConteudoEmail(cliente);
    
    const assuntoEncodado = encodeURIComponent(conteudo.assunto);
    const corpoEncodado = encodeURIComponent(conteudo.corpo);

    return `mailto:${conteudo.para}?subject=${assuntoEncodado}&body=${corpoEncodado}`;
  },

  /**
   * Buscar aniversariantes do mês
   */
  async buscarAniversariantesDoMes() {
    try {
      const hoje = new Date();
      const mes = hoje.getMonth() + 1;

      const { data: clientes, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('ativo', true);

      if (error) throw error;

      return clientes.filter(cliente => {
        if (!cliente.data_nascimento) return false;
        const [, mesCli] = cliente.data_nascimento.split('-');
        return parseInt(mesCli) === mes;
      }).sort((a, b) => {
        const [, , diaA] = a.data_nascimento.split('-');
        const [, , diaB] = b.data_nascimento.split('-');
        return parseInt(diaA) - parseInt(diaB);
      });
    } catch (error) {
      console.error('Erro ao buscar aniversariantes:', error);
      return [];
    }
  },

  /**
   * Registrar que email foi enviado
   */
  async registrarEmailEnviado(clienteId) {
    try {
      return await clientesRepository.registrarEmailAniversario(clienteId);
    } catch (error) {
      console.error('Erro ao registrar envio:', error);
      return null;
    }
  },

  /**
   * Verificar se email já foi enviado este ano
   */
  async jaSendoEnviadoEsteAno(clienteId) {
    try {
      const anoAtual = new Date().getFullYear();
      
      const { data, error } = await supabase
        .from('emails_aniversario')
        .select('*')
        .eq('cliente_id', clienteId)
        .eq('ano', anoAtual)
        .eq('enviado', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return !!data;
    } catch (error) {
      console.error('Erro ao verificar envio anterior:', error);
      return false;
    }
  }
};

// Import Supabase para uso interno
import { supabase } from '../config/supabase';
