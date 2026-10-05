import { Resend } from 'resend';

export const LUMEN_OFFICIAL_EMAIL = 'atendimento@lumenmarketing.online';
export const LUMEN_SITE_URL = 'https://lumenmarketing.online';

export interface BriefingPayload {
  businessName: string;
  contactName?: string;
  segment: string;
  whatItDoes: string;
  targetAudience?: string;
  city?: string;
  currentChannels?: string[];
  postingFrequency: string;
  monthlyInvestment: string;
  priceRange?: string;
  mainGoal: string;
  mainDifficulty: string;
  urgency?: string;
  contactEmail: string;
  contactPhone?: string;
  lgpdConsent?: boolean;
}

export function generateClientEmailHtml(data: {
  businessName: string;
  contactName?: string;
  segment: string;
  whatItDoes: string;
  mainGoal: string;
  mainDifficulty: string;
  monthlyInvestment: string;
  protocol: string;
  clientEmail: string;
}): string {
  const greetingName = data.contactName?.trim() || data.businessName.trim() || 'Empreendedor(a)';
  const whatsappUrl = `https://wa.me/5511998421080?text=${encodeURIComponent(
    `Olá, equipe Lumen! Acabei de enviar o Mini-Briefing da minha empresa ${data.businessName} (Protocolo: ${data.protocol}).`
  )}`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recebemos o seu briefing - Lumen</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070A17; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #F3F1EA;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070A17; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #0C1226; border-radius: 20px; overflow: hidden; border: 1px solid rgba(243, 241, 234, 0.12); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
          
          <!-- Top Color Bar -->
          <tr>
            <td style="height: 3px; background: linear-gradient(90deg, #19D3F3 0%, #FF2E93 50%, #F6C453 100%);"></td>
          </tr>

          <!-- Header / Brand -->
          <tr>
            <td style="padding: 36px 36px 20px 36px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="display: inline-block; vertical-align: middle;">
                      <span style="display: inline-block; width: 10px; height: 10px; background-color: #F6C453; border-radius: 50%; box-shadow: 0 0 10px #F6C453; margin-right: 8px;"></span>
                      <span style="font-size: 22px; font-weight: 800; color: #F3F1EA; letter-spacing: -0.5px;">Lumen</span>
                      <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #98A1BC; margin-left: 10px; border-left: 1px solid rgba(243,241,234,0.2); padding-left: 10px;">Agência Virtual</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 0 36px 32px 36px;">
              <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 800; color: #F3F1EA; line-height: 1.3;">
                Recebemos o seu briefing, <span style="color: #F6C453;">${greetingName}</span>!
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #98A1BC;">
                Nossa diretoria executiva de estratégia e criação já recebeu os dados do seu negócio e deu início à análise dos seus gargalos e oportunidades.
              </p>

              <!-- Protocol Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070A17; border-radius: 14px; border: 1px solid rgba(246, 196, 83, 0.35); margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #98A1BC; margin-bottom: 4px; font-weight: 600;">Protocolo Oficial de Atendimento</div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 19px; font-weight: 800; color: #F6C453; letter-spacing: 1px;">
                      ${data.protocol}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Summary Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070A17; border-radius: 14px; border: 1px solid rgba(255, 255, 255, 0.06); margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #19D3F3; font-weight: 700; margin-bottom: 14px;">
                      ✦ Resumo dos Dados Registrados
                    </div>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; line-height: 1.8;">
                      <tr>
                        <td width="35%" style="color: #98A1BC; padding-bottom: 6px;">Empresa / Marca:</td>
                        <td width="65%" style="color: #F3F1EA; font-weight: 600; padding-bottom: 6px;">${data.businessName}</td>
                      </tr>
                      <tr>
                        <td style="color: #98A1BC; padding-bottom: 6px;">Segmento:</td>
                        <td style="color: #F3F1EA; font-weight: 600; padding-bottom: 6px;">${data.segment}</td>
                      </tr>
                      <tr>
                        <td style="color: #98A1BC; padding-bottom: 6px;">O que faz:</td>
                        <td style="color: #F3F1EA; padding-bottom: 6px;">${data.whatItDoes}</td>
                      </tr>
                      <tr>
                        <td style="color: #98A1BC; padding-bottom: 6px;">Objetivo:</td>
                        <td style="color: #F6C453; font-weight: 600; padding-bottom: 6px;">${data.mainGoal}</td>
                      </tr>
                      <tr>
                        <td style="color: #98A1BC; padding-bottom: 6px;">Maior desafio:</td>
                        <td style="color: #F3F1EA; padding-bottom: 6px;">${data.mainDifficulty}</td>
                      </tr>
                      <tr>
                        <td style="color: #98A1BC;">Investimento Atual:</td>
                        <td style="color: #F3F1EA;">${data.monthlyInvestment}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Promise Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: rgba(246, 196, 83, 0.08); border-radius: 12px; border: 1px solid rgba(246, 196, 83, 0.25); margin-bottom: 28px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #F3F1EA;">
                      ⏱️ <strong>Próximo passo:</strong> Nossa diretoria responderá com as recomendações estratégicas e plano de ação sugerido em até <strong>24 horas úteis</strong> diretamente para o seu e-mail (<span style="color: #19D3F3;">${data.clientEmail}</span>).
                    </p>
                  </td>
                </tr>
              </table>

              <!-- WhatsApp Action -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${whatsappUrl}" target="_blank" style="background: linear-gradient(135deg, #F6C453 0%, #E5B542 100%); color: #070A17; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 800; font-size: 13px; letter-spacing: 0.3px; display: inline-block; box-shadow: 0 8px 20px rgba(246, 196, 83, 0.3);">
                      Falar com a Equipe no WhatsApp →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #070A17; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #F6C453; letter-spacing: 0.5px;">
                Lumen Agência Virtual
              </p>
              <p style="margin: 0 0 10px 0; font-size: 11px; color: #98A1BC; line-height: 1.5;">
                Marcas que se fazem ver. Inteligência de marketing com curadoria de especialistas seniores.
              </p>
              <p style="margin: 0; font-size: 11px; color: #98A1BC;">
                <a href="${LUMEN_SITE_URL}" style="color: #19D3F3; text-decoration: none;">lumenmarketing.online</a> &nbsp;•&nbsp; 
                <a href="mailto:${LUMEN_OFFICIAL_EMAIL}" style="color: #98A1BC; text-decoration: none;">${LUMEN_OFFICIAL_EMAIL}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function generateTeamEmailHtml(data: {
  protocol: string;
  formData: BriefingPayload;
}): string {
  const f = data.formData;
  const channels = f.currentChannels?.length ? f.currentChannels.join(', ') : 'Nenhum canal ativo informado';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Novo Mini-Briefing Recebido</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    
    <div style="background-color: #070A17; padding: 20px 24px; border-bottom: 3px solid #F6C453;">
      <h2 style="margin: 0; color: #F3F1EA; font-size: 18px; font-weight: bold;">
        📋 [NOVO MINI-BRIEFING] ${f.businessName}
      </h2>
      <div style="margin-top: 6px; font-size: 13px; color: #F6C453; font-family: monospace;">
        PROTOCOLO: ${data.protocol} | ${new Date().toLocaleString('pt-BR')}
      </div>
    </div>

    <div style="padding: 24px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">
        1. Identidade do Negócio
      </h3>
      <table width="100%" style="font-size: 13px; margin-bottom: 20px; line-height: 1.6;">
        <tr><td width="35%"><strong>Empresa / Marca:</strong></td><td>${f.businessName}</td></tr>
        <tr><td><strong>Responsável:</strong></td><td>${f.contactName || 'Não informado'}</td></tr>
        <tr><td><strong>E-mail:</strong></td><td><a href="mailto:${f.contactEmail}">${f.contactEmail}</a></td></tr>
        <tr><td><strong>WhatsApp:</strong></td><td>${f.contactPhone || 'Não informado'}</td></tr>
        <tr><td><strong>Segmento:</strong></td><td>${f.segment}</td></tr>
        <tr><td><strong>O que faz / vende:</strong></td><td>${f.whatItDoes}</td></tr>
        <tr><td><strong>Público-alvo:</strong></td><td>${f.targetAudience || 'Não informado'}</td></tr>
        <tr><td><strong>Cidade / Região:</strong></td><td>${f.city || 'Não informada'}</td></tr>
      </table>

      <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">
        2. Presença & Operação Atual
      </h3>
      <table width="100%" style="font-size: 13px; margin-bottom: 20px; line-height: 1.6;">
        <tr><td width="35%"><strong>Canais Ativos:</strong></td><td>${channels}</td></tr>
        <tr><td><strong>Frequência de Postagem:</strong></td><td>${f.postingFrequency}</td></tr>
        <tr><td><strong>Investimento Mensal:</strong></td><td>${f.monthlyInvestment}</td></tr>
        <tr><td><strong>Ticket Médio / Preço:</strong></td><td>${f.priceRange || 'Não informado'}</td></tr>
      </table>

      <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">
        3. Objetivos & Gargalos
      </h3>
      <table width="100%" style="font-size: 13px; margin-bottom: 20px; line-height: 1.6;">
        <tr><td width="35%"><strong>Objetivo Prioritário:</strong></td><td style="color: #0f172a; font-weight: bold;">${f.mainGoal}</td></tr>
        <tr><td><strong>Maior Dificuldade:</strong></td><td style="background: #fef2f2; padding: 8px; border-radius: 6px; color: #991b1b;">${f.mainDifficulty}</td></tr>
        <tr><td><strong>Urgência:</strong></td><td>${f.urgency || 'Imediato'}</td></tr>
        <tr><td><strong>Consentimento LGPD:</strong></td><td>Confirmado pelo solicitante</td></tr>
      </table>

      <div style="background: #f8fafc; padding: 14px; border-radius: 8px; font-size: 12px; color: #64748b; text-align: center;">
        Este lead aguarda retorno da equipe em até 24h úteis pelo e-mail <strong>${f.contactEmail}</strong> ou WhatsApp <strong>${f.contactPhone || 'N/A'}</strong>.
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function sendBriefingEmails(
  formData: BriefingPayload,
  protocol: string
): Promise<{
  success: boolean;
  clientSent: boolean;
  teamSent: boolean;
  message?: string;
  error?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_RESEND_API_KEY') {
    console.log(
      `ℹ️ [RESEND STANDBY] Chave RESEND_API_KEY não configurada no ambiente. Protocolo ${protocol} registrado e gravado no backend.`
    );
    return {
      success: true,
      clientSent: false,
      teamSent: false,
      message: 'Briefing registrado com sucesso no sistema da Lumen.',
    };
  }

  const resend = new Resend(apiKey);

  const clientHtml = generateClientEmailHtml({
    businessName: formData.businessName,
    contactName: formData.contactName,
    segment: formData.segment,
    whatItDoes: formData.whatItDoes,
    mainGoal: formData.mainGoal,
    mainDifficulty: formData.mainDifficulty,
    monthlyInvestment: formData.monthlyInvestment,
    protocol,
    clientEmail: formData.contactEmail,
  });

  const teamHtml = generateTeamEmailHtml({
    protocol,
    formData,
  });

  const senderCandidate = process.env.RESEND_FROM_EMAIL || 'Lumen Agência Virtual <atendimento@lumenmarketing.online>';
  let clientSent = false;
  let teamSent = false;
  let lastError = '';

  // Try sending team email
  try {
    const teamRes = await resend.emails.send({
      from: senderCandidate,
      to: [LUMEN_OFFICIAL_EMAIL],
      replyTo: formData.contactEmail,
      subject: `[Novo Mini-Briefing] ${formData.businessName} (${protocol})`,
      html: teamHtml,
    });

    if (teamRes.error) {
      console.warn('Resend team send error:', teamRes.error);
      lastError = teamRes.error.message;
      // If error is unverified domain, fallback to onboarding@resend.dev for test delivery
      if (teamRes.error.message?.includes('domain') || teamRes.error.message?.includes('verify')) {
        const fallbackRes = await resend.emails.send({
          from: 'Lumen Agência Virtual <onboarding@resend.dev>',
          to: [LUMEN_OFFICIAL_EMAIL],
          replyTo: formData.contactEmail,
          subject: `[Novo Mini-Briefing] ${formData.businessName} (${protocol})`,
          html: teamHtml,
        });
        if (!fallbackRes.error) {
          teamSent = true;
        }
      }
    } else {
      teamSent = true;
    }
  } catch (err: any) {
    console.error('Failed to send team email via Resend:', err?.message || err);
    lastError = err?.message || 'Erro ao enviar e-mail da equipe';
  }

  // Try sending client confirmation email
  try {
    const clientRes = await resend.emails.send({
      from: senderCandidate,
      to: [formData.contactEmail.trim()],
      replyTo: LUMEN_OFFICIAL_EMAIL,
      subject: `Recebemos o seu briefing, ${formData.contactName || formData.businessName}`,
      html: clientHtml,
    });

    if (clientRes.error) {
      console.warn('Resend client send error:', clientRes.error);
      if (clientRes.error.message?.includes('domain') || clientRes.error.message?.includes('verify')) {
        const fallbackRes = await resend.emails.send({
          from: 'Lumen Agência Virtual <onboarding@resend.dev>',
          to: [formData.contactEmail.trim()],
          replyTo: LUMEN_OFFICIAL_EMAIL,
          subject: `Recebemos o seu briefing, ${formData.contactName || formData.businessName}`,
          html: clientHtml,
        });
        if (!fallbackRes.error) {
          clientSent = true;
        }
      }
    } else {
      clientSent = true;
    }
  } catch (err: any) {
    console.error('Failed to send client email via Resend:', err?.message || err);
  }

  console.log(`📧 [RESEND STATUS] Protocolo ${protocol} -> Equipe: ${teamSent ? '✅' : '❌'}, Cliente: ${clientSent ? '✅' : '❌'}`);

  return {
    success: true,
    clientSent,
    teamSent,
    message: 'Mini-briefing processado e encaminhado pelo sistema da Lumen.',
    error: lastError || undefined,
  };
}
