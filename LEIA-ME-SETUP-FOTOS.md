# 📸 URGENTE - Fotos Não Aparecem? Configure Aqui!

## 🔴 PROBLEMA

As fotos no formulário de estimate **não estão sendo salvas** porque falta configurar o Supabase Storage.

## ✅ SOLUÇÃO RÁPIDA (10 minutos)

### 1️⃣ Abra o Supabase

- Vá em: https://supabase.com/dashboard
- Selecione projeto **FlipCars**
- Menu lateral → **SQL Editor**

### 2️⃣ Execute o SQL

- Clique em **"New Query"**
- Copie **TUDO** do arquivo `supabase-storage-setup.sql`
- Cole no editor
- Clique **"Run"** (ou `Ctrl+Enter`)

### 3️⃣ Configure Railway

**Obtenha as credenciais no Supabase:**
- Menu → Settings → API
- Copie:
  - `Project URL`
  - `service_role key` (⚠️ secreta!)

**Adicione no Railway:**
- Acesse: https://railway.app
- Projeto **FlipCars** → Serviço **backend**
- Aba **"Variables"** → **"+ New Variable"**

Adicione estas 2 variáveis:

```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Aguarde redeploy (2-3 min)

### 4️⃣ Teste

Acesse: https://upbeat-dedication-production.up.railway.app/api/public/upload/storage-health

Deve retornar:
```json
{
  "success": true,
  "message": "Supabase Storage is healthy"
}
```

✅ **Pronto!** Agora as fotos vão funcionar!

---

## 📚 Guia Completo

Para instruções detalhadas, veja: `SUPABASE_STORAGE_SETUP_GUIDE.md`

## 📁 Arquivos

- `supabase-storage-setup.sql` - Script SQL para executar
- `SUPABASE_STORAGE_SETUP_GUIDE.md` - Guia passo-a-passo completo (inglês)
- `LEIA-ME-SETUP-FOTOS.md` - Este arquivo (português)

---

**Criado em**: 2025-11-11  
**Tempo necessário**: 10 minutos  
**Prioridade**: 🔴 CRÍTICA
