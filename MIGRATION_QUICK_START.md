# 🚀 Guia Rápido de Migração - My Truck Admin

**⏱️ Tempo estimado:** 30-40 minutos  
**📊 Nível:** Médio (vou te guiar passo-a-passo)

---

## 📋 **O QUE VAMOS FAZER**

```
MOVER TUDO de:
  "Flipcars-site-e-admin" (us-east-1)
PARA:
  "My Truck Admin" (us-east-2)

Incluindo:
✅ Todas as tabelas
✅ Todos os dados
✅ Todas as fotos
```

---

## ⚡ **INÍCIO RÁPIDO**

### **Passo 1: Obter Connection Strings** (5 min)

Você precisa pegar as connection strings dos 2 projetos Supabase:

#### **ORIGEM (Flipcars-site-e-admin):**

```
1. Ir para: https://app.supabase.com
2. Selecionar projeto: "Flipcars-site-e-admin"
3. Menu lateral → Settings (⚙️) → Database
4. Rolar até "Connection string"
5. Clicar em "URI" ou "Direct connection"
6. Copiar a string completa
   
Exemplo:
postgresql://postgres.abc123:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

**⚠️ ATENÇÃO:** Se aparecer `[YOUR-PASSWORD]`, você precisa:
- Ir em "Database Password" (mesma página)
- Clicar em "Reset Password"
- Copiar a senha que aparecer (só aparece uma vez!)
- Substituir `[YOUR-PASSWORD]` com a senha real

#### **DESTINO (My Truck Admin):**

```
1. Ainda no Supabase
2. Selecionar projeto: "My Truck Admin"
3. Menu lateral → Settings (⚙️) → Database
4. Rolar até "Connection string"
5. Clicar em "URI" ou "Direct connection"
6. Copiar a string completa

Exemplo:
postgresql://postgres.xyz789:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres
```

**✅ VERIFICAR:**
- Connection string ORIGEM deve ter: `us-east-1`
- Connection string DESTINO deve ter: `us-east-2`
- Senhas devem estar preenchidas (sem `[YOUR-PASSWORD]`)

---

### **Passo 2: Salvar Credenciais** (2 min)

```bash
# No terminal, execute:
cd /home/user/webapp/migration_backup

# Editar arquivo de credenciais
nano credentials.env
```

**Dentro do arquivo, cole:**

```bash
# BANCO ORIGEM (Flipcars-site-e-admin)
DB_ORIGEM="postgresql://postgres.abc123:SENHA_REAL@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# BANCO DESTINO (My Truck Admin)
DB_DESTINO="postgresql://postgres.xyz789:SENHA_REAL@aws-0-us-east-2.pooler.supabase.com:5432/postgres"
```

**⚠️ Substituir:**
- `abc123` e `xyz789` pelos valores reais
- `SENHA_REAL` pelas senhas reais

**Salvar:**
- Apertar: `Ctrl + O`
- Apertar: `Enter`
- Apertar: `Ctrl + X`

---

### **Passo 3: Executar Migração Automática** (25 min)

Agora vou executar a migração completa para você!

```bash
cd /home/user/webapp/migration_backup

# Dar permissão de execução
chmod +x *.sh

# Executar preparação
bash 1-prepare.sh
```

**O script vai:**
1. ✅ Verificar conexões
2. ✅ Testar credenciais
3. ✅ Listar tabelas existentes
4. ✅ Preparar ambiente

**Se tudo der certo, você verá:** `✅ PREPARAÇÃO CONCLUÍDA!`

---

### **Passo 4: Fazer Backup** (3 min)

```bash
# Fazer backup de segurança
bash 2-backup.sh
```

**O script vai:**
- Exportar TUDO do banco ORIGEM
- Salvar em arquivo .dump
- Verificar integridade do backup

**Resultado:** Arquivo `backup_origem_completo.dump` criado

---

### **Passo 5: Parar Aplicações** (1 min)

**IMPORTANTE:** Antes de migrar, precisa parar as aplicações para evitar novos dados durante a migração.

```
1. Ir para: https://railway.app
2. Selecionar: My Truck Backend service
3. Clicar em: ... (três pontos)
4. Clicar em: "Pause Service"
5. Confirmar
```

**Downtime começa AGORA** ⏸️
(Sistema fica fora do ar até terminar migração)

---

### **Passo 6: Migrar Banco de Dados** (10 min)

```bash
# Migrar todos os dados
bash 3-migrate-database.sh
```

**O script vai:**
1. Exportar dados do ORIGEM (formato SQL)
2. Importar para DESTINO
3. Verificar contagem de registros
4. Confirmar sucesso

**Você verá:**
- `⬇️ Exportando dados do ORIGEM...`
- `⬆️ Importando para DESTINO...`
- `✅ MIGRAÇÃO DE BANCO CONCLUÍDA!`

---

### **Passo 7: Migrar Storage (Fotos)** (10 min)

**Opção A: Automático (se tiver Node.js)**

```bash
# Instalar dependências
cd /home/user/webapp/migration_backup
npm install @supabase/supabase-js

# Executar migração
bash 4-migrate-storage.sh
```

**Opção B: Manual (interface visual)**

Se o script automático não funcionar:

```
1. Ir para: https://app.supabase.com
2. Selecionar: "Flipcars-site-e-admin"
3. Menu Storage → Ver buckets
4. Para cada bucket:
   a. Selecionar todas as fotos
   b. Baixar (botão Download)
   
5. Trocar para: "My Truck Admin"
6. Menu Storage → Criar bucket (mesmo nome)
7. Fazer upload das fotos baixadas
```

---

### **Passo 8: Atualizar Railway** (3 min)

Agora precisa atualizar o Railway para usar o banco novo:

```
1. Ir para: https://railway.app
2. Selecionar: My Truck Backend service
3. Ir em: Variables
4. Encontrar: DATABASE_URL
5. Substituir com: Connection string do "My Truck Admin"
   
   (Copie a mesma string que usou em DB_DESTINO)
   
   postgresql://postgres.xyz789:SENHA@aws-0-us-east-2.pooler.supabase.com:5432/postgres
                                       ^^^^^^^^^^
                                       us-east-2 (novo banco!)

6. Salvar
7. Clicar em: "Resume Service" ou "Redeploy"
8. Aguardar deploy finalizar (ver logs)
```

**Downtime termina AQUI** ▶️
(Sistema volta a funcionar)

---

### **Passo 9: Verificar Tudo** (5 min)

```bash
# Script de verificação
bash 5-verify.sh
```

**Ou verificar manualmente:**

```
1. Abrir: admin.mytruck.com (ou seu domínio)
2. Fazer login
   ✅ Login funciona? → Banco conectado!

3. Ver lista de leads
   ✅ Leads aparecem? → Dados migrados!

4. Abrir um lead específico
   ✅ Fotos aparecem? → Storage migrado!

5. Criar novo lead
   ✅ Salva corretamente? → Tudo funcionando!
```

---

## ✅ **CHECKLIST RÁPIDO**

### Antes de começar:
- [ ] Connection strings copiadas
- [ ] Senhas obtidas
- [ ] credentials.env preenchido
- [ ] Usuários avisados sobre downtime (se necessário)

### Durante migração:
- [ ] `1-prepare.sh` executado ✅
- [ ] `2-backup.sh` executado ✅
- [ ] Aplicações pausadas no Railway
- [ ] `3-migrate-database.sh` executado ✅
- [ ] `4-migrate-storage.sh` ou upload manual ✅
- [ ] DATABASE_URL atualizado no Railway
- [ ] Aplicações religadas

### Verificação final:
- [ ] Login no admin funciona
- [ ] Leads aparecem
- [ ] Fotos aparecem
- [ ] Novo lead pode ser criado
- [ ] Backup salvo em local seguro

---

## 🆘 **PROBLEMAS COMUNS**

### "connection refused"
**Causa:** Connection string errada ou senha incorreta  
**Solução:** Verificar credentials.env, confirmar us-east-1 e us-east-2

### "permission denied"
**Causa:** Usuário sem permissões  
**Solução:** Usar connection string com permissões de admin (Direct connection)

### "script not found"
**Causa:** Não está na pasta migration_backup  
**Solução:** `cd /home/user/webapp/migration_backup`

### Scripts não executam
**Causa:** Sem permissão de execução  
**Solução:** `chmod +x *.sh`

### Fotos não aparecem
**Causa:** Storage não foi migrado ou URLs diferentes  
**Solução:** Executar migração de storage novamente

---

## 📞 **PRECISA DE AJUDA?**

Se algo der errado:

1. **NÃO ENTRE EM PÂNICO** 😊
2. Você tem backup! (backup_origem_completo.dump)
3. Me mostre:
   - Qual script estava executando
   - Mensagem de erro completa
   - Logs em `migration_backup/logs/`

---

## 🎯 **PRÓXIMO PASSO**

**→ Comece pelo Passo 1: Obter Connection Strings**

Depois que tiver as connection strings, volte aqui e continue! 🚀

**Boa sorte!** 💪
