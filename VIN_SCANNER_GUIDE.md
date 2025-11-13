# 📸 VIN Scanner - Guia Completo

## 🎯 O que é?

O VIN Scanner é uma funcionalidade que permite aos usuários **escanear o código VIN do veículo usando a câmera do celular**, em vez de digitar manualmente os 17 caracteres.

---

## 🚀 Como Funciona

### **Fluxo do Usuário:**

1. **Abrir Formulário de Cotação**
   - Cliente clica em "Free Estimate" no site
   - Preenche informações básicas (nome, telefone, email)
   - Escolhe tipo de serviço (Body Shop ou Mechanic)

2. **Chegar na Etapa do VIN (Step 3a)**
   - Tela mostra campo de entrada manual do VIN
   - **NOVO:** Botão "Scan" ao lado do campo

3. **Clicar em "Scan"**
   - Abre tela fullscreen com câmera ativa
   - Mostra viewfinder (moldura dourada) para posicionar VIN
   - Exibe instruções de uso

4. **Posicionar o VIN**
   - Apontar câmera para o VIN (no dashboard, porta, ou documento)
   - Centralizar dentro da moldura
   - Garantir boa iluminação

5. **Capturar e Escanear**
   - Clicar no botão "Capture & Scan"
   - Sistema captura foto
   - OCR processa imagem (2-5 segundos)
   - Extrai texto e valida VIN

6. **Resultado:**
   - ✅ **Sucesso:** VIN detectado aparece, preenche campo automaticamente
   - ❌ **Falha:** Mensagem de erro, opção de tentar novamente ou digitar manualmente

7. **Decodificação Automática**
   - VIN válido é enviado para API NHTSA
   - Busca informações do veículo (Year, Make, Model)
   - Preenche automaticamente os dados

---

## 🛠️ Tecnologias Utilizadas

### **1. react-webcam**
- Acessa câmera do dispositivo
- Captura imagens em alta qualidade
- Suporta seleção de câmera (frontal/traseira)

```bash
npm install react-webcam
```

### **2. tesseract.js**
- OCR (Optical Character Recognition)
- Lê texto de imagens
- Roda no browser (client-side)
- Suporta múltiplos idiomas

```bash
npm install tesseract.js
```

### **3. NHTSA Vehicle API** (Gratuita)
- Decodifica VIN
- Retorna informações do veículo
- Endpoint: `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/{VIN}?format=json`

---

## 📱 Compatibilidade Mobile

### **Câmera Traseira Preferencial:**
```typescript
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: { ideal: 'environment' }, // Usa câmera traseira
};
```

### **Permissões Necessárias:**
- ✅ Camera access (solicitada automaticamente pelo browser)
- ✅ Funciona em iOS Safari, Chrome Android, Firefox Mobile

### **Fallback:**
- Se câmera não disponível: mostra erro + opção manual
- Se OCR falhar: permite entrada manual

---

## 🎨 Componentes

### **1. VINScanner.tsx** (Novo componente)

**Props:**
```typescript
interface VINScannerProps {
  onVINDetected: (vin: string) => void;  // Callback quando VIN detectado
  onClose: () => void;                    // Fechar scanner
}
```

**Estados:**
- `isScanning`: Processando OCR
- `scanStatus`: 'idle' | 'processing' | 'success' | 'error'
- `detectedVIN`: VIN extraído
- `errorMessage`: Mensagem de erro

**Funcionalidades:**
- Captura imagem da webcam
- Inicializa Tesseract worker
- Configura whitelist de caracteres (sem I, O, Q)
- Valida formato VIN (17 caracteres alphanumericos)
- Feedback visual (loading, success, error)

### **2. Step3aVIN.tsx** (Atualizado)

**Mudanças:**
- Adicionado botão "Scan" no campo VIN
- Integrado VINScanner modal
- Callback `handleVINScanned` preenche campo
- Mantém funcionalidade de entrada manual

---

## 🔍 Validação de VIN

### **Formato Válido:**
- **Exatamente 17 caracteres**
- **Letras:** A-H, J-N, P-R, T-Z (sem I, O, Q)
- **Números:** 0-9
- **Exemplo:** `1HGBH41JXMN109186`

### **Regex de Validação:**
```typescript
const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/i;
```

### **Por que sem I, O, Q?**
- **I** pode ser confundido com **1**
- **O** pode ser confundido com **0**
- **Q** não é usado no padrão VIN

---

## 📊 Fluxo de Dados

```
┌──────────────┐
│   Usuário    │
│  Clica Scan  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  VINScanner.tsx  │
│  Abre Câmera     │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Captura Foto    │
│  (Webcam)        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Tesseract OCR   │
│  Processa Imagem │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Valida VIN      │
│  (17 chars)      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ onVINDetected()  │
│ Callback p/ pai  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Step3aVIN.tsx    │
│ Preenche campo   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  NHTSA API       │
│  Decodifica VIN  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Dados Veículo   │
│  Year/Make/Model │
└──────────────────┘
```

---

## 🧪 Como Testar

### **1. Em Desktop (com webcam):**
```bash
cd frontend-admin
npm run dev
```
- Abra http://localhost:3000
- Vá para Dashboard > "Test Estimate Form"
- Avance até Step 4 (VIN)
- Clique "Scan" (usará webcam frontal)
- Aponte para VIN impresso ou na tela
- Teste com VIN real: `1HGBH41JXMN109186`

### **2. Em Mobile (melhor experiência):**
- Faça deploy em Vercel
- Acesse pelo celular: https://admin.flipcars.us
- Câmera traseira será usada automaticamente
- Teste com VIN real no carro

### **3. Teste de Fallback:**
- Negue permissão de câmera
- Verifique se mostra erro
- Confirme que entrada manual ainda funciona

---

## ⚙️ Configurações

### **Tesseract OCR Settings:**
```typescript
await worker.setParameters({
  tessedit_char_whitelist: 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789',
  tessedit_pageseg_mode: '6', // Bloco uniforme de texto
});
```

### **Webcam Settings:**
```typescript
const videoConstraints = {
  width: 1280,      // Alta resolução
  height: 720,
  facingMode: { ideal: 'environment' }, // Câmera traseira
};
```

---

## 🐛 Troubleshooting

### **Problema: Câmera não abre**
- **Causa:** Permissão negada ou HTTPS não configurado
- **Solução:** 
  - Verificar se site está em HTTPS
  - Pedir ao usuário para permitir câmera
  - Testar em navegador diferente

### **Problema: OCR não detecta VIN**
- **Causa:** Iluminação ruim, imagem desfocada, VIN pequeno
- **Solução:**
  - Melhorar iluminação
  - Aproximar câmera do VIN
  - Usar entrada manual como fallback

### **Problema: VIN detectado mas inválido**
- **Causa:** OCR confundiu caracteres (ex: 8 por B)
- **Solução:**
  - Usuário pode editar manualmente
  - Implementar correção inteligente de caracteres

### **Problema: Lento no mobile**
- **Causa:** Tesseract processa em main thread
- **Solução:**
  - Já usa Web Worker (Tesseract automático)
  - Pode adicionar loading feedback melhor

---

## 📈 Próximas Melhorias

### **1. Múltiplas Tentativas Automáticas**
```typescript
// Capturar 3 fotos seguidas
// Comparar resultados
// Usar o VIN mais confiável
```

### **2. Pré-processamento de Imagem**
```typescript
// Converter para escala de cinza
// Aumentar contraste
// Remover ruído
// Melhorar taxa de sucesso do OCR
```

### **3. ML Model Customizado**
```typescript
// Treinar modelo específico para VINs
// Melhor que OCR genérico
// Usar TensorFlow.js
```

### **4. Histórico de Scans**
```typescript
// Salvar VINs escaneados
// Sugerir VINs recentes
// Análise de taxa de sucesso
```

---

## 💾 Salvando os Dados

### **Onde é Salvo?**

Os dados de agendamento são salvos na tabela `leads`:

```sql
-- Campos de agendamento
preferred_date        DATE             -- Data preferida
preferred_time_slot   VARCHAR(50)      -- Horário (ex: "9:00-11:00")
```

### **Como Acessar?**

1. **No Admin Dashboard:**
   - Vá para "Leads"
   - Clique em um lead
   - Veja detalhes incluindo agendamento

2. **Via API:**
```typescript
GET /api/leads/:id
// Retorna lead com preferredDate e preferredTimeSlot
```

3. **Diretamente no Supabase:**
```sql
SELECT 
  id,
  reference_number,
  preferred_date,
  preferred_time_slot,
  contact_preferences
FROM leads
WHERE preferred_date IS NOT NULL
ORDER BY preferred_date ASC;
```

---

## 🎯 Resumo

✅ **Scanner VIN implementado**
✅ **OCR funcional (Tesseract.js)**
✅ **Mobile-first com câmera traseira**
✅ **Validação automática de VIN**
✅ **Decodificação via NHTSA API**
✅ **Fallback para entrada manual**
✅ **Feedback visual em tempo real**
✅ **Campos de agendamento no banco de dados**

---

## 🚀 Deploy

Todos os commits foram enviados para GitHub:
- ✅ Backend: Railway (auto-deploy)
- ✅ Frontend: Vercel (auto-deploy)

Aguarde 2-3 minutos e teste em:
- **Admin:** https://admin.flipcars.us
- **Website:** https://flipcars.us

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique console do navegador (F12)
2. Teste permissões de câmera
3. Confirme que está em HTTPS
4. Teste entrada manual como alternativa
