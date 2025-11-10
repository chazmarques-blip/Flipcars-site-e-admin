#!/bin/bash

# Script para configurar variável de ambiente no Vercel

echo "🔧 CONFIGURAR VERCEL ENVIRONMENT VARIABLE"
echo "=========================================="
echo ""
echo "Este script vai adicionar NEXT_PUBLIC_API_URL no Vercel"
echo ""

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

echo "1️⃣ Fazendo login no Vercel..."
vercel login

echo ""
echo "2️⃣ Indo para o diretório do frontend público..."
cd frontend-public

echo ""
echo "3️⃣ Linkando ao projeto (se necessário)..."
vercel link

echo ""
echo "4️⃣ Adicionando variável de ambiente..."
echo ""
echo "Quando perguntar o valor, cole:"
echo "https://upbeat-dedication-production.up.railway.app/api"
echo ""
echo "Pressione ENTER para continuar..."
read

vercel env add NEXT_PUBLIC_API_URL production

echo ""
echo "5️⃣ Adicionando para preview também..."
vercel env add NEXT_PUBLIC_API_URL preview

echo ""
echo "6️⃣ Adicionando para development também..."
vercel env add NEXT_PUBLIC_API_URL development

echo ""
echo "7️⃣ Fazendo redeploy..."
vercel --prod

echo ""
echo "✅ CONCLUÍDO!"
echo ""
echo "Aguarde 2-3 minutos para o deploy completar."
echo "Depois teste em: https://www.flipcars.us"

