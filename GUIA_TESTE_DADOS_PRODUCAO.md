# 🧪 Guia: Testar Dados em Produção

**Como verificar e trabalhar com dados reais do Railway backend**

---

## 🎯 Estrutura do Banco de Dados (Railway PostgreSQL)

O backend Railway possui **21 tabelas** já criadas:

### Principais Tabelas

| Tabela | Descrição | Registros Esperados |
|--------|-----------|---------------------|
| `users` | Usuários do sistema | Admin + agents |
| `leads` | Leads de clientes | Potenciais clientes |
| `customers` | Clientes confirmados | Clientes ativos |
| `claims` | Claims de seguros | Processos de claims |
| `vehicles` | Veículos cadastrados | Carros dos clientes |
| `estimates` | Orçamentos | Estimativas de reparo |
| `files` | Arquivos/documentos | Uploads diversos |
| `notifications` | Notificações | Sistema de alertas |
| `activities` | Log de atividades | Histórico de ações |

---

## 🔍 Como Acessar os Dados

### Via Admin Dashboard (Frontend)

✅ **Já funcional em:** https://admin.flipcars.us

**Páginas Disponíveis:**
```
/dashboard              ← Visão geral + estatísticas
/dashboard/leads        ← Gerenciar leads
/dashboard/customers    ← Gerenciar clientes
/dashboard/claims       ← Gerenciar claims
/dashboard/users        ← Gerenciar usuários (admin only)
/dashboard/files        ← Gerenciar arquivos
/dashboard/settings     ← Configurações
```

### Via API Direto (Teste Backend)

**Base URL:** `https://upbeat-dedication-production.up.railway.app/api`

**Autenticação:**
```bash
# 1. Login para obter token
curl -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@flipcars.com",
    "password": "Admin123!"
  }' | jq '.tokens.accessToken'

# Copiar o accessToken retornado
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Endpoints Disponíveis:**

```bash
# Usuários
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/users

# Leads
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/leads

# Customers
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/customers

# Claims
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/claims

# Vehicles
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/vehicles

# Files
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/files

# Notifications
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/notifications

# Activities (audit log)
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/activities
```

---

## 📊 Verificar Estado Atual do Banco

### Script de Verificação

```bash
#!/bin/bash
# verify-database.sh

API_URL="https://upbeat-dedication-production.up.railway.app/api"

# Login
echo "🔐 Fazendo login..."
RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flipcars.com","password":"Admin123!"}')

TOKEN=$(echo $RESPONSE | jq -r '.tokens.accessToken')

if [ "$TOKEN" == "null" ]; then
  echo "❌ Erro no login!"
  exit 1
fi

echo "✅ Login bem-sucedido!"
echo ""

# Verificar cada endpoint
echo "📊 Verificando dados..."
echo ""

# Users
echo "👥 USERS:"
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/users" | jq 'length'
echo ""

# Leads
echo "🚗 LEADS:"
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/leads" | jq 'length'
echo ""

# Customers
echo "👤 CUSTOMERS:"
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/customers" | jq 'length'
echo ""

# Claims
echo "📄 CLAIMS:"
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/claims" | jq 'length'
echo ""

# Vehicles
echo "🚙 VEHICLES:"
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/vehicles" | jq 'length'
echo ""

echo "✅ Verificação completa!"
```

**Rodar:**
```bash
chmod +x verify-database.sh
./verify-database.sh
```

---

## 📝 Criar Dados de Teste

### 1. Criar Novo Lead

**Via Dashboard:**
1. Ir para: https://admin.flipcars.us/dashboard/leads
2. Clicar em "New Lead" ou "Add Lead"
3. Preencher formulário
4. Salvar

**Via API:**
```bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/leads \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "João Silva",
    "email": "joao.silva@email.com",
    "phone": "+55 11 98765-4321",
    "vehicle": {
      "make": "Toyota",
      "model": "Corolla",
      "year": 2023,
      "plate": "ABC-1234"
    },
    "damageDescription": "Batida lateral na porta do motorista",
    "status": "new"
  }'
```

### 2. Criar Novo Customer

```bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria.santos@email.com",
    "phone": "+55 11 91234-5678",
    "address": {
      "street": "Rua das Flores",
      "number": "123",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01234-567"
    }
  }'
```

### 3. Criar Novo Claim

```bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/claims \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "UUID_DO_CLIENTE",
    "vehicleId": "UUID_DO_VEICULO",
    "damageType": "collision",
    "description": "Colisão frontal no estacionamento",
    "estimatedAmount": 5000.00,
    "status": "open"
  }'
```

---

## 🧹 Limpar Dados de Teste

**⚠️ CUIDADO:** Só execute se souber o que está fazendo!

```bash
# Deletar lead específico
curl -X DELETE https://upbeat-dedication-production.up.railway.app/api/leads/LEAD_ID \
  -H "Authorization: Bearer $TOKEN"

# Deletar customer específico
curl -X DELETE https://upbeat-dedication-production.up.railway.app/api/customers/CUSTOMER_ID \
  -H "Authorization: Bearer $TOKEN"

# Deletar claim específico
curl -X DELETE https://upbeat-dedication-production.up.railway.app/api/claims/CLAIM_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Queries Úteis para Análise

### Listar Todos os Leads com Filtros

```bash
# Leads novos
curl -H "Authorization: Bearer $TOKEN" \
  "$API_URL/leads?status=new"

# Leads qualificados
curl -H "Authorization: Bearer $TOKEN" \
  "$API_URL/leads?status=qualified"

# Leads dos últimos 7 dias
curl -H "Authorization: Bearer $TOKEN" \
  "$API_URL/leads?createdAfter=$(date -d '7 days ago' +%Y-%m-%d)"
```

### Buscar Customer por Email

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "$API_URL/customers?email=joao.silva@email.com"
```

### Listar Claims Abertas

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "$API_URL/claims?status=open"
```

---

## 🔄 Sincronização: Frontend ↔ Backend

### Como o Dashboard Consome os Dados

**Exemplo: Página de Leads**

```typescript
// src/app/dashboard/leads/page.tsx

import { useEffect, useState } from 'react';
import { leadService } from '@/lib/api';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const data = await leadService.getAll();
        setLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLeads();
  }, []);

  // Render leads...
}
```

### Verificar Integração Frontend → Backend

**No navegador (F12 Console):**
```javascript
// Ver chamadas de API
// 1. Abrir DevTools (F12)
// 2. Ir para aba "Network"
// 3. Filtrar por "Fetch/XHR"
// 4. Navegar pelo dashboard
// 5. Ver todas as requests para Railway backend

// Ver tokens salvos
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('User Data:', localStorage.getItem('flipcars-user'));
```

---

## 🎯 Checklist: Testar Funcionalidades

### Dashboard Principal
- [ ] Login com admin@flipcars.com
- [ ] Dashboard carrega estatísticas corretas
- [ ] Widgets exibem números reais do banco
- [ ] Gráficos/charts carregam corretamente
- [ ] Menu lateral funciona
- [ ] Header exibe nome e role do usuário

### Leads Management
- [ ] Listar todos os leads
- [ ] Criar novo lead
- [ ] Editar lead existente
- [ ] Deletar lead
- [ ] Filtrar leads por status
- [ ] Buscar lead por nome/email
- [ ] Ver detalhes do lead

### Customers Management
- [ ] Listar todos os customers
- [ ] Criar novo customer
- [ ] Editar customer
- [ ] Ver histórico do customer
- [ ] Associar vehicle ao customer

### Claims Management
- [ ] Listar claims
- [ ] Criar novo claim
- [ ] Atualizar status do claim
- [ ] Upload de arquivos/fotos
- [ ] Gerar orçamento
- [ ] Aprovar/rejeitar claim

### Files Management
- [ ] Listar arquivos
- [ ] Upload de novos arquivos
- [ ] Download de arquivos
- [ ] Deletar arquivos
- [ ] Categorizar arquivos

### Users Management (Admin Only)
- [ ] Listar usuários
- [ ] Criar novo usuário/agent
- [ ] Editar permissões
- [ ] Desativar usuário
- [ ] Ver log de atividades

---

## 🚨 Troubleshooting: Dados Não Aparecem

### Problema: Lista vazia mesmo tendo dados

**Verificar:**
```bash
# 1. Backend está respondendo?
curl -I https://upbeat-dedication-production.up.railway.app/health

# 2. Token válido?
# Fazer login novamente e verificar se token expira muito rápido

# 3. Endpoint correto?
# Ver console do navegador para ver URL sendo chamada

# 4. CORS configurado?
# Backend precisa permitir requests de admin.flipcars.us
```

**No backend, verificar CORS (NestJS):**
```typescript
// main.ts
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://admin.flipcars.us',
    'https://*.vercel.app'
  ],
  credentials: true,
});
```

### Problema: 401 Unauthorized

**Causas Comuns:**
1. Token expirado (15 min de validade)
2. Token não sendo enviado no header
3. Refresh token não funcionando

**Solução:**
```javascript
// Fazer logout e login novamente
localStorage.clear();
window.location.href = '/auth/login';
```

### Problema: 403 Forbidden

**Causas:**
1. Usuário não tem permissão para o endpoint
2. Role incorreto

**Verificar:**
```javascript
// Ver role do usuário
const user = JSON.parse(localStorage.getItem('flipcars-user'));
console.log('User roles:', user.roles);

// Deve ter pelo menos 'admin' ou 'superadmin'
```

---

## 📚 Documentação da API (Swagger)

**URL:** https://upbeat-dedication-production.up.railway.app/api/docs

Acesse para ver:
- ✅ Todos os endpoints disponíveis
- ✅ Request/response examples
- ✅ Testar endpoints diretamente
- ✅ Schemas dos dados

---

## 💡 Dicas Pro

### 1. Usar React Query para Cache
```typescript
import { useQuery } from '@tanstack/react-query';

function LeadsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => leadService.getAll(),
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });
}
```

### 2. Implementar Loading States
```typescript
{loading ? (
  <Spinner />
) : leads.length === 0 ? (
  <EmptyState message="No leads found" />
) : (
  <LeadsList leads={leads} />
)}
```

### 3. Error Handling Robusto
```typescript
try {
  await leadService.create(data);
  toast.success('Lead created!');
} catch (error) {
  if (error.status === 401) {
    router.push('/auth/login');
  } else {
    toast.error(error.message || 'Failed to create lead');
  }
}
```

---

## ✅ Resumo

**Para testar dados em produção:**

1. ✅ **Acesse:** https://admin.flipcars.us
2. ✅ **Login:** admin@flipcars.com / Admin123!
3. ✅ **Navegue** pelas páginas do dashboard
4. ✅ **Crie** alguns dados de teste
5. ✅ **Verifique** via API diretamente se necessário
6. ✅ **Monitore** console do navegador para erros

**Backend está funcionando!**  
**Frontend está funcionando!**  
**Agora é só usar e melhorar! 🚀**
