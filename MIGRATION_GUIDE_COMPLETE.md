# 🔄 Guia Completo de Migração - My Truck Data
## Mover Dados de "Flipcars-site-e-admin" para "My Truck Admin"

**Data:** 2024-11-10  
**Tempo Estimado:** 40 minutos  
**Dificuldade:** ⭐⭐ Médio  

---

## 📋 **RESUMO DA MIGRAÇÃO**

### Situação Atual:
```
"Flipcars-site-e-admin" (us-east-1)
├─ ✅ Contém: Todos os dados do My Truck
├─ ✅ Contém: Fotos no Supabase Storage
└─ ✅ Poucos dados (ambiente de teste)

"My Truck Admin" (us-east-2)
└─ ❌ VAZIO (nenhum dado)
```

### Objetivo:
```
Mover TUDO (dados + fotos) de:
  "Flipcars-site-e-admin"
Para:
  "My Truck Admin"
```

---

## ⚠️ **IMPORTANTE: LEIA ANTES DE COMEÇAR**

### ✅ Pré-requisitos:
- [x] PostgreSQL instalado ✅ (já verificado)
- [ ] Acesso ao Supabase (ambos os projetos)
- [ ] Acesso ao Railway/Vercel (para atualizar variáveis)
- [ ] Backup será feito durante o processo

### 🚨 Durante a Migração:
- **Aplicações devem estar PARADAS** (para evitar novos dados)
- **Vai ter downtime** (tempo que o sistema fica fora do ar)
- **Estimativa de downtime:** 30-40 minutos
- **Usuários não poderão usar o sistema** durante este período

### 📊 O Que Significa "Downtime":
```
Downtime = Tempo que o sistema fica inacessível

Durante a migração:
├─ ❌ Site My Truck não vai carregar (ou vai dar erro)
├─ ❌ Admin não vai funcionar
├─ ❌ Usuários não conseguem criar leads
└─ ⏳ Sistema volta ao normal após migração completa

É aceitável?
└─ ✅ SIM, se você está em teste
└─ ⚠️ Precisa avisar usuários se está em produção
```

---

## 📋 **FASE 1: PREPARAÇÃO (5 min)**

### Passo 1.1: Criar Pasta para Backups

```bash
cd /home/user/webapp
mkdir -p migration_backup
cd migration_backup
```

### Passo 1.2: Obter Connection Strings

Você precisa pegar as connection strings de ambos os projetos Supabase:

#### **ORIGEM (Flipcars-site-e-admin):**
```
1. Ir para: https://app.supabase.com
2. Selecionar: "Flipcars-site-e-admin" (us-east-1)
3. Ir em: Settings → Database
4. Copiar: Connection String → Direct connection
   
   Format: postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

#### **DESTINO (My Truck Admin):**
```
1. Ainda no Supabase
2. Selecionar: "My Truck Admin" (us-east-2)
3. Ir em: Settings → Database
4. Copiar: Connection String → Direct connection
   
   Format: postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres
```

**⚠️ IMPORTANTE:**
- Substituir `[PASSWORD]` com senha real
- Se não lembra senha, resetar em: Settings → Database → Reset Password

### Passo 1.3: Salvar Connection Strings

Vou criar um arquivo temporário para você salvar as connection strings:

```bash
# VOCÊ VAI COLAR SUAS CONNECTION STRINGS AQUI
# (eu vou criar o arquivo modelo)
```

---

## 📋 **FASE 2: BACKUP DE SEGURANÇA (5 min)**

Antes de fazer qualquer coisa, vamos fazer backup completo do banco ORIGEM:

### Passo 2.1: Backup do Banco de Dados Origem

```bash
# Você vai executar este comando (com sua connection string):
pg_dump "postgresql://postgres.xxx:SENHA@aws-0-us-east-1.pooler.supabase.com:5432/postgres" \
  --format=custom \
  --file=backup_origem_completo.dump \
  --verbose

# Formato "custom" permite restauração seletiva se necessário
# --verbose mostra o progresso
```

**O que este comando faz:**
- Exporta TODO o banco de dados (tabelas, dados, sequences, etc.)
- Salva em formato binário compactado (menor e mais rápido)
- Permite restaurar tudo se algo der errado

**Tempo estimado:** 1-2 minutos (poucos dados)

### Passo 2.2: Verificar Backup

```bash
# Verificar tamanho do backup
ls -lh backup_origem_completo.dump

# Listar conteúdo do backup (para ver o que foi exportado)
pg_restore --list backup_origem_completo.dump | head -20
```

**Resultado esperado:**
- Arquivo .dump criado
- Tamanho: alguns KB a MB (depende dos dados)
- Lista mostra: tabelas, sequences, constraints

---

## 📋 **FASE 3: PARAR APLICAÇÕES (2 min)**

**Por quê parar?**
- Se alguém criar lead durante migração, vai para banco ORIGEM
- Depois da migração, esse dado novo não estará no banco DESTINO
- Resultado: perda de dados

### Passo 3.1: Parar Backend (Railway)

```
1. Ir para: https://railway.app
2. Selecionar: My Truck Backend service
3. Clicar em: "..." (três pontos) → "Pause Service"
4. Confirmar
```

### Passo 3.2: Desativar Frontend (Opcional)

**Opção A: Manter no ar com mensagem de manutenção**
- Frontend fica acessível
- Mas não consegue salvar dados (backend parado)
- Usuários veem erros

**Opção B: Colocar em manutenção**
- Criar página de manutenção
- Redirecionar usuários
- Mais profissional

**Recomendo:** Deixar como está (backend parado já impede novos dados)

---

## 📋 **FASE 4: MIGRAÇÃO DO BANCO DE DADOS (10 min)**

### Passo 4.1: Exportar do Banco Origem

```bash
# Exportar banco completo em formato SQL plain text
pg_dump "postgresql://postgres.xxx:SENHA@aws-0-us-east-1.pooler.supabase.com:5432/postgres" \
  --format=plain \
  --no-owner \
  --no-acl \
  --file=migration_data.sql \
  --verbose \
  --schema=public

# Opções explicadas:
# --format=plain : SQL puro (fácil de ler e editar se necessário)
# --no-owner : Não inclui comandos de ownership (evita erros de permissão)
# --no-acl : Não inclui ACLs (permissions)
# --schema=public : Apenas schema público (ignora auth, storage internos do Supabase)
```

**O que será exportado:**
- ✅ Estrutura das tabelas (CREATE TABLE)
- ✅ Dados (INSERT)
- ✅ Constraints (PRIMARY KEY, FOREIGN KEY)
- ✅ Indexes
- ✅ Sequences (auto-increment)

**Tempo estimado:** 1-2 minutos

### Passo 4.2: Verificar Arquivo SQL

```bash
# Ver primeiras linhas do arquivo
head -50 migration_data.sql

# Ver tamanho do arquivo
ls -lh migration_data.sql

# Contar quantas INSERT statements (dados)
grep -c "INSERT INTO" migration_data.sql

# Verificar quais tabelas foram exportadas
grep "CREATE TABLE" migration_data.sql
```

**Resultado esperado:**
- Arquivo .sql criado
- Tamanho: alguns KB a MB
- Várias tabelas listadas (leads, users, etc.)

### Passo 4.3: Importar no Banco Destino

```bash
# Importar tudo para o banco vazio
psql "postgresql://postgres.xxx:SENHA@aws-0-us-east-2.pooler.supabase.com:5432/postgres" \
  --file=migration_data.sql \
  --echo-errors \
  --quiet \
  2> import_errors.log

# Opções explicadas:
# --file : Arquivo SQL para importar
# --echo-errors : Mostra erros se houver
# --quiet : Não mostra cada comando (mais limpo)
# 2> import_errors.log : Salva erros em arquivo
```

**O que acontece:**
- Cria todas as tabelas no banco DESTINO
- Insere todos os dados
- Cria indexes e constraints

**Tempo estimado:** 2-5 minutos

### Passo 4.4: Verificar Erros

```bash
# Ver se houve erros
cat import_errors.log

# Se arquivo vazio ou só warnings = OK
# Se tiver "ERROR" = problema (me avise)
```

### Passo 4.5: Verificar Dados Migrados

```bash
# Conectar ao banco DESTINO e verificar
psql "postgresql://postgres.xxx:SENHA@aws-0-us-east-2.pooler.supabase.com:5432/postgres" << 'EOF'

-- Listar todas as tabelas
\dt public.*

-- Contar registros em cada tabela importante
SELECT 'leads' as table_name, COUNT(*) as count FROM leads
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'admin_users', COUNT(*) FROM admin_users;

-- Sair
\q
EOF
```

**Resultado esperado:**
- Lista de tabelas criadas
- Contagem de registros (deve ser > 0 se tinha dados)

---

## 📋 **FASE 5: MIGRAÇÃO DE ARQUIVOS DO STORAGE (15 min)**

**IMPORTANTE:** Supabase Storage precisa ser migrado separadamente.

### Passo 5.1: Verificar Buckets no Origem

```
1. Ir para: https://app.supabase.com
2. Selecionar: "Flipcars-site-e-admin"
3. Ir em: Storage (menu lateral)
4. Ver quais buckets existem
5. Anotar nomes dos buckets
```

**Buckets comuns:**
- `lead-photos` (fotos dos leads)
- `avatars` (fotos de perfil)
- `documents` (documentos)

### Passo 5.2: Criar Mesmo Buckets no Destino

```
1. Ainda no Supabase
2. Selecionar: "My Truck Admin"
3. Ir em: Storage
4. Para cada bucket do ORIGEM:
   a. Clicar em "New bucket"
   b. Nome: mesmo nome do ORIGEM
   c. Public: marcar se o ORIGEM é público
   d. File size limit: mesmo valor do ORIGEM
   e. Create bucket
```

### Passo 5.3: Opções para Migrar Arquivos

#### **OPÇÃO A: Via Supabase CLI (Recomendado - Rápido)**

**Instalar Supabase CLI:**
```bash
npm install -g supabase
```

**Fazer login:**
```bash
supabase login
```

**Migrar arquivos:**
```bash
# Você vai precisar fazer isso manualmente ou com script
# Vou criar um script Node.js para você
```

#### **OPÇÃO B: Download/Upload Manual (Mais Simples)**

**Se forem poucas fotos:**

```
1. No Supabase "Flipcars-site-e-admin" → Storage → bucket
2. Selecionar arquivos
3. Clicar em "Download"
4. Salvar no computador

5. No Supabase "My Truck Admin" → Storage → bucket
6. Clicar em "Upload"
7. Selecionar arquivos salvos
8. Upload
```

#### **OPÇÃO C: Script Automatizado (Vou Criar Para Você)**

Vou criar um script Node.js que:
- Conecta nos 2 projetos Supabase
- Baixa arquivos do ORIGEM
- Faz upload no DESTINO
- Atualiza URLs no banco se necessário

**Você vai precisar:**
- SUPABASE_URL_ORIGEM
- SUPABASE_SERVICE_KEY_ORIGEM
- SUPABASE_URL_DESTINO
- SUPABASE_SERVICE_KEY_DESTINO

---

## 📋 **FASE 6: ATUALIZAR CONFIGURAÇÕES (5 min)**

### Passo 6.1: Atualizar Railway DATABASE_URL

```
1. Ir para: https://railway.app
2. Selecionar: My Truck Backend service
3. Ir em: Variables
4. Encontrar: DATABASE_URL
5. Substituir com: Connection string do "My Truck Admin" (us-east-2)
6. Salvar
```

**Novo valor:**
```
postgresql://postgres.xxx:SENHA@aws-0-us-east-2.pooler.supabase.com:5432/postgres
                                  ^^^^^^^^^^
                                  us-east-2 = My Truck Admin
```

### Passo 6.2: Atualizar Supabase Credentials (Se Usar Storage)

```
Se você vai usar Supabase Storage:

1. Ainda no Railway Variables
2. Adicionar/Atualizar:
   SUPABASE_URL = (URL do "My Truck Admin")
   SUPABASE_SERVICE_KEY = (service_role key do "My Truck Admin")
```

### Passo 6.3: Religar Backend

```
1. No Railway
2. Clicar em "Resume Service" ou "Redeploy"
3. Aguardar deploy finalizar
4. Ver logs para confirmar conexão com banco
```

**Logs esperados:**
```
[Nest] LOG [TypeOrmModule] Database connected successfully
[Nest] LOG [NestApplication] Application started
```

---

## 📋 **FASE 7: VERIFICAÇÃO E TESTES (5 min)**

### Passo 7.1: Teste de Conexão do Banco

```bash
# Conectar ao novo banco e verificar
psql "postgresql://postgres.xxx:SENHA@aws-0-us-east-2.pooler.supabase.com:5432/postgres" << 'EOF'

-- Ver se tem dados
SELECT COUNT(*) as total_leads FROM leads;
SELECT COUNT(*) as total_users FROM users;

-- Ver um lead de exemplo
SELECT * FROM leads LIMIT 1;

\q
EOF
```

### Passo 7.2: Teste no Admin Dashboard

```
1. Abrir: admin.mytruck.com (ou seu domínio)
2. Fazer login
3. ✅ Login funciona? → Banco conectado!
4. Ver lista de leads
5. ✅ Leads aparecem? → Dados migrados!
6. Abrir um lead
7. ✅ Fotos aparecem? → Storage migrado!
```

### Passo 7.3: Teste de Criação de Novo Lead

```
1. Criar novo lead no site
2. Fazer upload de foto
3. Verificar se aparece no admin
4. ✅ Tudo funciona? → MIGRAÇÃO COMPLETA!
```

---

## 📋 **FASE 8: LIMPEZA (Opcional)**

### Depois que confirmar que TUDO está funcionando:

1. **Manter backups por segurança:**
   ```bash
   # Mover backups para lugar seguro
   mkdir -p /home/user/webapp/backups/2024-11-10
   mv migration_backup/* /home/user/webapp/backups/2024-11-10/
   ```

2. **Arquivar banco ORIGEM (Flipcars-site-e-admin):**
   - Não deletar ainda
   - Manter por 1-2 semanas como segurança
   - Depois pode limpar

3. **Atualizar documentação:**
   - Anotar que migração foi feita
   - Data da migração
   - Localização dos backups

---

## ✅ **CHECKLIST COMPLETO**

### Preparação:
- [ ] PostgreSQL instalado ✅
- [ ] Connection strings obtidas
- [ ] Pasta de backup criada
- [ ] Usuários avisados sobre downtime (se necessário)

### Backup:
- [ ] Backup completo do banco ORIGEM
- [ ] Backup verificado (arquivo .dump criado)

### Migração de Dados:
- [ ] Aplicações pausadas
- [ ] Dados exportados (migration_data.sql)
- [ ] Dados importados no DESTINO
- [ ] Erros verificados (nenhum ERROR crítico)
- [ ] Contagem de registros confirmada

### Migração de Storage:
- [ ] Buckets listados no ORIGEM
- [ ] Buckets criados no DESTINO
- [ ] Arquivos migrados
- [ ] URLs atualizadas (se necessário)

### Reconfiguração:
- [ ] DATABASE_URL atualizado no Railway
- [ ] SUPABASE_URL atualizado (se usar)
- [ ] SUPABASE_SERVICE_KEY atualizado (se usar)
- [ ] Backend religado

### Verificação:
- [ ] Conexão com banco OK
- [ ] Admin login OK
- [ ] Leads aparecem OK
- [ ] Fotos aparecem OK
- [ ] Criação de novo lead OK

### Limpeza:
- [ ] Backups salvos em local seguro
- [ ] Documentação atualizada
- [ ] Banco ORIGEM mantido por segurança

---

## 🆘 **TROUBLESHOOTING**

### Erro: "connection refused"
**Causa:** Connection string incorreta ou senha errada  
**Solução:** Verificar connection string e senha

### Erro: "permission denied"
**Causa:** Usando connection string sem permissões suficientes  
**Solução:** Usar connection string com permissões de admin

### Erro: "relation already exists"
**Causa:** Tabela já existe no DESTINO  
**Solução:** Banco DESTINO não estava vazio (verificar)

### Erro: "foreign key constraint"
**Causa:** Tentando inserir dados em ordem errada  
**Solução:** pg_dump já resolve isso, mas se ocorrer, importar novamente

### Fotos não aparecem após migração:
**Causa:** URLs no banco ainda apontam para Storage ORIGEM  
**Solução:** Atualizar URLs ou usar mesmo nome de bucket

---

## 📞 **PRÓXIMOS PASSOS**

Agora vou criar:
1. ✅ Script para salvar connection strings de forma segura
2. ✅ Script Node.js para migrar arquivos do Storage automaticamente
3. ✅ Comandos prontos para você executar (só copiar/colar)

**Aguarde... criando scripts!**
