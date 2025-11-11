# 🔐 RECUPERAR EMAIL GODADDY - Passo a Passo

## 🎯 OBJETIVO
Recuperar acesso aos emails históricos na GoDaddy e fazer email voltar a funcionar SEM PERDER NADA.

---

## 📋 ETAPA 1: IDENTIFICAR SUA CONTA GODADDY

### Opção A: Você tem acesso à conta GoDaddy principal
**Se você consegue fazer login em https://www.godaddy.com**

1. Acesse: https://www.godaddy.com/signin
2. Faça login com seu email/senha
3. Vá em: **Meus Produtos** → **Hospedagem Web**
4. Procure por: **flipcars.us**
5. Clique em: **Gerenciar** ou **Manage**

**✅ Conseguiu entrar?**
- SIM: Pule para ETAPA 2
- NÃO: Continue para Opção B

---

### Opção B: Não consegue fazer login na GoDaddy
**Se esqueceu senha ou não tem acesso**

#### B1. Recuperar senha da conta GoDaddy
1. Acesse: https://www.godaddy.com/signin
2. Clique em: **Esqueceu senha? / Forgot Password?**
3. Digite o email que você usou para criar conta GoDaddy
4. Siga instruções do email de recuperação
5. Redefina sua senha

**Possíveis emails que você pode ter usado:**
- Seu email pessoal (Gmail, Hotmail, etc)
- info@flipcars.us (se criou antes)
- auto@flipcars.us
- Outro email corporativo

**💡 DICA**: Procure em seu email pessoal por mensagens antigas da GoDaddy com assunto "Welcome" ou "Bem-vindo" para identificar qual email usou.

---

#### B2. Se não sabe qual email usou na GoDaddy
**Contate suporte GoDaddy:**

📞 **Telefone GoDaddy Brasil**: 
- 0800-580-3838 (Gratuito)
- Horário: Seg-Sex 9h-18h

💬 **Chat ao vivo** (24/7):
1. Acesse: https://www.godaddy.com/contact-us
2. Clique em: **Chat com Suporte**
3. Diga: "Tenho domínio flipcars.us mas perdi acesso à conta"

**Informações que vão pedir:**
- Nome completo do titular da conta
- CPF/CNPJ usado no cadastro
- Últimos 4 dígitos do cartão de crédito usado
- Email alternativo para contato

**Resultado esperado**: Eles vão ajudar a recuperar acesso ou redefinir senha.

---

## 📋 ETAPA 2: ACESSAR CPANEL E VERIFICAR EMAILS

**Uma vez dentro da conta GoDaddy:**

### Passo 1: Abrir cPanel
1. Em **Meus Produtos** → **Hospedagem Web**
2. Ao lado de flipcars.us, clique em: **Gerenciar**
3. Role até: **Configurações** ou **Settings**
4. Clique em: **Admin do cPanel** ou **cPanel Admin**

**URL alternativa direta:**
```
https://flipcars.us:2083
```
(Use as mesmas credenciais da hospedagem GoDaddy)

---

### Passo 2: Verificar Contas de Email Existentes
1. Dentro do cPanel, procure seção: **EMAIL**
2. Clique em: **Contas de Email** ou **Email Accounts**
3. Você verá lista de emails já criados

**📸 IMPORTANTE**: Tire screenshot desta tela e me envie!

**O que procurar:**
- ✅ Existe `auto@flipcars.us`?
- ✅ Existe `info@flipcars.us`?
- ✅ Existem outros emails?
- ✅ Qual o espaço usado? (ex: 250 MB / 500 MB)

---

### Passo 3: Anotar Informações do Servidor
1. Ainda no cPanel, procure: **Servidor de Email** ou **Mail Server**
2. Ou acesse: **Conta de Email** → Clique no email → **Conectar Dispositivos**
3. Anote estas informações:

```
SERVIDOR DE ENTRADA (IMAP):
Host/Servidor: _____________________
Porta: _____________________
Segurança: SSL ou TLS

SERVIDOR DE SAÍDA (SMTP):
Host/Servidor: _____________________
Porta: _____________________
Segurança: SSL ou TLS
```

**💡 Valores comuns GoDaddy:**
- Servidor: `mail.flipcars.us` OU `mail.secureserver.net`
- IMAP: Porta 993 (SSL)
- SMTP: Porta 465 (SSL) ou 587 (TLS)

---

### Passo 4: Verificar IP do Servidor de Email
1. No cPanel, lado direito, procure: **Informações do Servidor** ou **Server Information**
2. Ou vá em: **Configurações** → **Informações Gerais**
3. Anote o **Endereço IP do Servidor**

```
IP do Servidor: _____________________
```

**CRÍTICO**: Compare este IP com o que está no DNS (216.198.79.1)

---

## 📋 ETAPA 3: FAZER BACKUP DOS EMAILS ANTES DE QUALQUER MUDANÇA

### ⚠️ IMPORTANTE: Faça isso ANTES de mudar DNS!

**Opção 1: Backup via Webmail (Recomendado para poucos emails)**

1. Acesse: https://webmail.flipcars.us
2. Ou pelo cPanel: **Email** → **Webmail** → Escolha **Roundcube**
3. Faça login com: `auto@flipcars.us` ou outro email
4. Selecione todos os emails: **Ctrl+A** ou checkbox "Selecionar Tudo"
5. Clique em: **Mais** → **Baixar** ou **Download**
6. Salve arquivo `.eml` ou `.mbox` no seu computador

**Repita para cada conta de email.**

---

**Opção 2: Backup via cPanel (Recomendado para muitos emails)**

1. No cPanel, procure: **Arquivos** ou **Files**
2. Clique em: **Backup** ou **Backup Wizard**
3. Escolha: **Backup Completo** ou **Full Backup**
4. Marque: ✅ **Contas de Email**
5. Clique em: **Gerar Backup** ou **Generate Backup**
6. Aguarde conclusão (pode demorar 5-30 minutos)
7. Baixe o arquivo de backup (formato: `backup-flipcars-YYYY-MM-DD.tar.gz`)
8. Salve em local seguro (HD externo, Google Drive, etc)

---

**Opção 3: Backup via Cliente de Email (Thunderbird)**

**Se tiver muitos emails (1000+), esta é a melhor opção:**

1. **Baixe Thunderbird**: https://www.thunderbird.net
2. **Instale e abra**
3. **Configure conta IMAP:**
   - Email: `auto@flipcars.us`
   - Senha: `Flip@2030*` (ou a senha correta)
   - Servidor: `mail.flipcars.us` (ou o que anotou)
   - Porta IMAP: 993 (SSL)
4. **Aguarde sincronização** (pode levar horas se tiver 1000+ emails)
5. **Backup automático**: Thunderbird salva emails localmente em:
   - Windows: `C:\Users\[usuario]\AppData\Roaming\Thunderbird\Profiles\`
   - Mac: `~/Library/Thunderbird/Profiles/`
   - Linux: `~/.thunderbird/`
6. **Copie toda a pasta** `Profiles` para backup externo

**✅ VANTAGEM**: Mesmo que servidor seja apagado, você terá cópia local completa.

---

## 📋 ETAPA 4: CORRIGIR DNS PARA EMAIL FUNCIONAR

**Somente execute DEPOIS de ter backup completo!**

### Verificar IP Correto do Servidor

Compare os IPs:
- IP anotado do cPanel: `____________`
- IP atual no DNS (GoDaddy): `216.198.79.1`

**São IGUAIS?**
- ✅ SIM: DNS está correto, problema é outro (pule para Etapa 5)
- ❌ NÃO: Precisa atualizar DNS (continue abaixo)

---

### Atualizar Registros DNS no GoDaddy

1. Acesse: https://dcc.godaddy.com/control/portfolio
2. Clique no domínio: **flipcars.us**
3. Role até: **Configurações Adicionais** → **Gerenciar DNS**
4. Localize estes 2 registros **A**:

**Registro 1:**
```
Tipo: A
Nome: mail
Valor: 216.198.79.1 ← ALTERAR para IP correto do cPanel
TTL: 1 hora
```

**Registro 2:**
```
Tipo: A
Nome: webmail
Valor: 216.198.79.1 ← ALTERAR para IP correto do cPanel
TTL: 1 hora
```

5. Clique no **lápis de edição** ao lado de cada registro
6. Altere o campo **"Aponta para"** / **"Points to"** para o IP correto
7. Clique em: **Salvar**

---

### Verificar Registro MX

No mesmo painel DNS, verifique:

```
Tipo: MX
Nome: @ (ou deixe em branco)
Valor: mail.flipcars.us
Prioridade: 0 ou 10
TTL: 1 hora
```

**✅ Está correto assim?**
- SIM: Mantenha como está
- NÃO: Edite para ficar assim

---

### Verificar Registro SPF (Opcional mas recomendado)

```
Tipo: TXT
Nome: @ (ou deixe em branco)
Valor: v=spf1 a mx ip4:[IP_CORRETO_DO_CPANEL] ~all
TTL: 1 hora
```

Exemplo:
```
v=spf1 a mx ip4:192.0.2.123 ~all
```

(Substitua `192.0.2.123` pelo IP real do seu cPanel)

---

## 📋 ETAPA 5: TESTAR EMAIL FUNCIONANDO

**Aguarde 1-2 horas após alterar DNS** (propagação)

### Teste 1: Acessar Webmail
```
URL: https://webmail.flipcars.us
Email: auto@flipcars.us
Senha: Flip@2030*
```

**✅ Conseguiu entrar?**
- SIM: Email funcionando! Veja emails históricos preservados
- NÃO: Vá para Troubleshooting abaixo

---

### Teste 2: Enviar Email de Teste
1. Dentro do webmail, clique em: **Escrever** ou **Compose**
2. Para: seu email pessoal (Gmail, etc)
3. Assunto: `Teste FlipCars Email`
4. Mensagem: `Email corporativo funcionando!`
5. Clique em: **Enviar**

**✅ Recebeu email no Gmail?**
- SIM: SMTP funcionando!
- NÃO: Verifique configurações SMTP

---

### Teste 3: Receber Email
1. Do seu Gmail pessoal, envie email para: `auto@flipcars.us`
2. Aguarde 1-2 minutos
3. Recarregue webmail: **F5** ou botão refresh
4. Verifique se email chegou na caixa de entrada

**✅ Email chegou?**
- SIM: IMAP/Recebimento funcionando!
- NÃO: Verifique DNS MX

---

## 🆘 TROUBLESHOOTING

### Problema 1: Não consigo fazer login no cPanel
**Erro:** "Login inválido" ou "Acesso negado"

**Solução:**
1. Volte para GoDaddy → Hospedagem Web → Gerenciar
2. Procure: **Redefinir senha do cPanel**
3. Crie nova senha e tente novamente
4. Ou use botão: **Login automático no cPanel**

---

### Problema 2: Webmail não carrega após alterar DNS
**Erro:** "Não foi possível conectar" ou "Connection refused"

**Solução:**
1. Aguarde 2-4 horas (propagação DNS pode demorar)
2. Teste com: https://flipcars.us:2083 (acesso direto cPanel)
3. Ou com: http://[IP_DO_SERVIDOR]:2096 (webmail via IP)
4. Limpe cache do navegador: Ctrl+Shift+Delete

---

### Problema 3: Emails históricos sumiram
**Sintoma:** Webmail abre mas caixa de entrada está vazia

**Solução:**
1. ✅ Você tem backup? Use Opção 2 ou 3 da Etapa 3
2. No webmail, verifique: **Configurações** → **Pastas**
3. Verifique se emails estão em: **Lixeira**, **Spam**, ou **Arquivo**
4. Se fez backup via Thunderbird:
   - Abra Thunderbird
   - Arquivo → Importar → Perfil Completo
   - Selecione pasta do backup
   - Emails serão restaurados

---

### Problema 4: IP do servidor mudou e não sei o novo
**Sintoma:** DNS aponta para 216.198.79.1 mas servidor não responde

**Solução:**
1. Contate suporte GoDaddy: 0800-580-3838
2. Diga: "Preciso saber o IP atual do servidor de hospedagem de flipcars.us"
3. Eles vão fornecer o IP correto
4. Atualize DNS conforme Etapa 4

---

## ✅ CHECKLIST FINAL

Após concluir todas etapas, verifique:

- [ ] Consegui fazer login na conta GoDaddy
- [ ] Acessei cPanel do flipcars.us
- [ ] Verifiquei que emails existem (auto@flipcars.us)
- [ ] Anotei IP correto do servidor
- [ ] Fiz backup completo dos emails (Opção 2 ou 3)
- [ ] Atualizei DNS A records (mail e webmail) com IP correto
- [ ] Verifiquei DNS MX record (mail.flipcars.us)
- [ ] Aguardei 1-2h para propagação DNS
- [ ] Testei login no webmail.flipcars.us
- [ ] Testei envio de email
- [ ] Testei recebimento de email
- [ ] Emails históricos estão visíveis (1000+ emails)

---

## 📞 AJUDA ADICIONAL

**Se travou em alguma etapa:**

1. **Tire screenshots** da tela onde travou
2. **Anote a mensagem de erro** completa
3. **Me envie** para eu ajustar o plano

**Informações úteis para me enviar:**
- Em qual etapa travou? (1, 2, 3, 4 ou 5)
- Conseguiu fazer login na GoDaddy? (SIM/NÃO)
- Conseguiu acessar cPanel? (SIM/NÃO)
- Qual o IP do servidor que encontrou? (___.___.___.___)
- Screenshot da tela de contas de email no cPanel
- Screenshot do erro (se houver)

---

## 🎯 RESULTADO ESPERADO

Após concluir este guia:

✅ Email `auto@flipcars.us` funcionando  
✅ Webmail acessível em https://webmail.flipcars.us  
✅ Todos os 1000+ emails históricos preservados  
✅ Pode enviar e receber emails normalmente  
✅ Backup seguro salvo em local externo  
✅ Pronto para criar `info@flipcars.us` (próximo passo)  

---

**Tempo estimado total:** 1-3 horas (depende da velocidade do backup)

**Dificuldade:** Média (siga passo a passo com calma)

**Risco de perda de dados:** ZERO (se fizer backup na Etapa 3)

---

**Data de criação:** 2025-11-11  
**Última atualização:** 2025-11-11  
**Status:** Aguardando execução do usuário
