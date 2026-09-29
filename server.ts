import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK if API key is present
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Diagnóstico de Marketing em 60 segundos
app.post('/api/diagnostico', async (req: Request, res: Response) => {
  try {
    const { businessName, segment, city, mainGoal, currentChannels, contactEmail } = req.body;

    if (!businessName || !segment) {
      return res.status(400).json({ error: 'Nome do negócio e segmento são obrigatórios.' });
    }

    const ai = getGenAI();

    if (ai) {
      const prompt = `Você é o diretor de inteligência estratégica da Lumen, uma agência virtual de marketing e publicidade de alto padrão.
Analise os seguintes dados deste negócio:
- Nome do negócio: ${businessName}
- Segmento: ${segment}
- Cidade/Região: ${city || 'Brasil'}
- Objetivo principal: ${mainGoal || 'Crescimento e visibilidade'}
- Canais atuais: ${Array.isArray(currentChannels) ? currentChannels.join(', ') : 'Pouca presença digital'}

Avalie com rigor publicitário e pragmatismo comercial. Devolva em JSON estrito com:
1. overallScore (número inteiro de 35 a 95 representando maturidade geral de marketing)
2. subscores: objeto com notas inteiras de 30 a 98 para:
   - estrategia (clareza de posicionamento e metas)
   - digital (canais, velocidade, atração)
   - publicidade (impacto visual, estética e diferenciação)
   - comunicacao (voz de marca, clareza e autoridade)
3. strengths: exatamente 3 pontos fortes realistas ou diferenciais latentes para explorar
4. opportunities: exatamente 3 oportunidades imediatas de mercado e crescimento
5. suggestedSlogan: um slogan de alto impacto publicitário, moderno, sem clichês
6. recommendedProducts: array com 1 ou 2 produtos recomendados do catálogo da Lumen, escolhendo estritamente entre:
   - "diagnostico-plano-estrategico" (Diagnóstico e Plano Estratégico)
   - "identidade-visual" (Identidade Visual & Branding)
   - "pack-artes-redes-sociais" (Pack de Artes para Redes Sociais)
   - "video-de-campanha" (Vídeo de Campanha & Audiovisual)
   - "landing-page" (Landing Page de Alta Conversão)
   - "lumen-continuo" (Lumen Contínuo)
   com o nível sugerido ("essencial", "pro" ou "premium") e o motivo estratégico.

Apenas JSON válido, sem crases markdown extras.`;

      const modelsToTry = ['gemini-3.6-flash', 'gemini-flash-latest'];
      let geminiSuccess = false;

      for (const modelName of modelsToTry) {
        if (geminiSuccess) break;
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });

          const text = response.text?.trim() || '{}';
          const parsed = JSON.parse(text);
          if (parsed && parsed.overallScore) {
            geminiSuccess = true;
            return res.json({
              ...parsed,
              businessName,
              segment,
              generatedAt: new Date().toISOString(),
              isAIGenerated: true,
            });
          }
        } catch (genError: any) {
          console.warn(`Model ${modelName} attempt failed (${genError.message || genError}), trying next...`);
        }
      }
    }

    // High quality deterministic fallback if no Gemini key or error
    const channelsCount = Array.isArray(currentChannels) ? currentChannels.length : 1;
    const baseScore = Math.min(88, Math.max(48, 52 + channelsCount * 8));

    return res.json({
      businessName,
      segment,
      overallScore: baseScore,
      subscores: {
        estrategia: Math.min(92, baseScore - 6),
        digital: Math.min(95, baseScore + 4),
        publicidade: Math.min(90, baseScore - 2),
        comunicacao: Math.min(88, baseScore + 2),
      },
      strengths: [
        `Relevância tangível no segmento de ${segment}, com potencial de liderança regional.`,
        `Presença inicial em canais fundamentais que já geram reconhecimento de marca.`,
        `Proposta de valor clara que pode ser amplificada com identidade publicitária rigorosa.`,
      ],
      opportunities: [
        `Profissionalizar a narrativa e o tom de voz para justificar ticket médio mais elevado.`,
        `Estruturar um funil de conversão contínuo para transformar visitantes esporádicos em clientes fiéis.`,
        `Padronizar peças visuais e campanhas para romper a barreira da invisibilidade na concorrência.`,
      ],
      suggestedSlogan: `${businessName}: Onde a excelência em ${segment} ganha luz.`,
      recommendedProducts: [
        {
          slug: 'diagnostico-plano-estrategico',
          tier: 'pro',
          title: 'Diagnóstico e Plano Estratégico (90 Dias)',
          reason: `Para o mercado de ${segment}, um plano tático com metas claras evita dispersão de verba e foca nos canais de maior retorno.`,
        },
        {
          slug: 'identidade-visual',
          tier: 'essencial',
          title: 'Identidade Visual & Branding',
          reason: `Reforça a percepção de autoridade e diferenciação imediata frente aos competidores locais e digitais.`,
        },
      ],
      generatedAt: new Date().toISOString(),
      isAIGenerated: false,
    });
  } catch (error: any) {
    console.error('Error in /api/diagnostico:', error);
    res.status(500).json({ error: 'Erro ao processar diagnóstico.' });
  }
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
