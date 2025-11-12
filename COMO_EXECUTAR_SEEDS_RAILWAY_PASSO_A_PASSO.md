# 🌱 COMO EXECUTAR SEEDS NO RAILWAY - PASSO A PASSO

**Data:** 2025-11-12  
**Problema:** Não encontra "One-off Command" no Railway  
**Solução:** Guia visual completo

---

## 📍 ONDE ESTÁ O "ONE-OFF COMMAND"?

### MÉTODO 1: Via Menu Principal (MAIS FÁCIL)

**Passo a Passo:**

1. **No Railway Dashboard**
   - Você já está no projeto correto ✅
   - Serviço: "upbeat-dedication" ✅

2. **Procure no Menu Lateral Esquerdo**
   - Olhe para o lado ESQUERDO da tela
   - NÃO nas abas do topo (Details, Build Logs, etc.)

3. **Clique em "Settings" (⚙️)**
   - Fica na barra lateral esquerda
   - Ícone de engrenagem

4. **Role até a seção "Deploy"**
   - Está mais embaixo na página
   - Procure por: **"Custom Start Command"** ou **"One-off Command"**

---

## 🚀 MÉTODO 2: Via Railway CLI (RECOMENDADO!)

Se não encontrar One-off Command na interface, use o CLI:

### Passo 1: Instalar Railway CLI

```bash
# No seu terminal/console local:
npm install -g @railway/cli

# Ou via Homebrew (Mac):
brew install railway
```

### Passo 2: Login no Railway

```bash
railway login
```

Vai abrir navegador para autenticar.

### Passo 3: Conectar ao Projeto

```bash
# No diretório do projeto:
cd /caminho/para/Flipcars-site-e-admin

# Link com projeto Railway:
railway link
```

Selecione:
- Projeto: "inspiring-imagination"
- Serviço: "upbeat-dedication"

### Passo 4: Executar Seeds

```bash
# Executar comando no Railway:
railway run npm run seed:prod
```

OU, se estiver dentro da pasta backend:

```bash
cd backend
railway run npm run seed:prod
```

---

## 🎯 MÉTODO 3: Via Console Web do Railway

Alguns planos do Railway têm um "Shell" ou "Console" web.

### Como Encontrar:

1. **No serviço "upbeat-dedication"**
2. **Procure por uma aba chamada:**
   - "Console" ou
   - "Shell" ou
   - "Terminal"
3. **Se encontrar:**
   - Digite: `cd /app && npm run seed:prod`
   - Pressione Enter

**⚠️ Nota:** Nem todos os planos Railway têm essa funcionalidade.

---

## 💡 MÉTODO 4: Adicionar Script de Deploy

Se nenhum método acima funcionar, podemos fazer os seeds rodarem **automaticamente** no deploy.

### Como Fazer:

#### 1. Editar `package.json` do Backend

Adicione um script de "postbuild":

```json
{
  "scripts": {
    "build": "nest build",
    "postbuild": "npm run seed:prod",
    "start:prod": "NODE_OPTIONS='--dns-result-order=ipv4first' node dist/main",
    "seed:prod": "node dist/database/seeds/run-seeds.js"
  }
}
```

**⚠️ CUIDADO:** Isso vai rodar seeds TODA VEZ que fizer build! Pode duplicar dados.

#### 2. Alternativa: Script Condicional

Criar script que só roda se flag estiver presente:

**backend/run-seeds-if-needed.js:**
```javascript
const { execSync } = require('child_process');

// Só roda seeds se variável de ambiente estiver presente
if (process.env.RUN_SEEDS === 'true') {
  console.log('🌱 Running seeds...');
  execSync('npm run seed:prod', { stdio: 'inherit' });
} else {
  console.log('⏭️  Skipping seeds (RUN_SEEDS not set)');
}
```

**package.json:**
```json
{
  "scripts": {
    "postbuild": "node run-seeds-if-needed.js"
  }
}
```

**No Railway Variables:**
```bash
RUN_SEEDS=true  # Adicione quando quiser rodar seeds
```

Depois de rodar seeds uma vez, **REMOVA** a variável `RUN_SEEDS` ou mude para `false`.

---

## 🔧 MÉTODO 5: Usar Migrations ao Invés de Seeds

Outra opção é transformar seus seeds em **migrations** do TypeORM:

### Vantagens:
- ✅ TypeORM controla quais já rodaram
- ✅ Não duplica dados
- ✅ Roda automaticamente no startup

### Como Fazer:

#### 1. Criar Migration de Seeds

```bash
cd backend
npm run typeorm migration:create -- src/database/migrations/SeedInitialData
```

#### 2. Copiar Lógica dos Seeds para Migration

**src/database/migrations/1731420000000-SeedInitialData.ts:**
```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData1731420000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar admin user
    await queryRunner.query(`
      INSERT INTO users (email, password, first_name, last_name, role, is_active)
      VALUES (
        'admin@flipcars.com',
        '$2b$10$...',  -- bcrypt hash de 'Admin123!'
        'Admin',
        'FlipCars',
        'admin',
        true
      )
      ON CONFLICT (email) DO NOTHING;
    `);

    // Outros seeds...
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter seeds se necessário
    await queryRunner.query(`DELETE FROM users WHERE email = 'admin@flipcars.com'`);
  }
}
```

#### 3. Configurar para Rodar no Startup

**backend/src/main.ts:**
```typescript
import { dataSource } from './database/data-source';

async function bootstrap() {
  // Rodar migrations automaticamente
  await dataSource.runMigrations();
  
  // Resto do código...
}
```

---

## 📋 QUAL MÉTODO USAR?

| Método | Dificuldade | Recomendação |
|--------|-------------|--------------|
| **Railway CLI** | ⭐⭐ Médio | ✅ **RECOMENDADO** |
| Console Web | ⭐ Fácil | ✅ Se disponível |
| Script Postbuild | ⭐⭐⭐ Avançado | ⚠️ Cuidado com duplicação |
| Migrations | ⭐⭐⭐ Avançado | ✅ Melhor para produção |
| One-off Command (UI) | ⭐ Fácil | ❓ Nem sempre disponível |

---

## 🚀 SOLUÇÃO RÁPIDA (AGORA!)

**Se você quer rodar seeds AGORA mesmo:**

### Opção A: Railway CLI (5 minutos)

```bash
# No seu terminal local:
npm install -g @railway/cli
railway login
cd /caminho/para/seu/projeto
railway link
cd backend
railway run npm run seed:prod
```

### Opção B: Conectar Diretamente no Database

Se Railway não permitir executar comandos, você pode:

1. **Pegar credenciais do Database**
   - Railway → Settings → Variables
   - Copiar `DATABASE_URL`

2. **Conectar via psql local:**
   ```bash
   psql "postgresql://postgres.kvjvie...@db.kvjvie...supabase.co:5432/postgres?sslmode=require"
   ```

3. **Executar SQL manualmente:**
   ```sql
   -- Criar admin user
   INSERT INTO users (email, password, first_name, last_name, role, is_active)
   VALUES (
     'admin@flipcars.com',
     '$2b$10$YourBcryptHashHere',
     'Admin',
     'FlipCars',
     'admin',
     true
   );
   ```

---

## 🆘 NÃO CONSEGUE NENHUM MÉTODO?

**Me avise e eu crio:**

1. ✅ **Script SQL completo** para você copiar/colar no Supabase Dashboard
2. ✅ **Migration que roda automaticamente** no próximo deploy
3. ✅ **Endpoint temporário no backend** para rodar seeds via HTTP request

**Qual você prefere?**

---

## 📸 SCREENSHOTS ÚTEIS

### Como Deveria Ser:

**One-off Command no Railway (se disponível):**
```
Settings
  ↓
Deploy Section
  ↓
[Button] "Run Command"
  ↓
Digite: npm run seed:prod
  ↓
[Button] "Run"
```

**Ou via CLI:**
```
$ railway run npm run seed:prod

🌱 Running seeds...
✅ Created admin user
✅ Created 5 service types
✅ Seed completed successfully!
```

---

## 💡 RECOMENDAÇÃO FINAL

**Para AGORA (executar seeds uma vez):**
→ Use **Railway CLI** (Método 2)

**Para PRODUÇÃO (longo prazo):**
→ Transforme em **Migrations** (Método 5)

**Para EMERGÊNCIA (se nada funcionar):**
→ Execute **SQL manualmente** no Supabase Dashboard

---

## 🔗 LINKS ÚTEIS

- **Railway CLI Docs:** https://docs.railway.app/develop/cli
- **Railway CLI Install:** https://docs.railway.app/develop/cli#install
- **Supabase SQL Editor:** https://supabase.com/dashboard/project/kvjvieekkudeqtnunqlb/sql

---

## ✅ PRÓXIMOS PASSOS

1. **Escolha um método acima**
2. **Execute as instruções passo-a-passo**
3. **Verifique se seeds rodaram:**
   ```bash
   # Verificar se admin foi criado:
   # No Supabase SQL Editor:
   SELECT * FROM users WHERE email = 'admin@flipcars.com';
   ```
4. **Me avise o resultado!**

---

**Última atualização:** 2025-11-12  
**Dificuldade:** ⭐⭐ Médio  
**Tempo estimado:** 10-15 minutos  
**Método recomendado:** Railway CLI ou SQL manual

**Qual método você quer tentar primeiro?** 🎯
