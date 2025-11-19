# Estilo Minimalista Google Calendar - Documentação Completa

## 🎯 Objetivo

Replicar o visual **minimalista e limpo** do Google Calendar no dashboard do FlipCars.

---

## ✅ Características Principais

### 1. **Números Pequenos no Canto Superior Esquerdo**

```
┌────────────┐
│ 25         │  ← Número no canto (não centralizado)
│            │
│            │
└────────────┘
```

**CSS:**
```css
.calendar-day {
  display: flex;
  align-items: flex-start;      /* Topo */
  justify-content: flex-start;  /* Esquerda */
  font-size: 12px;              /* Pequeno */
  text-align: left;
}
```

---

### 2. **Linhas de Grid Muito Finas**

```
┌───┬───┬───┐
│ 1 │ 2 │ 3 │  ← Linhas de 1px (quase invisíveis)
├───┼───┼───┤
│ 4 │ 5 │ 6 │
└───┴───┴───┘
```

**CSS:**
```css
.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;                    /* Linha MUITO fina */
  background: #e5e7eb;         /* Cor da linha */
  border: 1px solid #e5e7eb;
}
```

---

### 3. **Células Espaçosas e Limpas**

```
┌────────────┐
│ 15         │  ← Muito espaço interno
│            │  ← Min-height: 60px
│            │
│            │
└────────────┘
```

**CSS:**
```css
.calendar-day {
  min-height: 60px;     /* Células altas */
  padding: 4px 6px;     /* Espaço confortável */
  background: #ffffff;  /* Fundo branco limpo */
}
```

---

### 4. **Barra de Evento na Parte de Baixo**

```
┌────────────┐
│ 25      [1]│  ← Número + badge
│            │
│            │
│▬▬▬▬▬▬▬▬▬▬ │  ← Barra fina EMBAIXO
└────────────┘
```

**CSS:**
```css
.calendar-day.has-event::after {
  content: '';
  position: absolute;
  bottom: 4px;              /* Próximo à borda inferior */
  left: 4px;
  right: 4px;
  height: 2px;              /* Fina mas visível */
  background: #1f2937;      /* Preto */
  border-radius: 1px;
}
```

---

### 5. **Badge Compacto ao Lado do Número**

```
┌────────────┐
│ 25    ①    │  ← Badge dourado com número
│            │
└────────────┘
```

**CSS:**
```css
.calendar-day.has-badge::before {
  content: attr(data-count);
  position: absolute;
  top: 2px;
  left: 24px;              /* Ao lado do número */
  width: 16px;
  height: 16px;
  background: #D4AF37;     /* Dourado */
  color: #1f2937;          /* Texto escuro */
  border-radius: 50%;
  font-size: 9px;
  font-weight: 700;
}
```

---

### 6. **Dia Atual com Borda Dourada Sutil**

```
┏━━━━━━━━━━━━┓
┃ 15         ┃  ← Borda dourada de 2px
┃            ┃  ← Fundo branco (não amarelo)
┃            ┃
┗━━━━━━━━━━━━┛
```

**CSS:**
```css
.calendar-day.today {
  background: #ffffff;          /* Branco */
  border: 2px solid #D4AF37;    /* Borda dourada */
  color: #1f2937;
  font-weight: 500;
  padding: 3px;                 /* Ajuste por causa da borda */
}
```

---

## 📊 Calendário Completo - Visual Final

```
                 Novembro 2025

    SUN   MON   TUE   WED   THU   FRI   SAT
   ┌───┬─────┬───┬───┬───┬───┬───┐
   │26 │27 ①│28 │29 │30 │ 1 │ 2 │
   │   │▬▬▬ │   │   │   │   │   │
   ├───┼─────┼───┼───┼───┼───┼───┤
   │ 3 │ 4  │ 5 │ 6 │ 7 │ 8 │ 9 │
   ├───┼────┼───┼───┼───┼───┼───┤
   │10 │11  │12 │13 │14 │┏━━┓│16 │
   │   │    │   │   │   │┃15┃│   │  ← Hoje
   ├───┼────┼───┼───┼───┼┗━━┛┼───┤
   │17 │18  │19 │20 │21 │22 │23 │
   ├───┼────┼───┼───┼───┼───┼───┤
   │24 │25 ①│26 │27 ①│28 │29 │30 │
   │   │▬▬▬ │   │▬▬▬ │   │   │   │  ← Eventos
   └───┴─────┴───┴─────┴───┴───┴───┘
```

**Legenda:**
- `①` = Badge com contagem (dias 27, 25)
- `▬▬▬` = Barra de evento (embaixo)
- `┃15┃` = Dia atual (borda dourada)
- Linhas finas entre células (1px)

---

## 🎨 Paleta de Cores

| Elemento | Cor | Hex | Uso |
|----------|-----|-----|-----|
| **Fundo células** | Branco | `#ffffff` | Background padrão |
| **Números** | Cinza escuro | `#1f2937` | Texto dos dias |
| **Linhas grid** | Cinza claro | `#e5e7eb` | Separação células |
| **Borda hoje** | Dourado | `#D4AF37` | Destaque dia atual |
| **Badge fundo** | Dourado | `#D4AF37` | Badge contagem |
| **Badge texto** | Cinza escuro | `#1f2937` | Número no badge |
| **Barra evento** | Preto | `#1f2937` | Indicador embaixo |
| **Hover** | Cinza claro | `#f9fafb` | Estado hover |
| **Outros meses** | Cinza claro | `#d1d5db` | Dias fora do mês |

---

## 📏 Especificações de Tamanho

### Células do Calendário
- **Aspect ratio**: 1:1 (quadrado)
- **Min-height**: 60px
- **Padding**: 4px 6px
- **Font-size**: 12px (números)

### Grid
- **Colunas**: 7 (repeat(7, 1fr))
- **Gap**: 1px (linhas finas)
- **Border**: 1px solid #e5e7eb

### Badge
- **Tamanho**: 16x16px
- **Font-size**: 9px
- **Position**: top: 2px, left: 24px

### Barra de Evento
- **Altura**: 2px
- **Position**: bottom: 4px
- **Margem**: left: 4px, right: 4px
- **Border-radius**: 1px

### Borda Dia Atual
- **Espessura**: 2px
- **Cor**: #D4AF37 (dourado)
- **Padding ajustado**: 3px (para compensar borda)

---

## ✅ Checklist de Conformidade

### Layout Geral
- [x] Grid com 7 colunas
- [x] Linhas de separação de 1px (muito finas)
- [x] Fundo branco nas células
- [x] Espaço amplo (min-height: 60px)

### Números
- [x] Posicionados no canto superior esquerdo
- [x] Font-size: 12px (pequeno)
- [x] Cor: #1f2937 (cinza escuro)
- [x] Alinhamento: flex-start

### Dia Atual
- [x] Borda dourada de 2px
- [x] Fundo branco (não amarelo)
- [x] Font-weight: 500 (meio termo)
- [x] Padding ajustado por causa da borda

### Eventos
- [x] Barra na parte de BAIXO (bottom: 4px)
- [x] Altura de 2px (fina mas visível)
- [x] Cor preta (#1f2937)
- [x] Badge dourado ao lado do número

### Visual Geral
- [x] Minimalista e limpo
- [x] Muito espaço branco
- [x] Linhas sutis e delicadas
- [x] Igual ao Google Calendar

---

## 🔍 Diferenças vs. FullCalendar Style

| Aspecto | FullCalendar | Google Calendar |
|---------|--------------|-----------------|
| **Números** | Centralizados | Canto superior esquerdo |
| **Font-size** | 14px | 12px (menor) |
| **Bordas** | Visíveis (1px) | Sutis (grid 1px) |
| **Células** | Compactas | Espaçosas (60px) |
| **Dia atual** | Fundo amarelo | Fundo branco + borda |
| **Barra evento** | Centro/embaixo | Embaixo (bottom: 4px) |
| **Badge** | Canto direito | Ao lado do número |
| **Visual** | Destacado | Minimalista |

---

## 🚀 Resultado

O calendário agora possui:
- ✅ **Visual minimalista** como Google Calendar
- ✅ **Números pequenos** no canto superior esquerdo
- ✅ **Linhas finas** e sutis (1px)
- ✅ **Células espaçosas** e limpas
- ✅ **Barra de eventos** na parte de baixo
- ✅ **Badge compacto** ao lado do número
- ✅ **Muito espaço branco** e respiro visual

---

## 🔗 Referências

- **Commit**: `98704bf1`
- **Preview**: https://8765-i0s90jm77mc76ydqc5fpz-2e77fc33.sandbox.novita.ai
- **Pull Request**: #30

