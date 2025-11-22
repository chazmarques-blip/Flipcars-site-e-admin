# Como Visualizar e Testar a Funcionalidade de Delete

## 🌐 Acessar o Admin Dashboard

### Passo 1: Abrir o Admin Dashboard
```
URL: https://flipcars-site-e-admin-production.up.railway.app/dashboard/leads
```

Ou a URL do seu Railway que você usa normalmente para acessar o admin.

### Passo 2: Fazer Login
- Use suas credenciais de admin
- Você precisa ser **admin** ou **super_admin** para ver o botão de delete

---

## 👀 Visualizar a Nova Funcionalidade

### Na Tabela de Leads

Você verá uma nova coluna "Delete" à direita da coluna "Details":

```
| # | Reference | Customer | ... | Details | Delete |
|---|-----------|----------|-----|---------|--------|
| 1 | 2024-... | John     | ... | Details |   🗑️   |
| 2 | 2024-... | Mary     | ... | Details |   🗑️   |
```

O ícone 🗑️ (lixeira) é vermelho e aparece ao lado do botão "Details".

---

## 🧪 Como Testar

### Teste 1: Delete Básico (Lead de Teste)

1. **Identifique um lead de teste** na tabela
   - Escolha um lead que você criou para testes
   - Anote o nome e referência

2. **Clique no ícone da lixeira** 🗑️
   - Um modal de confirmação vai abrir

3. **Verifique o modal de confirmação**
   - Deve mostrar:
     - Ícone de lixeira no topo
     - Título "Delete Lead"
     - Informações do lead:
       - Nome
       - Número de referência
       - Telefone
     - Mensagem de aviso
     - Botões "Cancel" e "Delete"

4. **Clique em "Cancel"**
   - Modal deve fechar
   - Lead deve continuar na tabela
   - Nada é deletado

5. **Clique novamente no ícone da lixeira** 🗑️

6. **Clique em "Delete"**
   - Botão muda para "Deleting..."
   - Toast de sucesso aparece: "Lead deleted successfully"
   - Modal fecha
   - Lead desaparece da tabela

7. **Verifique na tabela**
   - Lead não deve mais aparecer na lista
   - Contagem total diminui em 1

---

### Teste 2: Tentar Deletar Lead Convertido

1. **Encontre um lead com status "Won" ou "Converted"**
   - Estes são leads que viraram clientes

2. **Clique no ícone da lixeira** 🗑️

3. **Clique em "Delete"**

4. **Resultado Esperado**:
   - Toast de erro aparece
   - Mensagem: "Cannot delete converted leads. Please archive them instead."
   - Lead permanece na tabela

**Por quê?** Leads convertidos representam negócios fechados e não devem ser deletados para preservar histórico financeiro.

---

### Teste 3: Verificar Cascade Delete de Appointments

1. **Crie um lead de teste**
   - Vá em "New Lead"
   - Preencha os dados
   - Salve

2. **Crie um appointment para este lead**
   - Vá em Appointments
   - Crie um agendamento vinculado ao lead

3. **Volte para Leads**

4. **Delete o lead**
   - Clique na lixeira
   - Confirme

5. **Verifique Appointments**
   - O appointment vinculado deve ter sido deletado automaticamente
   - Não deve aparecer mais na lista de appointments

**Por quê?** Quando um lead é deletado, os appointments associados são removidos automaticamente para manter integridade dos dados.

---

### Teste 4: Verificar Permissões

#### Se você é Admin/Super Admin:
- ✅ Deve ver o ícone da lixeira
- ✅ Deve conseguir deletar

#### Se você for usuário comum:
- ❌ Não deve ver o ícone da lixeira
- ❌ Não consegue deletar

**Para testar**: Tente fazer login com usuário de nível mais baixo e veja se o botão aparece.

---

## 📱 Visual do Modal de Confirmação

Quando você clicar no ícone da lixeira, verá:

```
┌─────────────────────────────────────┐
│            🗑️                        │
│                                     │
│        Delete Lead                  │
│                                     │
│  Are you sure you want to delete   │
│  this lead?                         │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ João Silva                    │ │
│  │ FLIP-20241122-0001           │ │
│  │ (11) 98765-4321              │ │
│  └───────────────────────────────┘ │
│                                     │
│  This action will mark the lead    │
│  as deleted. Associated            │
│  appointments will also be         │
│  removed.                          │
│                                     │
│  [ Cancel ]  [ Delete ]            │
└─────────────────────────────────────┘
```

---

## 🔍 Como Verificar no Backend

### Verificar no Banco de Dados (Supabase)

1. **Acesse Supabase Dashboard**

2. **Vá para Table Editor → leads**

3. **Procure o lead que você deletou**

4. **Verifique a coluna `deleted_at`**:
   - Antes do delete: `null`
   - Depois do delete: timestamp (ex: `2024-11-22 15:30:45`)

5. **Verifique a coluna `status`**:
   - Deve ter mudado para `lost`

**Importante**: O lead ainda está no banco de dados! Apenas marcado como deletado (soft delete).

---

## 🛠️ Debugging / Troubleshooting

### Botão de Delete Não Aparece

**Possíveis causas**:
1. Você não é admin/super_admin
   - Solução: Fazer login com conta admin

2. Frontend não atualizou
   - Solução: Fazer hard refresh (Ctrl+Shift+R ou Cmd+Shift+R)

3. Railway ainda está deployando
   - Solução: Aguardar 3-5 minutos após o push

### Erro ao Deletar

**Verifique no Console do Browser**:
1. Abra DevTools (F12)
2. Vá na aba Console
3. Clique para deletar
4. Veja se há erros

**Erros comuns**:
- `401 Unauthorized`: Você não está autenticado
- `403 Forbidden`: Você não tem permissão
- `400 Bad Request`: Lead não pode ser deletado (convertido ou já deletado)
- `404 Not Found`: Lead não existe

### Toast Não Aparece

1. Verifique se tem o hot-toast instalado
2. Veja no console se há erros JavaScript
3. Tente recarregar a página

---

## 🧪 Checklist de Testes Completo

Use este checklist para testar tudo:

- [ ] Login como admin realizado
- [ ] Tabela de leads carregou
- [ ] Coluna "Delete" aparece com ícone 🗑️
- [ ] Clicar no ícone abre modal de confirmação
- [ ] Modal mostra informações corretas do lead
- [ ] Botão "Cancel" fecha modal sem deletar
- [ ] Botão "Delete" deleta o lead
- [ ] Toast de sucesso aparece
- [ ] Lead desaparece da tabela
- [ ] Contagem total de leads diminui
- [ ] Lead deletado tem `deleted_at` no banco (verificar Supabase)
- [ ] Tentar deletar lead convertido mostra erro
- [ ] Lead com appointment: appointment é deletado junto
- [ ] Fazer logout e login com usuário comum: botão não aparece

---

## 📊 Endpoints para Testar Manualmente (Postman/Insomnia)

Se você quiser testar a API diretamente:

### Endpoint de Soft Delete
```http
DELETE https://flipcars-site-e-admin-production.up.railway.app/api/leads/soft/{lead_id}
Authorization: Bearer {seu_token_jwt}
```

**Resposta de Sucesso (200)**:
```json
{
  "message": "Lead deleted successfully",
  "lead": {
    "id": "uuid-do-lead",
    "referenceNumber": "FLIP-20241122-0001"
  }
}
```

**Resposta de Erro - Lead Convertido (400)**:
```json
{
  "statusCode": 400,
  "message": "Cannot delete converted leads. Please archive them instead."
}
```

**Resposta de Erro - Já Deletado (400)**:
```json
{
  "statusCode": 400,
  "message": "Lead is already deleted"
}
```

---

## 📸 Onde Encontrar a Funcionalidade

### Navegação:
1. Acesse o admin dashboard
2. Menu lateral → **Leads**
3. Na tabela, última coluna → **Delete** (ícone 🗑️)

### Visual:
- **Ícone**: Lixeira vermelha (Trash2 do lucide-react)
- **Tamanho**: Mesmo tamanho do botão "Details"
- **Cor**: Vermelho (#DC2626)
- **Hover**: Fundo vermelho claro
- **Posição**: Última coluna da tabela, à direita de "Details"

---

## 🎯 Cenários de Teste Recomendados

### Cenário 1: Fluxo Feliz ✅
1. Criar lead de teste
2. Deletar lead de teste
3. Verificar que sumiu da lista

### Cenário 2: Lead com Dados Relacionados ✅
1. Criar lead de teste
2. Criar appointment para o lead
3. Deletar lead
4. Verificar que appointment sumiu

### Cenário 3: Validação de Negócio ❌
1. Tentar deletar lead convertido
2. Ver mensagem de erro apropriada

### Cenário 4: Prevenção de Erro ❌
1. Deletar um lead
2. Tentar deletar o mesmo lead novamente
3. Ver mensagem "Lead is already deleted"

---

## ⏱️ Checklist de Tempo Real

Execute isso agora para testar:

**5 minutos**:
1. [ ] Abrir admin dashboard
2. [ ] Ir para Leads
3. [ ] Clicar no ícone 🗑️ de um lead de teste
4. [ ] Ver modal de confirmação
5. [ ] Clicar "Delete"
6. [ ] Verificar toast de sucesso
7. [ ] Ver lead sumir da tabela

**Pronto!** Funcionalidade testada ✅

---

## 🆘 Precisa de Ajuda?

Se algo não funcionar:

1. **Verifique Railway**: Deployment completou?
2. **Verifique Logs**: Há erros no backend?
3. **Console Browser**: Há erros JavaScript?
4. **Network Tab**: Requisição falhou?
5. **Supabase**: Coluna `deleted_at` existe?

---

**Última atualização**: 2024-11-22  
**Status**: Pronto para testes ✅
