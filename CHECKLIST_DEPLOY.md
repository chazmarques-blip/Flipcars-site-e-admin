# ✅ CHECKLIST DE DEPLOY SEGURO - FLIPCARS

Use este checklist SEMPRE que for fazer mudanças no schema do banco.

## 📋 PRÉ-DEPLOY

- [ ] Código testado localmente
- [ ] Migration gerada (se houver mudança de schema)
- [ ] Migration revisada e aprovada
- [ ] Migration testada localmente
- [ ] Commit e push realizados
- [ ] Backup do banco criado (./backup-database.sh)

## 🚀 DEPLOY EM PRODUÇÃO

- [ ] Acesso ao Railway Dashboard aberto
- [ ] Logs do Railway abertos e monitorando
- [ ] Migration executada via Railway CLI (se aplicável)
- [ ] Verificar logs: migration executada com sucesso
- [ ] Deploy automático do código (git push)
- [ ] Verificar logs: build bem-sucedido
- [ ] Verificar logs: aplicação iniciou sem erros

## 🧪 PÓS-DEPLOY

- [ ] Teste manual dos endpoints críticos
- [ ] Verificar admin dashboard funciona
- [ ] Verificar formulário público funciona
- [ ] Verificar leads aparecem corretamente
- [ ] Monitorar logs por 5 minutos

## 🚨 SE ALGO DER ERRADO

- [ ] Consultar ESTRATEGIA_SYNC_DATABASE.md
- [ ] Verificar logs do erro exato
- [ ] Reverter migration se necessário
- [ ] Rollback deploy no Railway
- [ ] Restaurar backup se necessário

## 📝 APÓS DEPLOY

- [ ] Documentar mudanças em changelog
- [ ] Avisar equipe que deploy foi concluído
- [ ] Fechar issue/ticket relacionado

---

**Última atualização:** 2025-11-13
