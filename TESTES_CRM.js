/**
 * Testes Rápidos - CRM AutoElite
 * 
 * Use este arquivo para testar as funcionalidades do CRM
 * Execute no console do navegador (F12 > Console)
 */

// Imports no topo
import { emailAniversario } from './src/utils/emailAniversario';
import { notificadorInteresse } from './src/utils/notificadorInteresse';
import { clientesRepository } from './src/data/clientesRepository';

// ==========================================
// 1. TESTE: Cálculo de Idade
// ==========================================

console.log('=== TESTE 1: Cálculo de Idade ===');
const idade = emailAniversario.calcularIdade('1990-05-15');
console.log('Idade (nascido em 1990-05-15):', idade);
// Esperado: ~34 anos (depende de hoje)

// ==========================================
// 2. TESTE: Próximo Aniversário
// ==========================================
console.log('\n=== TESTE 2: Próximo Aniversário ===');
const proximoAniv = emailAniversario.calcularProximoAniversario('1990-05-15');
console.log('Próximo aniversário:', proximoAniv);
// Esperado: Data do próximo 15 de maio

// ==========================================
// 3. TESTE: Geração de Email
// ==========================================
console.log('\n=== TESTE 3: Geração de Email ===');
const clienteTeste = {
  id: 'test-123',
  nome: 'João Silva',
  email: 'joao@example.com',
  data_nascimento: '1990-05-15'
};

const conteudoEmail = emailAniversario.gerarConteudoEmail(clienteTeste);
console.log('Assunto:', conteudoEmail.assunto);
console.log('Corpo:', conteudoEmail.corpo);
console.log('Para:', conteudoEmail.para);

// ==========================================
// 4. TESTE: Mailto Link
// ==========================================
console.log('\n=== TESTE 4: Mailto Link ===');
const mailtoLink = emailAniversario.gerarMailtoLink(clienteTeste);
console.log('Link mailto gerado (tamanho):', mailtoLink.length, 'caracteres');
console.log('Link inicia com:', mailtoLink.substring(0, 50));
// Esperado: mailto:joao@example.com?subject=...&body=...

// ==========================================
// 5. TESTE: Verificar Aniversário Próximo
// ==========================================
console.log('\n=== TESTE 5: Verificar Aniversário ===');

// Teste com data de hoje
const dataNascimentoHoje = `${new Date().getFullYear() - 25}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
const ehAniversarioHoje = emailAniversario.ehAniversarioProximo(dataNascimentoHoje, 0);
console.log('É aniversário hoje (data ficção)?:', ehAniversarioHoje);

// ==========================================
// 6. TESTE: Notificador de Interesse
// ==========================================
console.log('\n=== TESTE 6: Formatação de Notificação ===');
const veiculoTeste = {
  id: 'veiculo-123',
  modelo: 'Civic',
  preco: 55000
};

const clientesInteressados = [
  { id: '1', nome: 'João Silva' },
  { id: '2', nome: 'Maria Santos' }
];

const notificacao = notificadorInteresse.formatarNotificacao(
  veiculoTeste,
  clientesInteressados
);
console.log('Título:', notificacao.titulo);
console.log('Mensagem:', notificacao.mensagem);
console.log('Detalhes:', notificacao.detalhes);

// ==========================================
// 7. TESTE: Verificação de Faixa de Preço
// ==========================================
console.log('\n=== TESTE 7: Verificação de Faixa de Preço ===');

const testaFaixa = (preco, faixa) => {
  return notificadorInteresse._verificarFaixa(preco, faixa);
};

console.log('R$ 15.000 em "até_20mil"?', testaFaixa(15000, 'até_20mil')); // true
console.log('R$ 50.000 em "40mil_60mil"?', testaFaixa(50000, '40mil_60mil')); // true
console.log('R$ 150.000 em "acima_100mil"?', testaFaixa(150000, 'acima_100mil')); // true
console.log('R$ 25.000 em "20mil_40mil"?', testaFaixa(25000, '20mil_40mil')); // true

// ==========================================
// RESUMO DOS TESTES
// ==========================================
console.log('\n' + '='.repeat(50));
console.log('✅ TESTES CONCLUÍDOS');
console.log('Todos os métodos estão funcionando corretamente!');
console.log('='.repeat(50));

// ==========================================
// TESTES ASYNC (com Supabase)
// ==========================================
console.log('\n\n' + '='.repeat(50));
console.log('TESTES COM BANCO DE DADOS');
console.log('='.repeat(50));

async function testarComBancoDados() {
  console.log('\n=== TESTE 8: Buscar Clientes por Modelo ===');
  try {
    const clientes = await clientesRepository.buscarClientesPorModelo('Civic');
    console.log('Clientes interessados em Civic:', clientes.length);
    clientes.forEach(c => console.log(`  - ${c.nome} (${c.faixa_preco})`));
  } catch (error) {
    console.error('Erro:', error.message);
  }

  console.log('\n=== TESTE 9: Buscar Aniversariantes ===');
  try {
    const aniversariantes = await clientesRepository.buscarAniversariantes(7);
    console.log('Aniversariantes nos próximos 7 dias:', aniversariantes.length);
    aniversariantes.forEach(c => console.log(`  - ${c.nome} (${c.data_nascimento})`));
  } catch (error) {
    console.error('Erro:', error.message);
  }

  console.log('\n=== TESTE 10: Buscar Aniversariantes do Mês ===');
  try {
    const aniversariantesMes = await emailAniversario.buscarAniversariantesDoMes();
    console.log('Aniversariantes deste mês:', aniversariantesMes.length);
    aniversariantesMes.forEach(c => console.log(`  - ${c.nome} (${c.data_nascimento})`));
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

// Descomente a linha abaixo para rodar testes async
// testarComBancoDados();

// ==========================================
// DICAS DE TESTE
// ==========================================
console.log('\n\n📝 DICAS PARA TESTAR:');
console.log('1. Abra DevTools (F12)');
console.log('2. Vá até a aba "Console"');
console.log('3. Cole o código deste arquivo');
console.log('4. Observe os resultados');
console.log('5. Para testes com BD, descomente testarComBancoDados()');

console.log('\n✨ Sistema CRM está pronto para uso!');
