#!/bin/bash

# ============================================
# 🧪 SCRIPT DE TESTE DE LOGIN
# ============================================

echo "=========================================="
echo "🔍 TESTE 1: API está online?"
echo "=========================================="
echo ""

curl https://upbeat-dedication-production.up.railway.app/api/health

echo ""
echo ""
echo "=========================================="
echo "🔐 TESTE 2: Fazer login"
echo "=========================================="
echo ""
echo "⚠️  IMPORTANTE: Substitua 'SUA_SENHA' pela senha real!"
echo ""

# Uncomment e substitua SUA_SENHA pela senha real:
# curl -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
#   -H "Content-Type: application/json" \
#   -d '{"email":"admin@flipcars.us","password":"SUA_SENHA"}'

echo ""
echo "=========================================="
echo "📝 INSTRUÇÕES"
echo "=========================================="
echo ""
echo "1. Copie o comando acima"
echo "2. Substitua 'SUA_SENHA' pela sua senha real"
echo "3. Execute no terminal"
echo ""
echo "✅ Se retornar accessToken → Login funcionando!"
echo "❌ Se retornar 'Invalid credentials' → Senha incorreta"
echo ""
