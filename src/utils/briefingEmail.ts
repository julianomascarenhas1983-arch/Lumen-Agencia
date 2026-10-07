import { DiagnosticoFormData } from '../types';
import { LUMEN_WHATSAPP_NUMBER } from './whatsapp';

export const LUMEN_COMPANY_EMAIL = 'atendimento@lumenmarketing.online';

export function generateBriefingProtocol(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `LUM-${dateStr}-${randomSuffix}`;
}

export function formatBriefingSummaryText(
  formData: DiagnosticoFormData,
  protocol: string,
  lang: 'pt' | 'en' = 'pt'
): string {
  const isEn = lang === 'en';
  const channels = formData.currentChannels?.length
    ? formData.currentChannels.join(', ')
    : isEn ? 'None reported' : 'Nenhum informado';

  if (isEn) {
    return `========================================================
LUMEN VIRTUAL AGENCY | STRATEGIC MINI-BRIEFING
Protocol: ${protocol}
Date/Time: ${new Date().toLocaleString('en-US')}
========================================================

1. BUSINESS PROFILE
- Company / Brand Name: ${formData.businessName || 'Not informed'}
- Contact Name / Title: ${formData.contactName || 'Not informed'}
- Market Segment / Industry: ${formData.segment || 'Not informed'}
- Core Product / Service: ${formData.whatItDoes || 'Not informed'}
- Primary Target Audience: ${formData.targetAudience?.trim() || 'Not specified'}
- Location (City / State / Country): ${formData.city?.trim() || 'Not informed'}

2. CURRENT PRESENCE & CHANNELS
- Active Marketing Channels: ${channels}
- Publishing / Ad Frequency: ${formData.postingFrequency || 'Not informed'}
- Current Monthly Marketing Budget: ${formData.monthlyInvestment || 'Not informed'}
- Average Ticket / Price Range: ${formData.priceRange?.trim() || 'Not informed'}

3. GOALS & BOTTLENECKS
- #1 Priority Goal (Next 90 Days): ${formData.mainGoal || 'Not informed'}
- Biggest Challenge / Marketing Bottleneck: ${formData.mainDifficulty || 'Not informed'}
- Implementation Urgency: ${formData.urgency || 'Immediate (next 15-30 days)'}

4. CONTACT DETAILS
- Professional Email: ${formData.contactEmail}
- Business Phone / WhatsApp: ${formData.contactPhone || 'Not informed'}
- Routed To: ${LUMEN_COMPANY_EMAIL}
- Data Privacy Consent: Confirmed by submitter

========================================================
This strategic mini-briefing was generated via Lumen Virtual Agency.
Our executive strategy directors will review your data and respond within 24h.
========================================================`;
  }

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

export function createMailtoUrl(
  formData: DiagnosticoFormData,
  protocol: string,
  lang: 'pt' | 'en' = 'pt'
): string {
  const isEn = lang === 'en';
  const subjectText = isEn
    ? `[Lumen Mini-Briefing] ${formData.businessName} - Protocol ${protocol}`
    : `[Mini-Briefing Lumen] ${formData.businessName} - Protocolo ${protocol}`;
  const subject = encodeURIComponent(subjectText);
  const body = encodeURIComponent(formatBriefingSummaryText(formData, protocol, lang));
  const cc = encodeURIComponent(formData.contactEmail.trim());

  return `mailto:${LUMEN_COMPANY_EMAIL}?cc=${cc}&subject=${subject}&body=${body}`;
}

export function createWhatsAppBriefingUrl(
  formData: DiagnosticoFormData,
  protocol: string,
  lang: 'pt' | 'en' = 'pt'
): string {
  const isEn = lang === 'en';
  const text = isEn
    ? encodeURIComponent(
        `Hello Lumen team! I just submitted the Strategic Mini-Briefing for my business *${formData.businessName}*.\n\n` +
        `📋 *Protocol:* ${protocol}\n` +
        `👤 *Contact:* ${formData.contactName || 'Lead'}\n` +
        `🎯 *Primary Goal:* ${formData.mainGoal}\n` +
        `📧 *Email:* ${formData.contactEmail}\n\n` +
        `Looking forward to confirming receipt and scheduling our strategic review.`
      )
    : encodeURIComponent(
        `Olá, equipe Lumen! Acabei de enviar o Mini-Briefing Estratégico da minha empresa *${formData.businessName}*.\n\n` +
        `📋 *Protocolo:* ${protocol}\n` +
        `👤 *Responsável:* ${formData.contactName || 'Responsável'}\n` +
        `🎯 *Objetivo:* ${formData.mainGoal}\n` +
        `📧 *E-mail:* ${formData.contactEmail}\n\n` +
        `Gostaria de confirmar o recebimento e acelerar a análise.`
      );

  return `https://wa.me/${LUMEN_WHATSAPP_NUMBER}?text=${text}`;
}

export interface SubmitBriefingResult {
  success: boolean;
  needsActivation?: boolean;
  message?: string;
}

export async function submitBriefingEmail(
  formData: DiagnosticoFormData,
  protocol: string,
  lang: 'pt' | 'en' = 'pt'
): Promise<SubmitBriefingResult> {
  const isEn = lang === 'en';
  const summaryText = formatBriefingSummaryText(formData, protocol, lang);
  let needsActivation = false;

  // 1. Submit to Netlify Forms (native if deployed on Netlify)
  try {
    const encodeForm = (data: Record<string, string>) =>
      Object.keys(data)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');

    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeForm({
        'form-name': 'mini-briefing',
        protocol,
        language: lang,
        empresa: formData.businessName,
        responsavel: formData.contactName || '',
        email_solicitante: formData.contactEmail,
        whatsapp: formData.contactPhone || '',
        segmento: formData.segment,
        o_que_faz: formData.whatItDoes,
        publico_alvo: formData.targetAudience || '',
        cidade_estado: formData.city || '',
        canais_atuais: formData.currentChannels?.join(', ') || '',
        frequencia_postagens: formData.postingFrequency,
        investimento_mensal: formData.monthlyInvestment,
        faixa_preco_ticket: formData.priceRange || '',
        objetivo_prioritario: formData.mainGoal,
        maior_dificuldade: formData.mainDifficulty,
        urgencia_prazo: formData.urgency || '',
        resumo_completo: summaryText,
      }),
    });
  } catch {
    // Continue
  }

  // 2. Submit to local Express backend (if running)
  try {
    await fetch('/api/enviar-briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        protocol,
        language: lang,
        formData,
        targetEmail: LUMEN_COMPANY_EMAIL,
        summaryText,
      }),
    });
  } catch {
    // Continue
  }

  // 3. Submit to HostGator PHP backend (if on Apache / cPanel)
  let phpSent = false;
  try {
    const phpRes = await fetch('/api/enviar-briefing.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        protocol,
        language: lang,
        formData,
        summaryText,
      }),
    });
    if (phpRes.ok) {
      phpSent = true;
    }
  } catch {
    // Continue
  }

  if (!phpSent) {
    try {
      await fetch('/api/diagnostico/index.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocol,
          language: lang,
          formData,
          summaryText,
        }),
      });
    } catch {
      // Continue
    }
  }

  // 4. Submit via FormSubmit AJAX service (fallback)
  try {
    const subject = isEn
      ? `[Lumen Mini-Briefing] New Strategic Audit - ${formData.businessName} (${protocol})`
      : `[Mini-Briefing Lumen] Novo Diagnóstico - ${formData.businessName} (${protocol})`;

    const autoresponse = isEn
      ? `Hello, ${formData.contactName || formData.businessName}!\n\nWe have successfully received your Strategic Mini-Briefing for ${formData.businessName} (Protocol: ${protocol}).\n\nOur senior creative and marketing strategists at Lumen Virtual Agency have begun reviewing your business profile and challenges. We will contact you at your email (${formData.contactEmail})${formData.contactPhone ? ` or WhatsApp (${formData.contactPhone})` : ''} within 24 business hours.\n\nBest regards,\nLumen Client Care Team\natendimento@lumenmarketing.online`
      : `Olá, ${formData.contactName || formData.businessName}!\n\nConfirmamos o recebimento com sucesso do seu Mini-Briefing Estratégico na Lumen Agência Virtual (Protocolo: ${protocol}).\n\nNossa equipe de estratégia e curadoria já iniciou o estudo do seu segmento e desafios. Entraremos em contato pelo seu e-mail (${formData.contactEmail})${formData.contactPhone ? ` ou WhatsApp (${formData.contactPhone})` : ''} em até 24 horas úteis.\n\nAtenciosamente,\nAtendimento Lumen\natendimento@lumenmarketing.online`;

    const payload = {
      _from: 'Atendimento Lumen',
      _subject: subject,
      _replyto: formData.contactEmail,
      _cc: formData.contactEmail,
      _template: 'box',
      _autoresponse: autoresponse,
      protocolo: protocol,
      idioma: lang,
      empresa: formData.businessName,
      responsavel: formData.contactName || 'Not informed',
      segmento: formData.segment,
      o_que_faz: formData.whatItDoes,
      publico_alvo: formData.targetAudience || 'Not specified',
      cidade_estado: formData.city || 'Not informed',
      canais_atuais: formData.currentChannels?.join(', ') || 'None',
      frequencia_postagens: formData.postingFrequency,
      investimento_mensal: formData.monthlyInvestment,
      faixa_preco_ticket: formData.priceRange || 'Not informed',
      objetivo_prioritario: formData.mainGoal,
      maior_dificuldade: formData.mainDifficulty,
      urgencia_prazo: formData.urgency || 'Immediate',
      email_solicitante: formData.contactEmail,
      whatsapp: formData.contactPhone || 'Not informed',
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

    const data = await res.json();
    if (data?.message && typeof data.message === 'string' && data.message.includes('Activation')) {
      needsActivation = true;
    }
  } catch (err) {
    console.warn('FormSubmit dispatch warning:', err);
  }

  return { success: true, needsActivation };
}
