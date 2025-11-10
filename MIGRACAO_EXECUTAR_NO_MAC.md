# 🍎 MIGRAÇÃO - EXECUTAR NO SEU MAC

## ⚠️ **SITUAÇÃO**

O sandbox não consegue conectar ao Supabase PostgreSQL (restrições de rede).

**SOLUÇÃO:** Você precisa executar no seu Mac (leva 10 minutos).

---

## ✅ **SUAS CREDENCIAIS (JÁ PRONTAS)**

Todas as suas credenciais estão no arquivo:
```
credentials_complete.env
```

**⚠️ Este arquivo contém senhas! Não compartilhar!**

---

## 🚀 **GUIA SUPER RESUMIDO**

### **1. Abrir Terminal**
```
Command (⌘) + Espaço
Digite: Terminal
Enter
```

### **2. Copiar e Colar (um por vez)**

```bash
cd ~/Desktop
```
*(Enter)*

```bash
git clone https://github.com/chazmarques-blip/Flipcars-site-e-admin.git
```
*(Enter - aguardar download)*

```bash
cd Flipcars-site-e-admin/migration_backup
```
*(Enter)*

```bash
pip3 install psycopg2-binary
```
*(Enter - aguardar instalação)*

```bash
python3 migrate.py
```
*(Enter - aguardar migração)*

**Quando perguntar:** Digite `s` e Enter

### **3. Copiar URL que aparecer no final**

No final aparecerá:
```
postgresql://postgres:ugbJr2fNV2Ur4nfT@db.kvjvieekkudeqtnunqlb.supabase.co:5432/postgres
```

**Copiar essa linha toda!** (Command + C)

### **4. Atualizar Railway**

```
1. Safari → https://railway.app
2. My Truck Backend
3. Variables
4. DATABASE_URL → Edit
5. Apagar o valor antigo
6. Colar o novo (Command + V)
7. Save
8. Redeploy
```

### **5. Testar**

```
1. Admin → Login
2. Ver leads
3. PRONTO! ✅
```

---

## ⏱️ **TEMPO TOTAL: 10-15 MINUTOS**

---

## 🆘 **PROBLEMA?**

Tire print e me envie!

---

## 📋 **CHECKLIST RÁPIDO**

- [ ] Terminal aberto
- [ ] Comandos executados (um por um)
- [ ] Script rodou sem erros
- [ ] URL copiada
- [ ] Railway atualizado
- [ ] Testado e funcionando

---

**É rápido! Você consegue!** 💪
