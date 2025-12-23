#!/bin/bash
# Script para instalar dependências do CRM de Clientes

echo "Instalando dependências do CRM..."

npm install @supabase/supabase-js
npm install date-fns
npm install @heroicons/react

echo ""
echo "Dependências instaladas com sucesso!"
echo ""
echo "Proximos passos:"
echo "1. Copie .env.local.example para .env.local"
echo "2. Preencha as variaveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY"
echo "3. Execute o SQL em migrations/001_create_customers_table.sql no painel Supabase"
echo "4. Importe CustomersPage no seu App.jsx"
echo "5. Execute: npm run dev"
