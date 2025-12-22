# TonCar Multimarcas - Painel de Gerenciamento

Painel de gerenciamento de veículos com integração Supabase.

## 🚀 Funcionalidades

### Autenticação
- Login com email/usuário e senha
- Sessão baseada em localStorage com token
- Proteção de rotas
- Logout

### Dashboard
- Cards com estatísticas (total de veículos, disponíveis, reservados, vendidos)
- Lista dos últimos veículos cadastrados
- Acesso rápido para novo veículo

### Gerenciamento de Veículos
- **Listar**: Exibir todos os veículos com busca e filtros
- **Novo**: Formulário completo para cadastrar veículo
- **Detalhes**: Visualizar informações completas com galeria de fotos
- **Editar**: Atualizar dados e gerenciar fotos
- **Deletar**: Remover veículos com confirmação

### Upload de Fotos
- Foto de capa principal
- Galeria com múltiplas fotos
- Preview de imagens
- Armazenamento em Supabase Storage

## 🛠 Tecnologias

- **Frontend**: React + Vite
- **Roteamento**: React Router
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Estilos**: CSS puro

## 📋 Estrutura de Pastas

```
src/
├── components/       # Componentes reutilizáveis
│   ├── FormInputs.jsx
│   ├── Upload.jsx
│   ├── CardVeiculo.jsx
│   ├── ModalConfirmacao.jsx
│   ├── ToastNotificacao.jsx
│   └── RotaProtegida.jsx
├── pages/           # Páginas/Rotas
│   ├── TelaLogin.jsx
│   ├── Dashboard.jsx
│   ├── ListaVeiculos.jsx
│   ├── FormNovoVeiculo.jsx
│   ├── DetalheVeiculo.jsx
│   └── FormEditarVeiculo.jsx
├── config/          # Configurações
│   ├── supabase.js
│   └── constantes.js
├── data/            # Repositórios de dados
│   ├── veiculosRepository.js
│   └── storageFotos.js
├── hooks/           # Custom hooks
│   └── useAuth.js
├── utils/           # Funções utilitárias
│   └── auth.js
├── styles/          # Estilos CSS
├── App.jsx
├── main.jsx
└── index.css
```

## 🔧 Configuração Supabase

### 1. Criar Projeto Supabase
- Acesse [supabase.com](https://supabase.com)
- Crie um novo projeto

### 2. Criar Tabelas

**Tabela: veiculos**
```sql
CREATE TABLE veiculos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  ano INTEGER NOT NULL,
  km INTEGER NOT NULL,
  cor VARCHAR(50),
  cambio VARCHAR(50) NOT NULL,
  combustivel VARCHAR(50) NOT NULL,
  preco DECIMAL(12, 2) NOT NULL,
  descricao TEXT,
  opcionais TEXT[],
  status VARCHAR(50) DEFAULT 'disponível',
  foto_capa TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Tabela: fotos_veiculos**
```sql
CREATE TABLE fotos_veiculos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  veiculo_id UUID NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
  caminho VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  tipo VARCHAR(50),
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Criar Storage Bucket
- Nome: `veiculos-fotos`
- Configurar como público

### 4. Configurar .env

```bash
cp .env.example .env
```

Editar `.env`:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

## 🚀 Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📝 Credenciais Demo

Padrão para teste:
- **Email**: admin@toncar.com.br
- **Senha**: admin123456

⚠️ **Em produção**, integrar com Supabase Auth Real

## 📱 Componentes

### Input / TextArea / Select
Componentes de formulário reutilizáveis com validação e feedback de erro

### Upload
Componente drag-and-drop para upload de imagens com preview

### CardVeiculo
Card para exibir veículo com imagem, dados e ações

### ModalConfirmacao
Modal genérico para confirmações

### ToastNotificacao
Notificação flutuante (sucesso, erro, info, warning)

## 🔒 Segurança

- Token simples em localStorage (pode ser melhorado com JWT)
- Middleware de proteção de rotas
- Validação no frontend (validação no backend necessária em produção)

## 📱 Responsivo

Todos os componentes são responsivos e funcionam bem em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎨 Paleta de Cores

```css
--primary: #1e40af (Azul)
--secondary: #64748b (Cinza)
--danger: #dc2626 (Vermelho)
--success: #16a34a (Verde)
--warning: #f59e0b (Amarelo)
--light: #f8fafc (Claro)
--border: #e2e8f0 (Borda)
--text: #1e293b (Texto)
--text-light: #64748b (Texto Claro)
```

## 📞 Suporte

Para mais informações, consulte a documentação do Supabase:
- https://supabase.com/docs
- https://supabase.com/docs/guides/storage

## 📄 Licença

MIT
