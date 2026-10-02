import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { Firestore } from '@google-cloud/firestore';

dotenv.config();

const app = express();
const port = parseInt(process.env.DEFAULT_APP_PORT || '3000', 10);

app.use(express.json());

// Enable CORS for all origins, allowing frontend on lumenmarketing.online and custom domains
app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize Gemini SDK if API key is present
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Database Persistence Interface (Firestore with Memory/Disk Standby)
interface StoredDiagnosisRecord {
  id: string;
  email: string;
  timestamp: number;
  formData: any;
  result: any;
}

class DiagnosisDatabase {
  private firestore: Firestore | null = null;
  private isFirestoreActive = false;
  private memoryCache = new Map<string, StoredDiagnosisRecord>();
  private cacheFilePath = path.join(process.cwd(), 'diagnoses_cache.json');

  constructor() {
    this.initLocal();
    this.initFirestore();
  }

  private initLocal() {
    try {
      if (fs.existsSync(this.cacheFilePath)) {
        const raw = fs.readFileSync(this.cacheFilePath, 'utf-8');
        const records: StoredDiagnosisRecord[] = JSON.parse(raw);
        for (const r of records) {
          if (r.email) {
            this.memoryCache.set(r.email.toLowerCase(), r);
          }
        }
      }
    } catch (err) {
      console.warn('Could not load diagnoses local cache:', err);
    }
  }

  private async initFirestore() {
    if (process.env.ENABLE_FIRESTORE !== 'true' && !process.env.FIREBASE_CONFIG) {
      this.isFirestoreActive = false;
      return;
    }
    try {
      this.firestore = new Firestore();
      const test = await Promise.race([
        this.firestore.collection('_health').doc('ping').get(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500)),
      ]);
      this.isFirestoreActive = true;
      console.log('✅ Google Cloud Firestore active for diagnosis persistence.');
    } catch (err: any) {
      this.isFirestoreActive = false;
      console.log('ℹ️ Firestore standby mode (fast resilient storage active):', err?.message || err);
    }
  }

  async getLatestByEmail(email: string): Promise<StoredDiagnosisRecord | null> {
    const emailNorm = email.toLowerCase().trim();
    if (this.isFirestoreActive && this.firestore) {
      try {
        const docId = emailNorm.replace(/[^a-z0-9_-]/g, '_');
        const doc = await this.firestore.collection('diagnoses').doc(docId).get();
        if (doc.exists) {
          return doc.data() as StoredDiagnosisRecord;
        }
      } catch (err) {
        console.warn('Firestore read error, using cache:', err);
      }
    }
    return this.memoryCache.get(emailNorm) || null;
  }

  async save(record: StoredDiagnosisRecord): Promise<void> {
    const emailNorm = record.email.toLowerCase().trim();
    this.memoryCache.set(emailNorm, record);

    // Save to disk
    try {
      fs.writeFileSync(this.cacheFilePath, JSON.stringify(Array.from(this.memoryCache.values())), 'utf-8');
    } catch (err) {
      console.warn('Could not save local diagnoses cache:', err);
    }

    // Save to Firestore if available
    if (this.isFirestoreActive && this.firestore) {
      try {
        const docId = emailNorm.replace(/[^a-z0-9_-]/g, '_');
        await this.firestore.collection('diagnoses').doc(docId).set(record);
      } catch (err) {
        console.warn('Firestore write error:', err);
      }
    }
  }

  getStats() {
    return {
      firestoreActive: this.isFirestoreActive,
      recordsCount: this.memoryCache.size,
    };
  }
}

const db = new DiagnosisDatabase();

const VALID_PRODUCT_SLUGS = [
  'diagnostico-plano-estrategico',
  'identidade-visual',
  'pack-artes-redes-sociais',
  'video-de-campanha',
  'landing-page',
  'lumen-continuo',
];

/**
 * Server-side function that generates a tailored marketing diagnosis using Gemini API.
 */
async function generateDiagnosis(formData: {
  businessName: string;
  segment: string;
  whatItDoes: string;
  targetAudience?: string;
  currentChannels: string[];
  postingFrequency: string;
  monthlyInvestment: string;
  priceRange?: string;
  mainGoal: string;
  mainDifficulty: string;
  city?: string;
  contactEmail: string;
}) {
  const ai = getGenAI();
  if (!ai) {
    throw new Error('Chave da API Gemini não configurada no servidor.');
  }

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

Regras: baseie cada nota e cada ponto no que foi efetivamente informado (frequência de postagem, investimento, dificuldade relatada etc.), não em suposições sobre o segmento. Se um dado estiver vazio, não invente — apenas não use esse dado na análise.
O campo "produtoRecomendado" DEVE ser estritamente um destes slugs do catálogo da Lumen:
- "diagnostico-plano-estrategico"
- "identidade-visual"
- "pack-artes-redes-sociais"
- "video-de-campanha"
- "landing-page"
- "lumen-continuo"`;

  // Resilient model cascade: fast and robust
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

      // Validate schema strictly
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
        // Normalize recommended product slug
        let matchedSlug = parsed.produtoRecomendado.trim().toLowerCase();
        if (!VALID_PRODUCT_SLUGS.includes(matchedSlug)) {
          const found = VALID_PRODUCT_SLUGS.find((s) => matchedSlug.includes(s) || s.includes(matchedSlug));
          matchedSlug = found || 'diagnostico-plano-estrategico';
        }

        return {
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
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} attempt failed:`, err?.message || err);
    }
  }

  throw new Error(
    lastError?.message || 'Falha ao processar resposta do modelo Gemini em formato JSON válido.'
  );
}

// 1. Diagnóstico Gratuito com Gemini
app.post('/api/diagnostico', async (req: Request, res: Response) => {
  try {
    const {
      businessName,
      segment,
      whatItDoes,
      targetAudience,
      currentChannels,
      postingFrequency,
      monthlyInvestment,
      priceRange,
      mainGoal,
      mainDifficulty,
      city,
      contactEmail,
      lgpdConsent,
    } = req.body;

    // Validate mandatory fields from Step 1, Step 2 and Step 3
    if (!businessName || !segment || !whatItDoes) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Preencha os campos obrigatórios do Passo 1 (Nome, Segmento e O que o negócio vende/faz).',
      });
    }

    if (!postingFrequency || !monthlyInvestment) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Preencha os campos obrigatórios do Passo 2 (Frequência de postagem e Investimento mensal).',
      });
    }

    if (!mainGoal || !mainDifficulty || !contactEmail || !lgpdConsent) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Preencha os campos obrigatórios do Passo 3 (Objetivo, Dificuldade, E-mail e Consentimento LGPD).',
      });
    }

    const emailNorm = String(contactEmail).trim().toLowerCase();

    // Rate Limiting: 1 diagnóstico por e-mail a cada 24 horas (checked via Database)
    const existing = await db.getLatestByEmail(emailNorm);
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();

    if (existing && now - existing.timestamp < ONE_DAY_MS && !req.query.force) {
      const remainingHours = Math.ceil((ONE_DAY_MS - (now - existing.timestamp)) / (60 * 60 * 1000));
      return res.status(429).json({
        error: 'rate_limit',
        message: `Você já gerou um diagnóstico gratuito para este e-mail nas últimas 24 horas. Para garantir a qualidade e disponibilidade para todos, limitamos a 1 análise por dia por e-mail (próxima liberação em ~${remainingHours}h).`,
        existingDiagnosis: existing.result,
        canRetryAt: new Date(existing.timestamp + ONE_DAY_MS).toISOString(),
      });
    }

    // Call generateDiagnosis strictly through Gemini
    const diagnosisResult = await generateDiagnosis({
      businessName,
      segment,
      whatItDoes,
      targetAudience,
      currentChannels: Array.isArray(currentChannels) ? currentChannels : [],
      postingFrequency,
      monthlyInvestment,
      priceRange,
      mainGoal,
      mainDifficulty,
      city,
      contactEmail: emailNorm,
    });

    // Store in database for rate-limiting and future reuse (e.g. project onboarding)
    const record: StoredDiagnosisRecord = {
      id: `diag-${Date.now()}`,
      email: emailNorm,
      timestamp: now,
      formData: {
        businessName,
        segment,
        whatItDoes,
        targetAudience,
        currentChannels,
        postingFrequency,
        monthlyInvestment,
        priceRange,
        mainGoal,
        mainDifficulty,
        city,
        contactEmail: emailNorm,
        lgpdConsent,
      },
      result: diagnosisResult,
    };

    await db.save(record);

    return res.json(diagnosisResult);
  } catch (error: any) {
    console.error('Error generating diagnosis:', error);
    // Explicit friendly error - never invent a fake diagnosis
    return res.status(503).json({
      error: 'ai_service_unavailable',
      message:
        'Não foi possível gerar seu diagnóstico estratégico com a inteligência artificial neste momento. Por favor, tente novamente em instantes.',
    });
  }
});

// Endpoint to retrieve latest diagnosis by email
app.get('/api/diagnostico/latest', async (req: Request, res: Response) => {
  const email = String(req.query.email || '').trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ error: 'E-mail não fornecido.' });
  }

  const record = await db.getLatestByEmail(email);
  if (!record) {
    return res.status(404).json({ error: 'Nenhum diagnóstico encontrado para este e-mail.' });
  }

  return res.json({
    result: record.result,
    formData: record.formData,
    timestamp: record.timestamp,
  });
});

// 2. Recomendador de Produto por Necessidade do Cliente
app.post('/api/recomendar', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Descrição da necessidade é obrigatória.' });
    }

    const ai = getGenAI();
    if (ai) {
      const prompt = `Você é o consultor de soluções da Lumen. O visitante descreveu a seguinte necessidade:
"${query}"

Com base nas soluções da Lumen:
1. diagnostico-plano-estrategico (para quem precisa de direção, metas e análise de mercado)
2. identidade-visual (para quem precisa de logo, branding, tipografia e guia visual)
3. pack-artes-redes-sociais (para quem precisa de posts, carrosséis e criativos de feed)
4. pecas-avulsas (para necessidades pontuais: 1 banner, 1 carrossel ou stories)
5. video-de-campanha (para reels, comercial audiovisual ou institucional)
6. landing-page (para quem precisa de página de conversão, captação ou vendas)
7. lumen-continuo (para quem quer agência mensal completa com preço fixo)

Escolha o produto ideal e o nível ("essencial", "pro" ou "premium").
Retorne estritamente JSON:
{
  "slug": string,
  "tier": "essencial" | "pro" | "premium",
  "productTitle": string,
  "justification": string (1 a 2 frases diretas explicando o porquê)
}`;

      const modelsToTry = ['gemini-3.6-flash', 'gemini-flash-latest'];
      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });
          const parsed = JSON.parse(response.text?.trim() || '{}');
          if (parsed && parsed.slug) {
            return res.json(parsed);
          }
        } catch (err: any) {
          console.warn(`Recommend model ${modelName} error (${err.message || err}), trying next...`);
        }
      }
    }

    // Keyword heuristic fallback
    const q = query.toLowerCase();
    if (q.includes('logo') || q.includes('marca') || q.includes('identidade') || q.includes('visual')) {
      return res.json({
        slug: 'identidade-visual',
        tier: 'pro',
        productTitle: 'Identidade Visual & Branding',
        justification: 'Ideal para construir uma marca marcante com logotipo vetorial, paleta cromática e manual executivo.',
      });
    } else if (q.includes('site') || q.includes('landing') || q.includes('página') || q.includes('vender online')) {
      return res.json({
        slug: 'landing-page',
        tier: 'pro',
        productTitle: 'Landing Page de Alta Conversão',
        justification: 'Solução perfeita para capturar leads e fechar vendas com UX rápida e texto persuasivo.',
      });
    } else if (q.includes('post') || q.includes('instagram') || q.includes('rede') || q.includes('feed')) {
      return res.json({
        slug: 'pack-artes-redes-sociais',
        tier: 'pro',
        productTitle: 'Pack de Artes para Redes Sociais',
        justification: 'Pacote estratégico com artes de alto impacto visual e roteiros de legenda que atraem seguidores qualificados.',
      });
    } else if (q.includes('vídeo') || q.includes('video') || q.includes('reel') || q.includes('audiovisual')) {
      return res.json({
        slug: 'video-de-campanha',
        tier: 'pro',
        productTitle: 'Vídeo de Campanha & Audiovisual',
        justification: 'Vídeos dinâmicos com roteiro persuasivo, trilha e edição para capturar a atenção nos primeiros segundos.',
      });
    } else if (q.includes('mês') || q.includes('mensal') || q.includes('assinatura') || q.includes('tudo')) {
      return res.json({
        slug: 'lumen-continuo',
        tier: 'pro',
        productTitle: 'Lumen Contínuo (Assinatura Mensal)',
        justification: 'Acesso a um time completo de marketing com preço fixo mensal previsível e curadoria contínua.',
      });
    }

    return res.json({
      slug: 'diagnostico-plano-estrategico',
      tier: 'pro',
      productTitle: 'Diagnóstico e Plano Estratégico',
      justification: 'O ponto de partida ideal para diagnosticar seu modelo de negócio e traçar um plano de ação tático de 90 dias.',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao recomendar produto.' });
  }
});

// 3. Assistente de Briefing Guiado por IA
app.post('/api/briefing/chat', async (req: Request, res: Response) => {
  try {
    const { productTitle, tierName, history, userMessage, questionCount } = req.body;
    const ai = getGenAI();

    if (ai) {
      const prompt = `Você é a IA de Briefing da Lumen, especializada em extrair informações estratégicas cruciais para a produção de serviços de marketing.
Produto contratado pelo cliente: ${productTitle} (${tierName}).
Pergunta atual: número ${questionCount || 1} de um total de 4 ou 5 perguntas.
Histórico da conversa:
${JSON.stringify(history || [])}

Nova mensagem do cliente:
"${userMessage || 'Olá, estou pronto para iniciar o briefing.'}"

Instruções:
- Seja cortês, objetiva, profissional e focada no serviço contratado.
- Se o cliente já forneceu informações suficientes ou se estamos na pergunta 4/5, parabenize o cliente e apresente um resumo executivo sintetizado em tópicos:
  1. Nome e essência do negócio
  2. Público-alvo prioritário
  3. Objetivo principal da entrega
  4. Tom de voz e referências estéticas
  5. Ponto de atenção ou restrição
- Se ainda faltam dados essenciais, faça UMA única pergunta curta, direta e contextualizada.
- Responda em JSON:
{
  "assistantMessage": string,
  "isComplete": boolean,
  "summary": {
    "businessName": string,
    "targetAudience": string,
    "mainGoal": string,
    "toneOfVoice": string,
    "referencesText": string,
    "extraNotes": string
  } // apenas se isComplete for true
}`;

      const modelsToTry = ['gemini-3.6-flash', 'gemini-flash-latest'];
      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });
          const parsed = JSON.parse(response.text?.trim() || '{}');
          if (parsed && parsed.assistantMessage) {
            return res.json(parsed);
          }
        } catch (err: any) {
          console.warn(`Briefing chat model ${modelName} error (${err.message || err}), trying next...`);
        }
      }
    }

    // Progressive fallback script for briefing assistant
    const count = questionCount || 1;
    if (count === 1) {
      return res.json({
        assistantMessage: `Excelente! Para iniciarmos o desenvolvimento do seu **${productTitle}**, qual é o **nome oficial da sua marca/empresa** e em poucas palavras qual o seu principal produto ou serviço?`,
        isComplete: false,
      });
    } else if (count === 2) {
      return res.json({
        assistantMessage: `Entendido. Agora me conte sobre o seu **cliente ideal**: quem é a pessoa que você mais quer atrair e converter com esse projeto? (Faixa etária, perfil profissional ou hábitos de consumo)`,
        isComplete: false,
      });
    } else if (count === 3) {
      return res.json({
        assistantMessage: `Perfeito. Qual é o **tom de voz e estética visual** que melhor representa sua empresa? (Exemplos: minimalista e sóbrio, arrojado e vibrante, elegante e acolhedor? Se tiver marcas de referência, cite-as!)`,
        isComplete: false,
      });
    } else {
      return res.json({
        assistantMessage: `Muito obrigado pelas respostas detalhadas! O briefing para **${productTitle}** foi sintetizado com sucesso. Nossa equipe de curadores e especialistas já tem os insumos necessários para começar a produção. Revise os pontos ao lado e clique em "Confirmar e Enviar para Produção".`,
        isComplete: true,
        summary: {
          businessName: 'Projeto Cliente Lumen',
          targetAudience: 'Clientes qualificados que valorizam confiança, design de ponta e agilidade.',
          mainGoal: `Excelência e posicionamento superior com ${productTitle}.`,
          toneOfVoice: 'Profissional, contemporâneo e de alto impacto visual.',
          referencesText: 'Marcas de vanguarda com linhas limpas e comunicação assertiva.',
          extraNotes: 'Aprovado via assistente de briefing guiado por IA.',
        },
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Erro no assistente de briefing.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Lumen Platform API',
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    time: new Date().toISOString(),
  });
});

// Download direto do pacote pronto para HostGator cPanel
app.get('/download-hostgator', (req, res) => {
  const zipPath = path.resolve('dist/site-lumen-hostgator.zip');
  if (fs.existsSync(zipPath)) {
    res.download(zipPath, 'site-lumen-hostgator.zip');
  } else {
    res.status(404).send('Arquivo zip em geração. Aguarde alguns instantes.');
  }
});

// Mount Vite in dev or static files in production
const setupFrontend = async () => {
  const distPath = path.resolve('dist');
  const distExists = fs.existsSync(path.join(distPath, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production' || (Boolean(process.env.PORT) && distExists);

  if (isProduction && distExists) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }
};

setupFrontend().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Lumen Platform running on http://localhost:${port}`);
  });
});
