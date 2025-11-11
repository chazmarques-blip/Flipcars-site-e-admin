# 🔥 GUIA COMPLETO - Setup Supabase Storage para Upload de Fotos

**Data**: 2025-11-11  
**Prioridade**: 🔴 **CRÍTICA** - BLOCKER para funcionalidade de fotos  
**Tempo Estimado**: 10-15 minutos

---

## 🎯 OBJETIVO

Configurar o Supabase Storage para permitir que os usuários façam upload de fotos no formulário de estimate do FlipCars.

---

## ❌ PROBLEMA ATUAL

Quando o usuário tenta fazer upload de uma foto, a foto **NÃO APARECE** porque:

1. ❌ O bucket `lead-photos` **não existe** no Supabase
2. ❌ As variáveis de ambiente do Supabase **podem estar faltando** no Railway
3. ❌ As políticas RLS (Row Level Security) **não estão configuradas**

**Resultado**: Fotos não são salvas, upload falha silenciosamente.

---

## ✅ SOLUÇÃO

### Fase 1: Configurar Supabase Storage (5 min)
### Fase 2: Configurar Variáveis no Railway (3 min)
### Fase 3: Testar Funcionalidade (2 min)

---

## 📋 PRÉ-REQUISITOS

Você precisa ter acesso a:
- ✅ Supabase Dashboard (console.supabase.com)
- ✅ Railway Dashboard (railway.app)
- ✅ Credenciais do projeto Supabase

---

## 🚀 FASE 1: CONFIGURAR SUPABASE STORAGE

### Opção A: Via SQL Editor (Recomendado - Mais Rápido)

1. **Acesse Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Login com sua conta
   - Selecione o projeto **FlipCars**

2. **Abra o SQL Editor**
   - No menu lateral, clique em **"SQL Editor"**
   - Ou acesse diretamente: `https://supabase.com/dashboard/project/[SEU-PROJECT-ID]/sql`

3. **Execute o Script SQL**
   - Clique em **"New Query"**
   - Copie **TODO** o conteúdo do arquivo `supabase-storage-setup.sql`
   - Cole no editor
   - Clique em **"Run"** ou pressione `Ctrl+Enter`

4. **Verifique o Resultado**
   - Você deve ver mensagens de sucesso:
     ```
     ✅ INSERT 0 1  (bucket criado)
     ✅ CREATE POLICY  (políticas criadas)
     ```
   - Se ver erro "already exists", está OK! Significa que já foi criado antes.

5. **Confirme no Storage UI**
   - No menu lateral, clique em **"Storage"**
   - Você deve ver o bucket **"lead-photos"** listado
   - Badge **"Public"** deve estar visível

---

### Opção B: Via Interface UI (Alternativa)

1. **Acesse Storage no Supabase**
   - Menu lateral → **"Storage"**
   - Clique em **"New bucket"**

2. **Configure o Bucket**
   ```
   Name: lead-photos
   Public bucket: ✅ (marque esta opção)
   File size limit: 5 MB
   Allowed MIME types:
     - image/jpeg
     - image/jpg  
     - image/png
     - image/gif
     - image/webp
   ```

3. **Crie as Políticas RLS**
   - Clique no bucket **"lead-photos"**
   - Aba **"Policies"**
   - Clique **"New Policy"**

   **Política 1: Upload Público**
   ```
   Policy name: Public can upload lead photos
   Target roles: public
   Policy command: INSERT
   Using expression: (bucket_id = 'lead-photos')
   ```

   **Política 2: Leitura Pública**
   ```
   Policy name: Public can view lead photos
   Target roles: public
   Policy command: SELECT
   Using expression: (bucket_id = 'lead-photos')
   ```

   **Política 3: Update Autenticado**
   ```
   Policy name: Authenticated users can update lead photos
   Target roles: authenticated
   Policy command: UPDATE
   Using expression: (bucket_id = 'lead-photos')
   With check: (bucket_id = 'lead-photos')
   ```

   **Política 4: Delete Autenticado**
   ```
   Policy name: Authenticated users can delete lead photos
   Target roles: authenticated
   Policy command: DELETE
   Using expression: (bucket_id = 'lead-photos')
   ```

---

## 🔑 FASE 2: CONFIGURAR VARIÁVEIS NO RAILWAY

### 1. Obtenha as Credenciais Supabase

**No Supabase Dashboard:**
- Menu lateral → **"Settings"** → **"API"**
- Copie os seguintes valores:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (⚠️ Secreta!)
```

⚠️ **IMPORTANTE**: A `service_role key` é **SECRETA** e dá acesso completo ao seu Supabase!

---

### 2. Configure no Railway (Backend)

**Acesse Railway Dashboard:**
- URL: https://railway.app
- Selecione o projeto **FlipCars**
- Clique no serviço **"backend"** (API)

**Adicione as Variáveis:**
- Aba **"Variables"**
- Clique **"+ New Variable"**

Adicione estas 2 variáveis:

```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Use EXATAMENTE esses nomes de variáveis!** O código espera esses nomes.

**Clique em "Deploy"** ou aguarde o redeploy automático (~2-3 minutos)

---

### 3. (Opcional) Configure no Frontend

Se você quiser que o frontend acesse o Supabase diretamente no futuro:

**Railway Dashboard → Frontend Service:**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Nota**: Use `anon key` no frontend (não `service_role key`!)

---

## 🧪 FASE 3: TESTAR FUNCIONALIDADE

### Teste 1: Health Check da API

**Aguarde o deploy do Railway completar (2-3 min), então:**

Acesse no navegador:
```
https://upbeat-dedication-production.up.railway.app/api/public/upload/storage-health
```

**Resposta esperada (✅ SUCESSO):**
```json
{
  "success": true,
  "message": "Supabase Storage is healthy",
  "data": {
    "bucketName": "lead-photos",
    "bucketExists": true,
    "bucketPublic": true
  }
}
```

**Se `success: false`:**
- ❌ Verifique se as variáveis de ambiente estão corretas
- ❌ Confirme que o bucket foi criado no Supabase
- ❌ Verifique os logs do Railway para erros

---

### Teste 2: Upload de Foto no Formulário

1. **Acesse o Site**
   - URL: https://flipcars.us
   - Clique em **"Get Free Estimate"**

2. **Preencha o Formulário**
   - **Step 1**: Nome, email, telefone
   - **Step 2**: Selecione **"Body Shop Repair"**
   - **Step 3**: Tente fazer upload de uma foto

3. **Observe o Console do Navegador** (F12)
   ```javascript
   [ImageCompress] 📸 Original file: foto.jpg (3.50MB)
   [ImageCompress] ✅ Compressed: foto.jpg (0.28MB)
   [UploadService] ⬆️  Uploading to server...
   [UploadService] ✅ Upload successful: https://xxxxx.supabase.co/storage/v1/object/public/lead-photos/123.jpg
   ```

4. **Verifique no Supabase**
   - Supabase Dashboard → Storage → lead-photos
   - Você deve ver o arquivo que acabou de fazer upload!

---

## 🔍 TROUBLESHOOTING

### Problema 1: "Bucket not found"

**Sintomas:**
```json
{
  "success": false,
  "message": "Supabase Storage has issues",
  "data": {
    "bucketExists": false
  }
}
```

**Solução:**
- Execute o script SQL novamente
- Ou crie o bucket manualmente via UI
- Verifique se o nome é exatamente `lead-photos` (sem espaços)

---

### Problema 2: "Invalid credentials"

**Sintomas:**
```
❌ Supabase credentials not configured!
```

**Solução:**
- Verifique se as variáveis estão no Railway
- Nomes devem ser EXATAMENTE:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Faça redeploy após adicionar variáveis

---

### Problema 3: "Upload failed - 403 Forbidden"

**Sintomas:**
```
❌ Upload failed: new row violates row-level security policy
```

**Solução:**
- As políticas RLS não foram criadas
- Execute a parte das políticas do SQL script
- Ou crie manualmente via UI (ver Opção B acima)

---

### Problema 4: Foto não aparece no navegador

**Sintomas:**
- Upload diz sucesso
- Mas imagem não carrega (404 ou erro de CORS)

**Solução:**
- Confirme que o bucket é **PUBLIC**
- Supabase → Storage → lead-photos → Settings
- Toggle **"Public bucket"** deve estar **ON**

---

## 📊 ARQUITETURA FINAL

### Como Funciona Agora:

```
┌─────────────┐
│   Usuário   │
│ Seleciona   │
│   Foto      │
└──────┬──────┘
       │
       ├─► 1. Compressão (Frontend)
       │   300KB max, 1920px
       │
       ├─► 2. Upload via API
       │   POST /public/upload/photo
       │   FormData (multipart)
       │
       ├─► 3. Backend → Supabase
       │   supabase.storage.from('lead-photos').upload()
       │
       ├─► 4. Supabase Storage
       │   Salva permanentemente
       │   Retorna URL pública
       │
       └─► 5. Lead Criado
           Com URL da foto do Supabase
           Admin pode ver foto
```

---

## ✅ CHECKLIST FINAL

Antes de considerar completo, confirme:

- [ ] Bucket `lead-photos` existe no Supabase
- [ ] Bucket está marcado como **PUBLIC**
- [ ] 4 políticas RLS foram criadas
- [ ] Variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` no Railway
- [ ] Redeploy do backend foi concluído
- [ ] Health check retorna `success: true`
- [ ] Upload de foto funciona no formulário
- [ ] Foto aparece no Supabase Storage
- [ ] URL da foto é válida e acessível

---

## 📝 PRÓXIMOS PASSOS (DEPOIS DO SETUP)

Uma vez que o storage esteja funcionando:

1. ✅ Testar formulário completo (Step 1 → Step 5)
2. ✅ Verificar fotos no admin dashboard
3. ✅ Fazer commit do arquivo SQL
4. ✅ Atualizar documentação
5. ✅ Adicionar feature "Other insurance" (Prioridade 3)

---

## 🔗 LINKS ÚTEIS

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Railway Dashboard**: https://railway.app
- **Supabase Storage Docs**: https://supabase.com/docs/guides/storage
- **Health Check API**: https://upbeat-dedication-production.up.railway.app/api/public/upload/storage-health
- **FlipCars Site**: https://flipcars.us

---

## 📞 SUPORTE

Se encontrar problemas:

1. Verifique os logs do Railway (Backend service → Deploy logs)
2. Verifique o console do navegador (F12)
3. Teste o health check endpoint
4. Revise este guia passo a passo

---

**Criado em**: 2025-11-11  
**Arquivo SQL**: `supabase-storage-setup.sql`  
**Tempo estimado**: 10-15 minutos  
**Status**: ⏳ Aguardando configuração manual no Supabase
