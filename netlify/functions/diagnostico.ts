import { GoogleGenAI } from '@google/genai';

const VALID_PRODUCT_SLUGS = [
  'diagnostico-plano-estrategico',
  'identidade-visual',
  'pack-artes-redes-sociais',
  'video-de-campanha',
  'landing-page',
  'lumen-continuo',
];

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
    const formData = JSON.parse(event.body || '{}');

    if (!formData.businessName || !formData.segment || !formData.whatItDoes) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'validation_error',
          message: 'Preencha os campos obrigatórios do Passo 1.',
        }),
      };
    }

    if (!formData.postingFrequency || !formData.monthlyInvestment) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'validation_error',
          message: 'Preencha os campos obrigatórios do Passo 2.',
        }),
      };
    }

    if (!formData.mainGoal || !formData.mainDifficulty || !formData.contactEmail || !formData.lgpdConsent) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'validation_error',
          message: 'Preencha os campos obrigatórios do Passo 3.',
        }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'missing_key',
          message: 'Chave GEMINI_API_KEY não configurada nas variáveis da Netlify.',
        }),
      };
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Você é um estrategista sênior de marketing da agência Lumen. Com base nos dados reais informados por um cliente potencial, produza um diagnóstico específico para o negócio dele — nunca genérico ou aplicável a qualquer empresa do mesmo segmento.

Dados do negócio:
- Nome: ${formData.businessName || 'Não informado'}
- O que faz: ${formData.whatItDoes || 'Não informado'}
- Segmento: ${formData.segment || 'Não informado'}
- Público-alvo: ${formData.targetAudience?.trim() ? formData.targetAudience : 'Não especificado'}
- Cidade/região: ${formData.city?.trim() ? formData.city : 'Não informada'}
- Canais ativos: ${Array.isArray(formData.currentChannels) && formData.currentChannels.length > 0 ? formData.currentChannels.join(', ') : 'Nenhum canal ativo informado'}
- Frequência de publicação/anúncio: ${formData.postingFrequency || 'Não informada'}
- Investimento mensal atual: ${formData.monthlyInvestment || 'Não informado'}
- Faixa de preço do produto/serviço: ${formData.priceRange?.trim() ? formData.priceRange : 'Não informada'}
- Objetivo prioritário: ${formData.mainGoal || 'Crescimento geral'}
- Maior dificuldade relatada: ${formData.mainDifficulty || 'Não informada'}

Responda APENAS com um JSON no formato:
{
  "notaGeral": número de 0 a 100,
  "notasPorPilar": {
    "estrategico": número de 0 a 100,
    "digital": número de 0 a 100,
    "publicidade": número de 0 a 100,
    "comunicacao": número de 0 a 100
  },
  "pontosFortes": [até 3 strings curtas, específicas ao que foi informado],
  "oportunidades": [até 3 strings curtas, específicas, nunca genéricas],
  "sloganSugerido": "string",
  "produtoRecomendado": "slug de um produto do catálogo da Lumen",
  "motivoRecomendacao": "string de 1 a 2 frases, citando algo que o cliente informou"
}

Regras: baseie cada nota e cada ponto no que foi efetivamente informado.
O campo "produtoRecomendado" DEVE ser estritamente um destes slugs:
- "diagnostico-plano-estrategico"
- "identidade-visual"
- "pack-artes-redes-sociais"
- "video-de-campanha"
- "landing-page"
- "lumen-continuo"`;

    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.35,
          },
        });

        const text = response.text?.trim() || '';
        const parsed = JSON.parse(text);

        if (
          typeof parsed.notaGeral === 'number' &&
          parsed.notasPorPilar &&
          typeof parsed.notasPorPilar.estrategico === 'number' &&
          typeof parsed.notasPorPilar.digital === 'number' &&
          typeof parsed.notasPorPilar.publicidade === 'number' &&
          typeof parsed.notasPorPilar.comunicacao === 'number' &&
          Array.isArray(parsed.pontosFortes) &&
          parsed.pontosFortes.length > 0 &&
          Array.isArray(parsed.oportunidades) &&
          parsed.oportunidades.length > 0 &&
          typeof parsed.sloganSugerido === 'string' &&
          typeof parsed.produtoRecomendado === 'string' &&
          typeof parsed.motivoRecomendacao === 'string'
        ) {
          let matchedSlug = parsed.produtoRecomendado.trim().toLowerCase();
          if (!VALID_PRODUCT_SLUGS.includes(matchedSlug)) {
            const found = VALID_PRODUCT_SLUGS.find((s) => matchedSlug.includes(s) || s.includes(matchedSlug));
            matchedSlug = found || 'diagnostico-plano-estrategico';
          }

          const result = {
            notaGeral: Math.max(0, Math.min(100, Math.round(parsed.notaGeral))),
            notasPorPilar: {
              estrategico: Math.max(0, Math.min(100, Math.round(parsed.notasPorPilar.estrategico))),
              digital: Math.max(0, Math.min(100, Math.round(parsed.notasPorPilar.digital))),
              publicidade: Math.max(0, Math.min(100, Math.round(parsed.notasPorPilar.publicidade))),
              comunicacao: Math.max(0, Math.min(100, Math.round(parsed.notasPorPilar.comunicacao))),
            },
            pontosFortes: parsed.pontosFortes.slice(0, 3).map((s: any) => String(s).trim()),
            oportunidades: parsed.oportunidades.slice(0, 3).map((s: any) => String(s).trim()),
            sloganSugerido: parsed.sloganSugerido.trim(),
            produtoRecomendado: matchedSlug,
            motivoRecomendacao: parsed.motivoRecomendacao.trim(),
            businessName: formData.businessName,
            segment: formData.segment,
            whatItDoes: formData.whatItDoes,
            contactEmail: formData.contactEmail,
            generatedAt: new Date().toISOString(),
            isAIGenerated: true,
          };

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result),
          };
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        error: 'ai_error',
        message: lastError?.message || 'Erro ao processar com a IA.',
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'internal_error', message: error?.message }),
    };
  }
};
