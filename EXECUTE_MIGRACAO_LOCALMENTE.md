# 🚀 Executar Migração no Seu Computador

**⚠️ IMPORTANTE:** O sandbox não consegue conectar ao Supabase por restrições de rede. Você precisa executar a migração **no seu computador local**.

---

## 📋 **POR QUÊ EXECUTAR LOCALMENTE?**

```
Sandbox (onde estou):
  ├─ ❌ Não consegue conectar ao Supabase (restrições de rede IPv6)
  ├─ ❌ Network unreachable
  └─ Solução: Executar no seu computador

Seu Computador:
  ├─ ✅ Tem acesso normal à internet
  ├─ ✅ Conecta ao Supabase sem problemas
  └─ ✅ PostgreSQL pode ser instalado facilmente
```

---

## 🎯 **OPÇÕES PARA VOCÊ**

### **OPÇÃO A: Executar no Seu Windows/Mac/Linux** ⭐ **RECOMENDADO**

### **OPÇÃO B: Usar Interface do Supabase** (mais manual, mas funciona)

---

## 📋 **OPÇÃO A: EXECUTAR SCRIPT NO SEU COMPUTADOR**

### **Passo 1: Instalar PostgreSQL**

#### **Windows:**
```
1. Baixar: https://www.postgresql.org/download/windows/
2. Executar instalador
3. Durante instalação, marcar "Command Line Tools"
4. Adicionar ao PATH (normalmente automático)
5. Testar no CMD: pg_dump --version
```

#### **Mac:**
```bash
# Usando Homebrew
brew install postgresql

# Testar
pg_dump --version
```

#### **Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install postgresql-client

# Fedora/CentOS
sudo dnf install postgresql

# Testar
pg_dump --version
```

---

### **Passo 2: Baixar Scripts**

Você pode baixar os scripts que criei de 2 formas:

#### **Forma 1: Download Direto do GitHub**
```
1. Ir para: https://github.com/chazmarques-blip/Flipcars-site-e-admin
2. Navegar para: migration_backup/
3. Baixar os arquivos:
   - migrate-complete.sh (Linux/Mac)
   - migrate-complete.bat (Windows)
   - credentials.env (já tem suas credenciais)
```

#### **Forma 2: Clone do Repositório**
```bash
# No seu computador
git clone https://github.com/chazmarques-blip/Flipcars-site-e-admin.git
cd Flipcars-site-e-admin/migration_backup
```

---

### **Passo 3: Executar Migração**

#### **No Windows:**
```cmd
cd migration_backup
migrate-complete.bat
```

#### **No Mac/Linux:**
```bash
cd migration_backup
chmod +x migrate-complete.sh
./migrate-complete.sh
```

---

### **Passo 4: Acompanhar o Processo**

O script vai:

```
1. ✅ Fazer backup do banco ORIGEM
2. ✅ Listar tabelas e dados
3. ⏸️  Perguntar se quer continuar
4. ✅ Exportar todos os dados (SQL)
5. ✅ Importar no banco DESTINO
6. ✅ Verificar integridade
7. ✅ Mostrar resumo
```

**Tempo estimado:** 10-15 minutos

---

### **Passo 5: Atualizar Railway**

Depois que a migração terminar com sucesso:

```
1. Ir para: https://railway.app
2. Selecionar: My Truck Backend service
3. Ir em: Variables
4. Encontrar: DATABASE_URL
5. Substituir com:
   postgresql://postgres:ugbJr2fNV2Ur4nfT@db.kvjvieekkudeqtnunqlb.supabase.co:5432/postgres
   
6. Clicar em: Redeploy
7. Aguardar deploy finalizar
8. Verificar logs: "Database connected successfully"
```

---

### **Passo 6: Testar**

```
1. Abrir: admin.mytruck.com (ou seu domínio)
2. Fazer login
3. Ver lista de leads
4. Abrir um lead
5. Verificar se fotos aparecem
6. Criar novo lead de teste

✅ Tudo funcionando = SUCESSO!
```

---

## 📋 **OPÇÃO B: USAR INTERFACE DO SUPABASE** (Manual)

Se você não conseguir instalar PostgreSQL, pode fazer manualmente:

### **Parte 1: Exportar Dados**

```
1. Ir para: https://app.supabase.com
2. Selecionar: "Flipcars-site-e-admin"
3. Ir em: SQL Editor (menu lateral)
4. Clicar em: "New query"
5. Executar este SQL para cada tabela:

   COPY (SELECT * FROM nome_da_tabela) TO STDOUT WITH CSV HEADER;
   
6. Copiar resultado e salvar em arquivo .csv
7. Repetir para todas as tabelas
```

### **Parte 2: Importar Dados**

```
1. Ainda no Supabase
2. Selecionar: "My Truck Admin"
3. Ir em: Table Editor
4. Para cada tabela:
   a. Criar tabela (se não existir)
   b. Clicar em "Insert" → "Import CSV"
   c. Fazer upload do CSV salvo
```

**Desvantagem:** Muito manual e demorado. Recomendo OPÇÃO A.

---

## 🆘 **PROBLEMAS COMUNS**

### **"pg_dump: command not found"**
**Causa:** PostgreSQL não instalado  
**Solução:** Instalar PostgreSQL (Passo 1)

### **"connection refused"**
**Causa:** Firewall bloqueando porta 5432  
**Solução:** Verificar firewall ou usar VPN

### **"FATAL: password authentication failed"**
**Causa:** Senha incorreta  
**Solução:** Resetar senha no Supabase e atualizar credentials.env

### **"Network is unreachable"**
**Causa:** Problema de rede ou DNS  
**Solução:** Testar conexão internet, tentar rede diferente

---

## 📞 **PRECISA DE AJUDA?**

Se você:
- ❌ Não consegue instalar PostgreSQL
- ❌ Não tem permissão de admin no computador
- ❌ Firewall corporativo bloqueia Supabase
- ❌ Prefere que eu faça de outra forma

**Me avise!** Posso:
1. Criar script Python (não precisa PostgreSQL)
2. Usar API do Supabase (via JavaScript)
3. Guiar você pela interface manual

---

## 🎯 **RESUMO RÁPIDO**

```
1. Instalar PostgreSQL no seu computador
2. Baixar scripts do GitHub
3. Executar: migrate-complete.sh (ou .bat)
4. Aguardar conclusão (~15 min)
5. Atualizar DATABASE_URL no Railway
6. Testar aplicação

Total: ~30 minutos
```

---

## ✅ **CREDENCIAIS JÁ ESTÃO NOS SCRIPTS!**

Não precisa copiar/colar novamente. Os scripts já têm:

```bash
DB_ORIGEM="postgresql://postgres:mlHq1TyD7VmrNXNG@db.yjeajrbgvqilukekkkbh.supabase.co:5432/postgres"
DB_DESTINO="postgresql://postgres:ugbJr2fNV2Ur4nfT@db.kvjvieekkudeqtnunqlb.supabase.co:5432/postgres"
```

**⚠️ ATENÇÃO:** Depois da migração, delete o arquivo credentials.env ou adicione ao .gitignore!

---

## 📝 **CHECKLIST**

Antes de executar:
- [ ] PostgreSQL instalado
- [ ] Scripts baixados do GitHub
- [ ] Terminal/CMD aberto na pasta migration_backup
- [ ] Conexão internet funcionando

Durante execução:
- [ ] Script iniciou sem erros
- [ ] Backup criado
- [ ] Dados exportados
- [ ] Dados importados
- [ ] Sem erros críticos no log

Depois da migração:
- [ ] DATABASE_URL atualizado no Railway
- [ ] Aplicação religada
- [ ] Login funciona
- [ ] Leads aparecem
- [ ] Tudo testado

---

**Boa sorte com a migração!** 🚀

**Qualquer problema, me avise!** 😊
