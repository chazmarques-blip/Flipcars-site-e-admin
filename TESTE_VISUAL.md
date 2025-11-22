# 👁️ Guia Visual Rápido

## Como Parece na Tela

### Tabela de Leads (Antes)
```
+-----+---------------+-------------+-------------+---------+--------+
| #   | Reference     | Customer    | Contact     | Details | Delete |
+-----+---------------+-------------+-------------+---------+--------+
| 33  | 2024-1122-001 | João Silva  | (11) 98765  | Details |  🗑️    |
| 32  | 2024-1121-025 | Maria Souza | (21) 91234  | Details |  🗑️    |
+-----+---------------+-------------+-------------+---------+--------+
```

### Quando Você Clica na Lixeira 🗑️
```
                    ┌──────────────────────────────┐
                    │          🗑️                   │
                    │                              │
                    │      Delete Lead             │
                    │                              │
                    │  Are you sure you want to    │
                    │  delete this lead?           │
                    │                              │
                    │  ┌────────────────────────┐  │
                    │  │ João Silva            │  │
                    │  │ FLIP-20241122-0001   │  │
                    │  │ (11) 98765-4321      │  │
                    │  └────────────────────────┘  │
                    │                              │
                    │  This action will mark the   │
                    │  lead as deleted...          │
                    │                              │
                    │  ┌────────┐  ┌──────────┐   │
                    │  │ Cancel │  │  Delete  │   │
                    │  └────────┘  └──────────┘   │
                    │                              │
                    └──────────────────────────────┘
```

### Depois de Clicar "Delete"
```
                    ╔═══════════════════════════════╗
                    ║  ✅ Lead deleted successfully ║
                    ╚═══════════════════════════════╝

+-----+---------------+-------------+-------------+---------+--------+
| #   | Reference     | Customer    | Contact     | Details | Delete |
+-----+---------------+-------------+-------------+---------+--------+
| 32  | 2024-1121-025 | Maria Souza | (21) 91234  | Details |  🗑️    |
+-----+---------------+-------------+-------------+---------+--------+
                    ☝️ João Silva sumiu!
```

## 🎨 Cores e Ícones

### Ícone da Lixeira
- **Cor**: Vermelho (#DC2626)
- **Tamanho**: 16x16px (w-4 h-4)
- **Hover**: Fundo vermelho claro (#FEF2F2)
- **Formato**: Círculo com ícone dentro

### Modal de Confirmação
- **Fundo**: Preto transparente (70%)
- **Modal**: Branco com sombra
- **Botão Cancel**: Cinza
- **Botão Delete**: Vermelho (#DC2626)
- **Estado Loading**: "Deleting..." com botão desabilitado

### Toast de Sucesso
- **Fundo**: Verde (#10B981)
- **Texto**: Branco
- **Posição**: Top-center
- **Duração**: 3 segundos
- **Animação**: Slide down + fade out

### Toast de Erro
- **Fundo**: Vermelho (#EF4444)
- **Texto**: Branco
- **Posição**: Top-center
- **Duração**: 5 segundos
- **Animação**: Slide down + fade out

## 📱 Em Diferentes Telas

### Desktop (> 1024px)
```
Modal: 400px de largura, centralizado
Ícone: Visível sempre
Hover: Efeito de hover ativo
```

### Tablet (768px - 1024px)
```
Modal: 90% da largura, max 400px
Ícone: Visível sempre
Hover: Efeito de hover ativo
```

### Mobile (< 768px)
```
Modal: 90% da largura
Ícone: Visível, pode ser menor
Touch: Area touch de 44x44px mínimo
```

## 🔍 Detalhes de Interação

### Estados do Botão Delete

1. **Normal** (botão no modal)
   ```
   ┌──────────┐
   │  Delete  │  ← Vermelho, hover mais escuro
   └──────────┘
   ```

2. **Loading** (durante delete)
   ```
   ┌──────────────┐
   │  Deleting... │  ← Desabilitado, cursor wait
   └──────────────┘
   ```

3. **Disabled** (após clicar)
   ```
   ┌──────────┐
   │  Delete  │  ← Cinza, não clicável
   └──────────┘
   ```

### Ícone da Lixeira na Tabela

1. **Normal**
   ```
   ╔═══╗
   ║ 🗑️ ║  ← Vermelho, círculo transparente
   ╚═══╝
   ```

2. **Hover**
   ```
   ╔═══╗
   ║ 🗑️ ║  ← Fundo vermelho claro
   ╚═══╝
   ```

3. **Active** (clicando)
   ```
   ╔═══╗
   ║ 🗑️ ║  ← Fundo mais escuro
   ╚═══╝
   ```

## 🎬 Animações

### Modal
- **Entrada**: Fade in + Scale up (0.95 → 1.0)
- **Saída**: Fade out + Scale down (1.0 → 0.95)
- **Duração**: 200ms
- **Easing**: ease-out

### Toast
- **Entrada**: Slide down from top (50ms)
- **Permanência**: 3-5 segundos
- **Saída**: Fade out (150ms)

### Lead desaparece da tabela
- **Efeito**: Fade out (300ms)
- **Depois**: Row é removida
- **Tabela**: Reflow suave

## 🎯 Áreas Clicáveis

```
┌─────────────────────────────────┐
│                                 │
│  Fundo do modal                 │
│  (clique fecha)                 │
│                                 │
│   ┌─────────────────────────┐   │
│   │                         │   │
│   │   Conteúdo do Modal     │   │
│   │   (clique não fecha)    │   │
│   │                         │   │
│   │  ┌────┐      ┌──────┐  │   │
│   │  │ OK │ ← → │Cancel│  │   │
│   │  └────┘      └──────┘  │   │
│   │     ↑            ↑     │   │
│   │  Clicável   Clicável   │   │
│   └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

## 📐 Medidas Exatas

### Ícone Lixeira
```css
width: 28px (w-7)
height: 28px (h-7)
icon-size: 16px (w-4 h-4)
border-radius: 50%
padding: 6px
color: #DC2626 (red-600)
hover-bg: #FEF2F2 (red-50)
```

### Modal
```css
max-width: 448px (max-w-md)
margin: 16px (mx-4)
padding: 24px (p-6)
border-radius: 8px (rounded-lg)
background: white
box-shadow: 0 25px 50px rgba(0,0,0,0.25)
```

### Botões do Modal
```css
height: 40px
padding: 8px 16px
border-radius: 6px
font-size: 14px
font-weight: 500

Cancel:
  background: #F3F4F6 (gray-100)
  color: #374151 (gray-700)
  
Delete:
  background: #DC2626 (red-600)
  color: white
```

---

**Dica**: Abra o DevTools (F12) e vá na aba Elements para inspecionar o modal e ver as classes CSS aplicadas!
