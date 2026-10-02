export const LUMEN_WHATSAPP_NUMBER = '5511998421080';
export const LUMEN_WHATSAPP_DISPLAY = '(11) 99842-1080';

export interface WhatsAppPlanParams {
  productTitle: string;
  tierName: string;
  price: number;
  deliveryDays: number;
  revisionsCount?: number;
  isRecurring?: boolean;
}

/**
 * Generates an official WhatsApp URL with pre-filled message for hiring a specific plan.
 */
export function createWhatsAppPlanUrl(params: WhatsAppPlanParams): string {
  const priceFormatted = params.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const period = params.isRecurring ? '/mês' : '';
  const revisionsText = params.revisionsCount
    ? `\n🔄 *Rodadas de Revisão:* ${params.revisionsCount} ${params.revisionsCount === 1 ? 'rodada inclusa' : 'rodadas inclusas'}`
    : '';

  const message = `Olá, equipe da Lumen! Vim pelo site oficial e escolhi o seguinte plano:

📦 *Produto:* ${params.productTitle}
⚡ *Plano Escolhido:* ${params.tierName}
💰 *Valor Tabelado:* ${priceFormatted}${period}
⏱️ *Prazo Contratual:* ${params.deliveryDays} ${params.deliveryDays === 1 ? 'dia útil' : 'dias úteis'}${revisionsText}

Gostaria de dar início ao projeto com a curadoria sênior. Como podemos prosseguir?`;

  return `https://wa.me/${LUMEN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates an official WhatsApp URL for general consultation or support.
 */
export function createGeneralWhatsAppUrl(customMessage?: string): string {
  const message =
    customMessage ||
    'Olá! Vim pelo site da Lumen e gostaria de tirar dúvidas sobre os produtos e falar com um curador sênior.';

  return `https://wa.me/${LUMEN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
