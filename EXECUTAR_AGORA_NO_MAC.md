# 🚀 EXECUTAR AGORA NO SEU MAC

## ✅ PASSO A PASSO SIMPLES

### **1. Abrir Terminal** (se ainda não está aberto)
```
Command (⌘) + Espaço
Digite: Terminal
Enter
```

---

### **2. Copiar e Colar os Comandos** (um de cada vez)

#### **A) Ir para a área de trabalho**
```bash
cd ~/Desktop
```
*(Apertar ENTER e aguardar)*

---

#### **B) Baixar o projeto do GitHub**
```bash
git clone https://github.com/chazmarques-blip/Flipcars-site-e-admin.git
```
*(Apertar ENTER e aguardar o download)*

**Se já baixou antes**, rode este comando para atualizar:
```bash
cd Flipcars-site-e-admin && git pull && cd migration_backup
```

---

#### **C) Entrar na pasta de migração**
```bash
cd Flipcars-site-e-admin/migration_backup
```
*(Apertar ENTER)*

---

#### **D) Instalar biblioteca Python necessária**
```bash
pip3 install psycopg2-binary
```
*(Apertar ENTER e aguardar instalação - pode demorar 1-2 minutos)*

**Se der erro**, tente:
```bash
python3 -m pip install psycopg2-binary
```

---

#### **E) Executar a migração**
```bash
python3 migrate.py
```
*(Apertar ENTER)*

**Quando aparecer a pergunta:**
```
Continuar com a migração? [s/N]:
```
**Digite:** `s` e apertar ENTER

---

### **3. Aguardar a Migração**

Você verá algo assim:
```
============================================================
  🚀 MIGRAÇÃO MY TRUCK ADMIN
============================================================

Conectando ao banco ORIGEM...
✅ Conectado ao ORIGEM!
Conectando ao banco DESTINO...
✅ Conectado ao DESTINO!

FASE 1: BACKUP DE METADADOS
✅ Backup de metadados salvo: backup_metadata_20251111_123456.json

FASE 2: LISTANDO TABELAS
✅ Encontradas X tabelas:
  • users: Y registros
  • leads: Z registros
  ...

FASE 3: MIGRANDO DADOS
[1/X] Migrando: users
  ✅ users migrada com sucesso!
...

FASE 4: VERIFICANDO MIGRAÇÃO
✅ Todas as contagens conferem!

🎉 MIGRAÇÃO CONCLUÍDA
```

---

### **4. Copiar a URL do Banco DESTINO**

No final da migração, copiar esta linha:
```
postgresql://postgres:ugbJr2fNV2Ur4nfT@db.kvjvieekkudeqtnunqlb.supabase.co:5432/postgres
```

**Copiar TODA a linha** (Command + C)

---

### **5. Atualizar Railway**

1. Abrir Safari e ir para: **https://railway.app**
2. Fazer login
3. Clicar no projeto: **My Truck Backend**
4. Clicar em **Variables** (no menu lateral)
5. Encontrar **DATABASE_URL**
6. Clicar em **Edit** (ou no ícone de lápis)
7. **Apagar** o valor antigo completamente
8. **Colar** o novo valor (Command + V):
   ```
   postgresql://postgres:ugbJr2fNV2Ur4nfT@db.kvjvieekkudeqtnunqlb.supabase.co:5432/postgres
   ```
9. Clicar em **Save** (ou Update)
10. Clicar em **Deploy** → **Redeploy**

---

### **6. Aguardar Deploy**

- Aguardar 2-3 minutos
- Ver os logs do deploy
- Aguardar até aparecer "✅ Deploy successful"

---

### **7. Testar o Sistema**

1. Abrir o Admin Dashboard (URL do Railway)
2. Fazer login com suas credenciais
3. Ver se os leads aparecem
4. Ver se as fotos estão funcionando

**Se tudo estiver funcionando:** ✅ **MIGRAÇÃO COMPLETA!**

---

## 🆘 PROBLEMAS?

### **Erro: "pip3 not found" ou "python3 not found"**
Tente:
```bash
python -m pip install psycopg2-binary
python migrate.py
```

### **Erro: "connection refused" ou "Network is unreachable"**
- Verificar se está conectado à internet
- Tentar novamente em alguns minutos
- Verificar se não tem VPN ou firewall bloqueando

### **Erro: "permission denied"**
Adicionar `sudo` antes do comando de instalação:
```bash
sudo pip3 install psycopg2-binary
```
(Vai pedir sua senha do Mac)

### **Erro durante migração**
- Tire um print da tela (Command + Shift + 4)
- Me envie o print
- Vou te ajudar!

---

## ⏱️ TEMPO ESTIMADO

- **Download do projeto:** 30 segundos
- **Instalação psycopg2:** 1-2 minutos
- **Migração dos dados:** 2-5 minutos
- **Atualizar Railway:** 1 minuto
- **Deploy Railway:** 2-3 minutos

**TOTAL: 7-12 minutos** ⚡

---

## 📋 CHECKLIST

- [ ] Xcode Command Line Tools instalado (já deve estar pronto!)
- [ ] Terminal aberto
- [ ] Navegou para Desktop (`cd ~/Desktop`)
- [ ] Baixou o projeto do GitHub
- [ ] Instalou psycopg2-binary
- [ ] Executou migrate.py
- [ ] Confirmou com 's' + ENTER
- [ ] Migração completou sem erros
- [ ] Copiou URL do banco DESTINO
- [ ] Atualizou DATABASE_URL no Railway
- [ ] Fez Redeploy
- [ ] Testou Admin Dashboard
- [ ] ✅ TUDO FUNCIONANDO!

---

## 🎯 O QUE A MIGRAÇÃO VAI FAZER?

1. **Conectar** aos dois bancos Supabase
2. **Fazer backup** dos metadados (como segurança)
3. **Listar** todas as tabelas do banco ORIGEM
4. **Criar** as mesmas tabelas no banco DESTINO
5. **Copiar** todos os dados (users, leads, fotos, etc.)
6. **Verificar** se tudo foi copiado corretamente
7. **Mostrar** resumo final

---

## 📝 NOTAS IMPORTANTES

- ⚠️ **NÃO FECHAR O TERMINAL** durante a migração
- ⚠️ **NÃO DESLIGAR O MAC** durante a migração
- ✅ As credenciais já estão **configuradas no script**
- ✅ O script faz **backup automático** antes de migrar
- ✅ Você pode **rodar de novo** se algo der errado (é seguro!)

---

**Você consegue! É só seguir passo a passo.** 💪

**Qualquer dúvida, me envie print!** 📸
