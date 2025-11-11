# 🚀 IMPLEMENTAÇÃO SUPABASE STORAGE - FLIPCARS

**Data:** 11/11/2025  
**Status:** ⚠️ **AGUARDANDO CONFIGURAÇÃO FINAL DAS POLÍTICAS**

---

## ✅ O QUE JÁ FOI FEITO

### 1. ✅ Código Implementado (625edef3, 897f544b)

**Arquivo criado:** `backend/src/modules/leads/services/supabase-storage.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';

@Injectable()
export class SupabaseStorageService {
  private readonly logger = new Logger(SupabaseStorageService.name);
  private supabase: SupabaseClient;
  private readonly bucketName = 'lead-photos';

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Supabase Storage Service initialized');
  }

  async uploadPhoto(file: Express.Multer.File, leadId: string): Promise<string> {
    try {
      // Otimizar imagem com sharp
      const optimizedBuffer = await sharp(file.buffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Upload para Supabase Storage
      const fileName = `${leadId}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(fileName, optimizedBuffer, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Retornar URL pública
      const { data: { publicUrl } } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName);

      this.logger.log(`Photo uploaded successfully: ${fileName}`);
      return publicUrl;
    } catch (error) {
      this.logger.error('Error uploading photo:', error);
      throw error;
    }
  }

  async deletePhoto(photoUrl: string): Promise<void> {
    try {
      const fileName = photoUrl.split(`${this.bucketName}/`)[1];
      if (!fileName) return;

      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([fileName]);

      if (error) throw error;
      this.logger.log(`Photo deleted: ${fileName}`);
    } catch (error) {
      this.logger.error('Error deleting photo:', error);
      throw error;
    }
  }
}
```

**Features:**
- ✅ Otimização automática de imagens (Sharp)
- ✅ Upload com path organizado por leadId
- ✅ Retorna URL pública
- ✅ Delete de fotos antigas
- ✅ Logs detalhados

---

### 2. ✅ Variáveis de Ambiente no Railway

**Adicionado no Railway Dashboard:**

```bash
SUPABASE_URL=https://kvjvieekkudeqtnunqlb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU6WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04
```

**Como adicionar:**
1. Railway Dashboard → Projeto backend
2. Variables → Add Variable
3. Colar as duas variáveis
4. Save → Deploy automático

✅ **CONCLUÍDO**

---

### 3. ✅ Bucket "lead-photos" Criado

**Configuração do Bucket:**
- **Nome:** `lead-photos`
- **Público:** ✅ Sim (fotos acessíveis via URL)
- **Limite:** 5MB por arquivo
- **Tipos aceitos:** JPEG, PNG, WebP

**Como foi criado:**
1. Supabase Dashboard → Storage
2. Create Bucket → "lead-photos"
3. ✅ Public bucket
4. File size limit: 5MB

✅ **CONCLUÍDO**

---

## ⏳ PRÓXIMA AÇÃO IMEDIATA

### 🎯 Configurar 3 Políticas de Acesso SQL

**IMPORTANTE:** Sem essas políticas, o upload **NÃO funcionará**!

#### **PASSO A PASSO:**

1. **Acessar Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Projeto: **"My Truck Admin"** (kvjvieekkudeqtnunqlb)

2. **Abrir SQL Editor**
   - Menu lateral → SQL Editor
   - Botão: "+ New query"

3. **Executar as 3 Queries Abaixo:**

---

### ✅ QUERY 1: Leitura Pública (Public Read)

```sql
-- Permite que qualquer pessoa visualize as fotos via URL pública
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'lead-photos');
```

**O que faz:**
- Permite acesso público para **leitura** (visualizar fotos)
- Necessário para URLs públicas funcionarem

---

### ✅ QUERY 2: Upload via Service Role

```sql
-- Permite que o backend faça upload com service_role key
CREATE POLICY "Service role upload"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'lead-photos');
```

**O que faz:**
- Autoriza o backend Railway a fazer **upload** de fotos
- Usa a `SUPABASE_SERVICE_ROLE_KEY` para autenticação

---

### ✅ QUERY 3: Delete via Service Role

```sql
-- Permite que o backend delete fotos antigas
CREATE POLICY "Service role delete"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'lead-photos');
```

**O que faz:**
- Autoriza o backend a **deletar** fotos quando necessário
- Útil para substituir fotos ou remover leads

---

## 📋 CHECKLIST DE EXECUÇÃO

### **Antes de Executar as Queries:**
- [✅] Bucket "lead-photos" criado no Supabase
- [✅] Variáveis Railway configuradas
- [✅] Código commitado e pushado

### **Durante Execução das Queries:**
1. [ ] Abrir Supabase Dashboard → Projeto "My Truck Admin"
2. [ ] SQL Editor → New query
3. [ ] Executar Query 1 (Public read access)
4. [ ] Executar Query 2 (Service role upload)
5. [ ] Executar Query 3 (Service role delete)
6. [ ] Verificar: Storage → Policies → 3 políticas visíveis

### **Após Configuração:**
7. [ ] Verificar deploy Railway completou
8. [ ] Testar upload de foto no Admin Dashboard
9. [ ] Verificar URL pública da foto funciona
10. [ ] Verificar foto persiste após reload

---

## 🧪 COMO TESTAR APÓS CONFIGURAR

### **Teste 1: Upload Básico**

1. **Admin Dashboard:** https://admin.flipcars.us
2. Login → Leads → Selecionar um lead
3. Upload Photo → Escolher imagem
4. ✅ **Sucesso:** Foto aparece na galeria

### **Teste 2: URL Pública**

1. **Clicar com botão direito** na foto
2. "Abrir imagem em nova aba"
3. URL deve ser: `https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/lead-photos/...`
4. ✅ **Sucesso:** Foto carrega sem erro 403

### **Teste 3: Persistência**

1. Fazer upload de 2 fotos
2. Dar reload na página (F5)
3. ✅ **Sucesso:** Ambas fotos continuam visíveis

### **Teste 4: Delete**

1. Clicar em "Delete" em uma foto
2. Confirmar exclusão
3. ✅ **Sucesso:** Foto removida da galeria e do Storage

---

## 🔍 VERIFICAÇÃO DE DEPLOY

### **Railway Deploy Status:**

**Como verificar:**
```bash
# 1. Acessar Railway Dashboard
https://railway.app/project/[SEU_PROJETO]/service/[BACKEND]

# 2. Ver logs de deploy
# Deve mostrar:
✅ Build successful
✅ Deployment started
✅ Service running

# 3. Verificar variáveis de ambiente
Variables → Ver se SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão presentes
```

**Logs esperados:**
```
[Nest] LOG [SupabaseStorageService] Supabase Storage Service initialized
[Nest] LOG [LeadsModule] Module initialized
```

---

## ⚠️ TROUBLESHOOTING

### **Erro: "Supabase credentials not configured"**

**Causa:** Variáveis não carregadas no Railway

**Solução:**
1. Railway → Variables
2. Verificar se `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` existem
3. Re-deploy manualmente se necessário

---

### **Erro: "new row violates row-level security policy"**

**Causa:** Políticas SQL não configuradas

**Solução:**
1. Verificar se as 3 queries SQL foram executadas
2. Supabase → Storage → Policies
3. Deve mostrar 3 policies para "lead-photos"

---

### **Erro: "Failed to upload photo" (403 Forbidden)**

**Causa:** Bucket não está público OU política "Public read" faltando

**Solução:**
1. Supabase → Storage → lead-photos → Settings
2. ✅ "Public bucket" deve estar marcado
3. Executar Query 1 novamente (Public read access)

---

### **Fotos somem após reload**

**Causa:** URLs sendo salvas como "http://localhost" no banco

**Solução:**
1. ✅ Já resolvido no código (commit 625edef3)
2. Supabase sempre retorna URL completa
3. Verificar no banco: `SELECT photo_url FROM leads LIMIT 5;`
4. URLs devem começar com `https://kvjvieekkudeqtnunqlb.supabase.co`

---

## 📊 ARQUITETURA ATUAL

```
┌─────────────────────────────────────────────────────────────┐
│                  FLIPCARS STORAGE FLOW                      │
└─────────────────────────────────────────────────────────────┘

UPLOAD:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│   Supabase   │
│    Admin     │     │   Railway    │     │   Storage    │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                      │
                            │  1. Optimize (Sharp) │
                            │  2. Upload file      │
                            │  3. Get public URL   │
                            │  4. Save to DB       │
                            │                      │
                            ▼                      ▼
                     ┌──────────────┐     ┌──────────────┐
                     │  PostgreSQL  │     │ lead-photos/ │
                     │  (Supabase)  │     │   bucket     │
                     └──────────────┘     └──────────────┘

VISUALIZAÇÃO:
┌──────────────┐     ┌──────────────┐
│   Browser    │────▶│   Supabase   │
│  (qualquer)  │     │  Public URL  │
└──────────────┘     └──────────────┘
                     https://kvjvieekkudeqtnunqlb.supabase.co/
                     storage/v1/object/public/lead-photos/...
```

---

## 🔗 LINKS IMPORTANTES

| Recurso | URL |
|---------|-----|
| **Supabase Dashboard** | https://supabase.com/dashboard/project/kvjvieekkudeqtnunqlb |
| **Storage Settings** | https://supabase.com/dashboard/project/kvjvieekkudeqtnunqlb/storage/buckets/lead-photos |
| **SQL Editor** | https://supabase.com/dashboard/project/kvjvieekkudeqtnunqlb/sql/new |
| **Railway Backend** | https://railway.app/project/[SEU_PROJETO] |
| **Admin Dashboard** | https://admin.flipcars.us |
| **Backend API** | https://upbeat-dedication-production.up.railway.app/api |

---

## 📁 ARQUIVOS RELACIONADOS

### **Código:**
- `backend/src/modules/leads/services/supabase-storage.service.ts` ✅
- `backend/src/modules/leads/leads.controller.ts` (usa o service)
- `backend/src/modules/leads/leads.module.ts` (injeta o service)

### **Documentação:**
- `IMPLEMENTACAO_SUPABASE_STORAGE.md` (ESTE ARQUIVO)
- `docs/SUPABASE_STORAGE_SETUP.md` (guia detalhado)
- `docs/RAILWAY_ENV_SETUP.md` (como adicionar variáveis)

### **Commits Relevantes:**
- `625edef3` - Implementação do SupabaseStorageService
- `897f544b` - Documentação da configuração

---

## ✅ PRÓXIMOS PASSOS

### **AGORA (Você):**
1. [ ] Executar 3 queries SQL no Supabase
2. [ ] Verificar 3 políticas criadas (Storage → Policies)
3. [ ] Aguardar deploy Railway completar (~2 min)

### **DEPOIS (Teste):**
4. [ ] Testar upload de foto no Admin
5. [ ] Verificar URL pública funciona
6. [ ] Confirmar persistência após reload

### **SE DER ERRO:**
- Ver seção **"TROUBLESHOOTING"** acima
- Verificar Railway logs
- Copiar mensagem de erro completa

---

## 🎯 COMANDOS ÚTEIS

### **Verificar Políticas SQL:**
```sql
-- No SQL Editor do Supabase
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage';
```

**Output esperado:**
```
| schemaname | tablename | policyname              |
|------------|-----------|-------------------------|
| storage    | objects   | Public read access      |
| storage    | objects   | Service role upload     |
| storage    | objects   | Service role delete     |
```

---

### **Verificar Variáveis Railway:**
```bash
# Railway CLI (opcional)
railway variables

# Ou via Dashboard:
# Railway → Projeto → Variables → Ver lista
```

---

### **Testar Upload Manual:**
```bash
# Via curl (após políticas configuradas)
curl -X POST \
  'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/lead-photos/test.jpg' \
  -H 'Authorization: Bearer [SERVICE_ROLE_KEY]' \
  -H 'Content-Type: image/jpeg' \
  --data-binary '@/path/to/image.jpg'
```

---

## 📞 COMO RETOMAR NA PRÓXIMA SESSÃO

### **Copiar e colar este comando:**

```
Continuando implementação Supabase Storage - FlipCars

STATUS ATUAL:
✅ Código implementado (SupabaseStorageService)
✅ Variáveis Railway configuradas
✅ Bucket "lead-photos" criado
⏳ PENDENTE: Executar 3 queries SQL de políticas

AÇÃO IMEDIATA:
1. Supabase Dashboard → SQL Editor
2. Executar 3 queries (Public read, Upload, Delete)
3. Verificar deploy Railway
4. Testar upload de foto

ARQUIVO DE REFERÊNCIA:
IMPLEMENTACAO_SUPABASE_STORAGE.md

Pronto para executar queries SQL!
```

---

## 🔐 CREDENCIAIS RÁPIDAS

### **Supabase "My Truck Admin":**
```bash
URL: https://kvjvieekkudeqtnunqlb.supabase.co
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU6WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04
```

### **Admin Dashboard:**
```bash
URL: https://admin.flipcars.us
Email: admin@flipcars.com
Password: Admin123!
```

---

**CRIADO EM:** 11/11/2025  
**ÚLTIMA ATUALIZAÇÃO:** 11/11/2025  
**STATUS:** ⏳ Aguardando execução das políticas SQL  
**PRÓXIMA AÇÃO:** Executar 3 queries SQL no Supabase
