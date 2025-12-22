# Configuração CRM AutoElite - Guia Completo

## 📋 Visão Geral

Este documento descreve a implementação do sistema CRM completo para a AutoElite Painel, incluindo:
- ✅ Cadastro de clientes com dados de interesse
- ✅ Notificações automáticas quando carros de interesse são adicionados
- ✅ Sistema de emails de aniversário
- ✅ Integração com Supabase

---

## 🗄️ Configuração do Banco de Dados

### 1. Criar Tabelas no Supabase

Execute o script SQL em seu banco Supabase:
```sql
-- Acesse seu painel Supabase
-- Editor SQL > New Query
-- Cole todo o conteúdo de: setup-crm-database.sql
```

O script cria:
- **Tabela `clientes`**: Armazena dados de clientes
- **Tabela `notificacoes_interesse`**: Rastreia quando carros interessam aos clientes
- **Tabela `emails_aniversario`**: Controla envios de emails de aniversário

### 2. Estrutura da Tabela de Clientes

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único (auto-gerado) |
| `nome` | TEXT | Nome completo do cliente |
| `email` | TEXT | Email (obrigatório) |
| `telefone` | TEXT | Telefone/WhatsApp |
| `cpf` | TEXT | CPF (único) |
| `faixa_preco` | TEXT | Faixa de preço desejada |
| `modelo_interesse` | TEXT | Modelo de carro que interessa |
| `data_nascimento` | DATE | Data de nascimento (YYYY-MM-DD) |
| `endereco` | TEXT | Endereço completo |
| `observacoes` | TEXT | Notas internas |
| `ativo` | BOOLEAN | Status do cliente |

### 3. Faixas de Preço Disponíveis

- `até_20mil` - Até R$ 20 mil
- `20mil_40mil` - R$ 20 mil - R$ 40 mil
- `40mil_60mil` - R$ 40 mil - R$ 60 mil
- `60mil_100mil` - R$ 60 mil - R$ 100 mil
- `acima_100mil` - Acima de R$ 100 mil

---

## 📝 Cadastro de Clientes

### Formulário de Cliente

**Localização**: `/clientes/novo` ou `/clientes/editar/:id`

**Campos do Formulário**:
1. **Dados Pessoais**
   - Nome Completo (obrigatório)
   - CPF
   - Telefone/WhatsApp
   - Email (obrigatório)
   - Endereço

2. **Interesses de Compra**
   - Data de Nascimento
   - Modelo de Interesse (ex: Gol, Civic, Corolla)
   - Faixa de Preço

3. **Observações**
   - Notas internas (histórico, preferências, etc)

### Exemplo de Uso

```javascript
import { clientesRepository } from './src/data/clientesRepository';

// Criar novo cliente
const novoCliente = {
  nome: 'João Silva',
  email: 'joao@email.com',
  telefone: '(11) 98765-4321',
  cpf: '123.456.789-00',
  faixa_preco: '40mil_60mil',
  modelo_interesse: 'Civic',
  data_nascimento: '1990-05-15',
  endereco: 'Rua A, 123 - São Paulo',
  observacoes: 'Cliente preferencialista'
};

const cliente = await clientesRepository.criar(novoCliente);
```

---

## 🔔 Notificação de Interesse

### Como Funciona

Quando um novo veículo é cadastrado no sistema:
1. O sistema verifica todos os clientes cadastrados
2. Busca clientes interessados no **modelo** do veículo
3. Filtra por **faixa de preço**
4. Exibe uma notificação com os clientes interessados
5. Registra a notificação no banco de dados

### Integração no Formulário de Veículo

O componente `FormNovoVeiculo.jsx` já possui integração automática:

```javascript
// Verificar clientes interessados
const clientesInteressados = await notificadorInteresse
  .verificarClientesInteressados(veiculo);

if (clientesInteressados.length > 0) {
  // Registrar notificações
  await notificadorInteresse.registrarNotificacoes(veiculo, clientesInteressados);
  
  // Mostrar notificação
  const notif = notificadorInteresse.formatarNotificacao(veiculo, clientesInteressados);
  setNotificacao(notif);
}
```

### Exemplo de Notificação Exibida

```
✓ Cliente(s) Interessado(s)

2 cliente(s) está(ão) interessado(s) em Civic!

João Silva, Maria Santos
```

### Métodos Disponíveis

```javascript
import { notificadorInteresse } from './src/utils/notificadorInteresse';

// Verificar clientes interessados
const clientes = await notificadorInteresse.verificarClientesInteressados(veiculo);

// Formatar notificação
const notif = notificadorInteresse.formatarNotificacao(veiculo, clientes);

// Registrar notificações no banco
await notificadorInteresse.registrarNotificacoes(veiculo, clientes);

// Buscar clientes por modelo
const porModelo = await clientesRepository.buscarClientesPorModelo('Civic');

// Buscar clientes por faixa de preço
const porFaixa = await clientesRepository.buscarClientesPorFaixa('40mil_60mil');
```

---

## 🎂 Sistema de Emails de Aniversário

### Como Funciona

1. **Detecção Automática**: Sistema identifica clientes com aniversário no mês
2. **Email Personalizado**: Gera mensagem formatada com parabéns e oferta
3. **Mailto Link**: Abre cliente de email padrão com conteúdo pré-preenchido
4. **Registro de Envio**: Controla se o email já foi enviado neste ano

### Página de Aniversariantes

**Localização**: `/aniversariantes`

**Funcionalidades**:
- 📊 Lista de todos os aniversariantes do mês
- 👁️ Visualizar template do email antes de enviar
- 📧 Enviar email com um clique
- ✓ Indicador de emails já enviados
- 🎂 Idade do cliente em destaque

### Template de Email

O template é gerado automaticamente com:
- Assunto personalizado
- Mensagem de parabéns
- Oferta especial
- Dados do cliente

**Exemplo**:
```
Para: joao@email.com
Assunto: Feliz Aniversário, João Silva! 🎉

Olá João,

Hoje é seu dia especial! 30 anos

A AutoElite vem desejando um FELIZ ANIVERSÁRIO para você! 🎊

Aproveitamos para oferecer um atendimento especial em nossa concessionária.
Visite-nos e conheça nossas ofertas exclusivas para você neste mês!

Conte conosco para encontrar o carro perfeito.

Abraços,
Equipe AutoElite 🚗
```

### Métodos Disponíveis

```javascript
import { emailAniversario } from './src/utils/emailAniversario';

// Calcular próximo aniversário
const proximoAniversario = emailAniversario.calcularProximoAniversario('1990-05-15');

// Verificar se é aniversário próximo
const ehProximo = emailAniversario.ehAniversarioProximo('1990-05-15', 0); // 0 dias (hoje)

// Calcular idade
const idade = emailAniversario.calcularIdade('1990-05-15');

// Gerar conteúdo do email
const conteudo = emailAniversario.gerarConteudoEmail(cliente);
// Retorna: { assunto, corpo, para, cliente }

// Gerar mailto link
const mailtoLink = emailAniversario.gerarMailtoLink(cliente);
// Abre: mailto:email@example.com?subject=...&body=...

// Buscar aniversariantes do mês
const aniversariantes = await emailAniversario.buscarAniversariantesDoMes();

// Registrar email como enviado
await emailAniversario.registrarEmailEnviado(clienteId);

// Verificar se já foi enviado
const jaEnviado = await emailAniversario.jaSendoEnviadoEsteAno(clienteId);
```

---

## 🔧 Integração e Uso

### 1. Importar Utilitários

```javascript
// Em qualquer página ou componente
import { clientesRepository } from '../data/clientesRepository';
import { notificadorInteresse } from '../utils/notificadorInteresse';
import { emailAniversario } from '../utils/emailAniversario';
```

### 2. Usar em Componentes React

```jsx
import { Aniversariantes } from './pages/Aniversariantes';

// Na rota apropriada
<Route path="/aniversariantes" element={<Aniversariantes />} />
```

### 3. Estrutura de Componentes

```
src/
├── pages/
│   ├── FormCliente.jsx          ← Cadastro de clientes
│   ├── Aniversariantes.jsx      ← Visualização de aniversariantes
│   ├── FormNovoVeiculo.jsx      ← Cadastro de veículos (com notificações)
│   └── ...
├── utils/
│   ├── notificadorInteresse.js  ← Lógica de notificações
│   └── emailAniversario.js      ← Lógica de emails de aniversário
├── data/
│   └── clientesRepository.js    ← Repositório de clientes
└── styles/
    └── aniversariantes.css      ← Estilos da página
```

---

## 📊 Exemplo Prático - Fluxo Completo

### Cenário: Novo cliente interessado em Civic na faixa de 40-60k

1. **Cadastrar Cliente**
   ```javascript
   const cliente = await clientesRepository.criar({
     nome: 'Carlos Souza',
     email: 'carlos@email.com',
     modelo_interesse: 'Civic',
     faixa_preco: '40mil_60mil',
     data_nascimento: '1985-03-20',
     telefone: '(11) 99999-8888'
   });
   ```

2. **Cadastrar Novo Veículo (Civic 50k)**
   - Formulário detecta interesse automático
   - Exibe: "1 cliente está interessado em Civic!"

3. **Aniversário em Março**
   - Acessar `/aniversariantes`
   - Clicar em "Enviar Email" para Carlos
   - Email abre no cliente padrão
   - Clicar para enviar
   - Sistema registra envio

---

## 🐛 Troubleshooting

### Problema: Notificações não aparecem

**Solução**:
1. Verifique se modelo_interesse está preenchido
2. Certifique-se que faixa_preco do cliente está na lista válida
3. Verifique console do navegador para erros

### Problema: Email não abre

**Solução**:
1. Necessário cliente de email configurado no SO
2. Para testar: Copiar manualmente o link mailto

### Problema: Data de nascimento não funciona

**Solução**:
1. Formato deve ser: YYYY-MM-DD
2. Verifique no banco de dados se o tipo é DATE

---

## 📱 Responsividade

Todos os componentes são responsivos:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (até 767px)

---

## 🚀 Próximas Melhorias (Opcional)

- [ ] Integração com serviço de email (SendGrid, Mailgun)
- [ ] Agendamento automático de emails
- [ ] SMS de aniversário
- [ ] Relatórios de interesse por modelo
- [ ] Dashboard com análise de clientes
- [ ] Push notifications
- [ ] Integração com CRM externo

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar console do navegador (F12)
2. Verificar logs do Supabase
3. Testar conexão com banco de dados

---

**Versão**: 1.0  
**Data**: Dezembro 2025  
**Desenvolvedor**: AutoElite Team
