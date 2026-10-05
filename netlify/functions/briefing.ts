import { sendBriefingEmails, BriefingPayload } from '../../src/server/resendService';

function generateProtocol(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `LUM-${yy}${mm}${dd}-${rand}`;
}

export const handler = async (event: any) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const formData: BriefingPayload = body.formData || body;
    const protocol = body.protocol || generateProtocol();

    if (!formData.businessName || !formData.segment || !formData.whatItDoes || !formData.contactEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'validation_error',
          message: 'Campos obrigatórios incompletos (Empresa, Segmento, Descrição e E-mail).',
        }),
      };
    }

    const emailResult = await sendBriefingEmails(formData, protocol);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        protocol,
        clientSent: emailResult.clientSent,
        teamSent: emailResult.teamSent,
        message: 'Mini-briefing processado com sucesso pelo backend da Lumen.',
      }),
    };
  } catch (error: any) {
    console.error('Netlify function error in briefing handler:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'internal_error',
        message: error?.message || 'Falha interna ao processar o briefing.',
      }),
    };
  }
};
