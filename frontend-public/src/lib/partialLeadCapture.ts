/**
 * Partial Lead Capture System
 * Captura informações do usuário mesmo se ele não completar o formulário
 */

import { fbEvent } from '@/components/FacebookPixel';

interface PartialLeadData {
  timestamp: string;
  formStep: number;
  name?: string;
  email?: string;
  phone?: string;
  serviceType?: string;
  hasInsurance?: boolean;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

/**
 * Salva lead parcial no localStorage e dispara evento no Facebook
 */
export function capturePartialLead(data: Partial<PartialLeadData>) {
  try {
    // 1. Adicionar timestamp e source
    const partialLead: PartialLeadData = {
      timestamp: new Date().toISOString(),
      formStep: data.formStep || 1,
      ...data,
      source: window.location.href,
      // Capturar UTM parameters se existirem
      utm_source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
    };

    // 2. Salvar no localStorage
    const existingLeads = JSON.parse(localStorage.getItem('flipcars_partial_leads') || '[]');
    existingLeads.push(partialLead);
    localStorage.setItem('flipcars_partial_leads', JSON.stringify(existingLeads));

    // 3. Disparar evento customizado no Facebook Pixel
    if (data.email || data.phone) {
      fbEvent.trackCustom('PartialLeadCapture', {
        step: data.formStep,
        hasEmail: !!data.email,
        hasPhone: !!data.phone,
        hasName: !!data.name,
      });
    }

    // 4. Se tiver email ou telefone, também disparar InitiateCheckout
    if (data.email || data.phone) {
      fbEvent.initiateCheckout('Partial Lead - Form Started');
    }

    console.log('[PartialLead] ✅ Captured:', partialLead);
  } catch (error) {
    console.error('[PartialLead] ❌ Error capturing:', error);
  }
}

/**
 * Recupera todos os leads parciais salvos
 */
export function getPartialLeads(): PartialLeadData[] {
  try {
    return JSON.parse(localStorage.getItem('flipcars_partial_leads') || '[]');
  } catch {
    return [];
  }
}

/**
 * Limpa leads parciais após conversão completa
 */
export function clearPartialLeads() {
  try {
    localStorage.removeItem('flipcars_partial_leads');
    console.log('[PartialLead] ✅ Cleared all partial leads');
  } catch (error) {
    console.error('[PartialLead] ❌ Error clearing:', error);
  }
}

/**
 * Hook para auto-save conforme usuário preenche
 */
export function setupAutoCapture() {
  // Captura ao mudar de step
  window.addEventListener('formStepChange', (event: any) => {
    capturePartialLead(event.detail);
  });

  // Captura ao sair da página (abandonar formulário)
  window.addEventListener('beforeunload', () => {
    const formData = sessionStorage.getItem('currentFormData');
    if (formData) {
      capturePartialLead({
        ...JSON.parse(formData),
        formStep: -1, // Indica abandono
      });
    }
  });
}
