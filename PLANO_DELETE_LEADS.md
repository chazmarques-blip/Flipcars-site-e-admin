# 📋 PLANO DE IMPLEMENTAÇÃO - Delete de Leads

**Data**: 2025-11-22  
**Objetivo**: Adicionar botão de lixeira para deletar leads (teste/inválidos) sem danificar o banco

---

## 🔍 ANÁLISE DA ESTRUTURA ATUAL

### 1. Relacionamentos no Banco de Dados

#### Tabela `leads`:
- **PK**: `id` (uuid)
- **Unique**: `reference_number`
- **Status**: Enum (new, qualified_ai, human_contacted, estimate_sent, converted, lost)

#### Tabela `appointments`:
- **PK**: `id` (uuid)
- **FK**: `lead_id` → `leads.id`
- **Cascade Delete**: ✅ **JÁ CONFIGURADO** 
  ```typescript
  @ManyToOne(() => Lead, { onDelete: 'CASCADE' })
  ```
  - Isso significa: se deletar lead, appointment é deletado automaticamente!

### 2. Método Atual de Delete

**Arquivo**: `backend/src/modules/leads/leads.service.ts` (linha 479)

```typescript
async remove(id: string): Promise<{ message: string }> {
  const lead = await this.findOne(id);
  lead.status = LeadStatus.LOST;  // ❌ SOFT DELETE (só muda status)
  await this.leadRepository.save(lead);
  return { message: 'Lead marked as lost successfully' };
}
```

**Problema**: Não é um delete real, só marca como "lost"

---

## ✅ ABORDAGEM RECOMENDADA: SOFT DELETE APRIMORADO

### Por Que NÃO Fazer Hard Delete:

❌ **Hard Delete** (DELETE FROM leads WHERE id = ?):
- Remove permanentemente do banco
- Perde histórico
- Pode quebrar relatórios/estatísticas
- Não há como recuperar se deletar por engano

✅ **Soft Delete** (UPDATE leads SET deleted_at = NOW() WHERE id = ?):
- Mantém dados no banco
- Permite recuperação se necessário
- Mantém histórico e auditoria
- Não quebra relatórios (pode filtrar por `deleted_at IS NULL`)

---

## 🎯 SOLUÇÃO PROPOSTA

### 1. Adicionar Coluna `deleted_at` na Tabela `leads`

**Migration**: Adicionar timestamp nullable

```sql
ALTER TABLE leads ADD COLUMN deleted_at TIMESTAMP NULL;
CREATE INDEX idx_leads_deleted_at ON leads(deleted_at);
```

### 2. Atualizar Entidade `Lead`

**Arquivo**: `backend/src/database/entities/lead.entity.ts`

```typescript
@Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
@Index('idx_lead_deleted_at')
deletedAt: Date | null;
```

### 3. Criar Método de Soft Delete

**Arquivo**: `backend/src/modules/leads/leads.service.ts`

```typescript
/**
 * Soft delete a lead (marks as deleted, keeps in database)
 * Also marks associated appointments as deleted
 */
async softDelete(id: string): Promise<{ message: string }> {
  const lead = await this.findOne(id);
  
  // Mark lead as deleted
  lead.deletedAt = new Date();
  lead.status = LeadStatus.LOST; // Also update status for clarity
  await this.leadRepository.save(lead);
  
  // Mark associated appointments as cancelled
  // (CASCADE delete is configured, but we prefer soft delete)
  await this.appointmentsService.cancelByLeadId(id);
  
  return { 
    message: 'Lead deleted successfully',
    leadId: id,
    referenceNumber: lead.referenceNumber
  };
}
```

### 4. Atualizar Query para Ignorar Deletados

**Todas as queries** devem filtrar `deletedAt IS NULL`:

```typescript
async findAll(query: QueryLeadsDto) {
  const queryBuilder = this.leadRepository
    .createQueryBuilder('lead')
    .where('lead.deletedAt IS NULL'); // ✅ IGNORAR DELETADOS
  
  // ... resto da query
}
```

### 5. Criar Endpoint DELETE

**Arquivo**: `backend/src/modules/leads/leads.controller.ts`

```typescript
/**
 * Soft delete a lead (mark as deleted)
 * Accessible by: admin, super_admin
 */
@Delete(':id')
@Roles('admin', 'super_admin')
@HttpCode(HttpStatus.OK)
async remove(@Param('id') id: string) {
  return this.leadsService.softDelete(id);
}
```

### 6. Frontend: Botão de Lixeira

**Arquivo**: `frontend-admin/src/app/dashboard/leads/page.tsx`

**Adicionar coluna de ações**:

```typescript
{
  header: 'Actions',
  accessorKey: 'id',
  cell: ({ row }) => (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewDetails(row.original.id)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      
      {/* NOVO: Botão de Delete */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDeleteLead(row.original)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  ),
}
```

**Função de delete com confirmação**:

```typescript
const handleDeleteLead = async (lead: Lead) => {
  // Confirmação de segurança
  const confirmed = window.confirm(
    `Delete lead ${lead.referenceNumber} (${lead.name})?\n\n` +
    `This will:\n` +
    `- Mark the lead as deleted\n` +
    `- Cancel associated appointments\n` +
    `- Keep data in database (can be recovered)\n\n` +
    `Are you sure?`
  );
  
  if (!confirmed) return;
  
  try {
    await leadService.deleteLead(lead.id);
    toast.success(`Lead ${lead.referenceNumber} deleted successfully`);
    fetchLeads(); // Refresh list
  } catch (error) {
    toast.error('Failed to delete lead');
    console.error('Delete error:', error);
  }
};
```

### 7. Service no Frontend

**Arquivo**: `frontend-admin/src/lib/api/lead.service.ts`

```typescript
async deleteLead(id: string): Promise<void> {
  await apiClient.delete(`/leads/${id}`);
}
```

---

## 🔒 SEGURANÇA E VALIDAÇÕES

### 1. Validações no Backend

```typescript
async softDelete(id: string): Promise<{ message: string }> {
  const lead = await this.findOne(id);
  
  // Validação 1: Não deletar se já deletado
  if (lead.deletedAt) {
    throw new BadRequestException('Lead is already deleted');
  }
  
  // Validação 2: Não deletar leads convertidos (opcional)
  if (lead.status === LeadStatus.CONVERTED) {
    throw new BadRequestException(
      'Cannot delete converted leads. Use archive instead.'
    );
  }
  
  // Validação 3: Log de auditoria
  console.log(`[Audit] Lead ${lead.id} deleted by user ${currentUser.id}`);
  
  // Executar soft delete
  lead.deletedAt = new Date();
  lead.status = LeadStatus.LOST;
  await this.leadRepository.save(lead);
  
  return { message: 'Lead deleted successfully' };
}
```

### 2. Permissões

- ✅ **Admin**: Pode deletar qualquer lead
- ✅ **Super Admin**: Pode deletar qualquer lead
- ❌ **Agent**: Não pode deletar leads
- ❌ **Customer**: Não pode deletar leads

---

## 📊 TRATAMENTO DE APPOINTMENTS

### Opção A: Soft Delete em Appointments (RECOMENDADO)

```typescript
// appointments.service.ts
async cancelByLeadId(leadId: string): Promise<void> {
  await this.appointmentRepository.update(
    { leadId },
    { 
      status: AppointmentStatus.CANCELLED,
      deletedAt: new Date() // Se adicionar coluna deleted_at
    }
  );
}
```

### Opção B: Deixar Cascade Delete do TypeORM

- Como `{ onDelete: 'CASCADE' }` já está configurado
- Appointments serão deletados automaticamente
- **Problema**: Perde histórico de appointments

**RECOMENDAÇÃO**: Implementar Opção A (soft delete também em appointments)

---

## 🧪 TESTES NECESSÁRIOS

### 1. Teste Unitário (Backend)

```typescript
describe('LeadsService - softDelete', () => {
  it('should soft delete a lead', async () => {
    const lead = await service.create(mockLeadDto);
    const result = await service.softDelete(lead.id);
    
    expect(result.message).toBe('Lead deleted successfully');
    
    const deletedLead = await repository.findOne({ 
      where: { id: lead.id },
      withDeleted: true // TypeORM option to include soft-deleted
    });
    expect(deletedLead.deletedAt).not.toBeNull();
  });
  
  it('should not return soft-deleted leads in findAll', async () => {
    const lead = await service.create(mockLeadDto);
    await service.softDelete(lead.id);
    
    const result = await service.findAll({});
    expect(result.data).not.toContain(lead);
  });
});
```

### 2. Teste Manual (Frontend)

1. ✅ Criar lead de teste
2. ✅ Criar appointment associado
3. ✅ Clicar no botão de lixeira
4. ✅ Confirmar modal de confirmação
5. ✅ Verificar que lead sumiu da lista
6. ✅ Verificar no Supabase que `deleted_at` foi preenchido
7. ✅ Verificar que appointment foi cancelado

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### Backend:

- [ ] 1. Criar migration para adicionar coluna `deleted_at` em `leads`
- [ ] 2. Adicionar coluna `deleted_at` em `appointments` (opcional mas recomendado)
- [ ] 3. Atualizar entidade `Lead` com campo `deletedAt`
- [ ] 4. Atualizar entidade `Appointment` com campo `deletedAt`
- [ ] 5. Criar método `softDelete()` no `leads.service.ts`
- [ ] 6. Criar método `cancelByLeadId()` no `appointments.service.ts`
- [ ] 7. Atualizar todas as queries para filtrar `deletedAt IS NULL`
- [ ] 8. Atualizar endpoint DELETE no `leads.controller.ts`
- [ ] 9. Adicionar validações e logs de auditoria
- [ ] 10. Criar testes unitários

### Frontend:

- [ ] 11. Adicionar ícone `Trash2` do lucide-react
- [ ] 12. Criar coluna de ações na tabela
- [ ] 13. Implementar função `handleDeleteLead` com confirmação
- [ ] 14. Adicionar método `deleteLead()` no `lead.service.ts`
- [ ] 15. Adicionar feedback visual (toast)

### Testes:

- [ ] 16. Testar delete de lead sem appointments
- [ ] 17. Testar delete de lead com appointments
- [ ] 18. Testar que lead deletado não aparece na lista
- [ ] 19. Testar permissões (admin pode, agent não pode)
- [ ] 20. Verificar integridade do banco após deletes

---

## ⚠️ RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Deletar lead importante por engano | Média | Alto | Modal de confirmação + Soft delete (recuperável) |
| Appointments órfãos | Baixa | Médio | Soft delete em appointments também |
| Performance com muitos deletados | Baixa | Médio | Index em `deleted_at` + Limpeza periódica |
| Quebrar queries existentes | Média | Alto | Testar TODAS as queries com filtro `deletedAt IS NULL` |

---

## 🚀 ORDEM DE IMPLEMENTAÇÃO

### Fase 1: Backend (30-40 min)
1. Migration para `deleted_at`
2. Atualizar entidades
3. Implementar soft delete
4. Atualizar queries

### Fase 2: Frontend (20-30 min)
5. Adicionar botão de lixeira
6. Implementar confirmação
7. Integrar com API

### Fase 3: Testes (20-30 min)
8. Testes manuais
9. Verificar edge cases
10. Deploy

**Tempo total estimado**: 1h30min - 2h

---

## 📞 PRÓXIMOS PASSOS

**AGUARDANDO SUA APROVAÇÃO**:

1. ✅ Você aprova este plano?
2. ✅ Prefere soft delete ou hard delete?
3. ✅ Alguma modificação necessária?

**Após aprovação, vou**:
1. Criar migration
2. Implementar backend
3. Implementar frontend
4. Testar localmente
5. Commitar e fazer deploy

---

**O que você acha? Alguma sugestão ou mudança no plano?** 🚀
