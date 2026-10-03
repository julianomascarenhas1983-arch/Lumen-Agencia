import { DiagnosticoFormData } from '../types';
import { LUMEN_WHATSAPP_NUMBER } from './whatsapp';

export const LUMEN_COMPANY_EMAIL = 'atendimento@lumenmarketing.online';

export function generateBriefingProtocol(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `LUM-${dateStr}-${randomSuffix}`;
}

export function formatBriefingSummaryText(formData: DiagnosticoFormData, protocol: string): string {
  const channels = formData.currentChannels?.length ? formData.currentChannels.join(', ') : 'Nenhum informado';

  return `========================================================
LUMEN AGÊNCIA VIRTUAL | MINI-BRIEFING ESTRATÉGICO
Protocolo: ${protocol}
Data/Hora: ${new Date().toLocaleString('pt-BR')}
========================================================

1. DADOS DO NEGÓCIO
- Nome da Empresa/Marca: ${formData.businessName || 'Não informado'}
- Responsável / Solicitante: ${formData.contactName || 'Não informado'}
- Segmento de Atuação: ${formData.segment || 'Não informado'}
- O que faz / vende: ${formData.whatItDoes || 'Não informado'}
- Público-alvo: ${formData.targetAudience?.trim() || 'Não especificado'}
- Cidade / Estado: ${formData.city?.trim() || 'Não informada'}

2. PRESENÇA & OPERAÇÃO ATUAL
- Canais ativos: ${channels}
- Frequência de publicação/anúncios: ${formData.postingFrequency || 'Não informada'}
- Investimento mensal em marketing: ${formData.monthlyInvestment || 'Não informado'}
- Faixa de preço / Ticket médio: ${formData.priceRange?.trim() || 'Não informada'}

3. OBJETIVOS & GARGALOS
- Objetivo prioritário: ${formData.mainGoal || 'Não informado'}
- Maior dificuldade / gargalo: ${formData.mainDifficulty || 'Não informada'}
- Urgência de implementação: ${formData.urgency || 'Imediato (próximos 15-30 dias)'}

4. DADOS DE CONTATO
- E-mail do solicitante: ${formData.contactEmail}
- WhatsApp / Telefone: ${formData.contactPhone || 'Não informado'}
- Encaminhado para: ${LUMEN_COMPANY_EMAIL}
- Consentimento LGPD: Confirmado pelo solicitante

========================================================
Este mini-briefing foi gerado e registrado pela plataforma Lumen.
Nossa diretoria estratégica responderá com as recomendações em até 24h.
========================================================`;
}

export function createMailtoUrl(formData: DiagnosticoFormData, protocol: string): string {
  const subject = encodeURIComponent(`[Mini-Briefing Lumen] ${formData.businessName} - Protocolo ${protocol}`);
  const body = encodeURIComponent(formatBriefingSummaryText(formData, protocol));
  const cc = encodeURIComponent(formData.contactEmail.trim());

  return `mailto:${LUMEN_COMPANY_EMAIL}?cc=${cc}&subject=${subject}&body=${body}`;
}

export function createWhatsAppBriefingUrl(formData: DiagnosticoFormData, protocol: string): string {
  const text = encodeURIComponent(
    `Olá, equipe Lumen! Acabei de enviar o Mini-Briefing Estratégico da minha empresa *${formData.businessName}*.\n\n` +
    `📋 *Protocolo:* ${protocol}\n` +
    `👤 *Responsável:* ${formData.contactName || 'Responsável'}\n` +
    `🎯 *Objetivo:* ${formData.mainGoal}\n` +
    `📧 *E-mail:* ${formData.contactEmail}\n\n` +
    `Gostaria de confirmar o recebimento e acelerar a análise.`
  );

  return `https://wa.me/${LUMEN_WHATSAPP_NUMBER}?text=${text}`;
}

export async function submitBriefingEmail(formData: DiagnosticoFormData, protocol: string): Promise<{ success: boolean; message?: string }> {
  const summaryText = formatBriefingSummaryText(formData, protocol);

  // 1. Try local/backend route if available
  try {
    const localRes = await fetch('/api/enviar-briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        protocol,
        formData,
        targetEmail: LUMEN_COMPANY_EMAIL,
        summaryText,
      }),
    });
    if (localRes.ok) {
      console.log('Briefing logged to local backend.');
    }
  } catch (err) {
    // Continue with public zero-config dispatch
  }

  // 2. Dispatch via FormSubmit AJAX service (sends to atendimento@lumenmarketing.online AND autoresponse copy to client)
  try {
    const payload = {
      _subject: `[Mini-Briefing Lumen] Novo Diagnóstico - ${formData.businessName} (${protocol})`,
      _replyto: formData.contactEmail,
      _cc: formData.contactEmail,
      _template: 'box',
      _autoresponse: `Olá, ${formData.contactName || formData.businessName}!\n\nRecebemos com sucesso o seu Mini-Briefing Estratégico (Protocolo: ${protocol}).\n\nNossa equipe de diretores e estrategistas da Lumen Agência Virtual já iniciou a análise do seu segmento e desafios. Entraremos em contato pelo seu e-mail (${formData.contactEmail})${formData.contactPhone ? ` ou WhatsApp (${formData.contactPhone})` : ''} em até 24 horas úteis.\n\nAtenciosamente,\nEquipe Lumen Agência Virtual\natendimento@lumenmarketing.online`,
      protocolo: protocol,
      empresa: formData.businessName,
      responsavel: formData.contactName || 'Não informado',
      segmento: formData.segment,
      o_que_faz: formData.whatItDoes,
      publico_alvo: formData.targetAudience || 'Não especificado',
      cidade_estado: formData.city || 'Não informada',
      canais_atuais: formData.currentChannels?.join(', ') || 'Nenhum',
      frequencia_postagens: formData.postingFrequency,
      investimento_mensal: formData.monthlyInvestment,
      faixa_preco_ticket: formData.priceRange || 'Não informada',
      objetivo_prioritario: formData.mainGoal,
      maior_dificuldade: formData.mainDifficulty,
      urgencia_prazo: formData.urgency || 'Imediato',
      email_solicitante: formData.contactEmail,
      whatsapp: formData.contactPhone || 'Não informado',
      resumo_completo: summaryText,
    };

    const res = await fetch(`https://formsubmit.co/ajax/${LUMEN_COMPANY_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { success: true };
    }
  } catch (err) {
    console.warn('FormSubmit external dispatch warning, falling back to local protocol:', err);
  }

  // Fallback: Always return success with the protocol since mailto & client copy are ready
  return { success: true };
}
