// Client-side fallback implementation for AI and API calls
// Allows the Lumen site to run 100% autonomously on static hostings like HostGator cPanel, Netlify or GitHub Pages

export interface DiagnosticoFormData {
  businessName: string;
  segment: string;
  city?: string;
  mainGoal?: string;
  currentChannels: string[];
  contactEmail: string;
}

export const generateLocalDiagnostico = (formData: DiagnosticoFormData) => {
  const channelsCount = Array.isArray(formData.currentChannels) ? formData.currentChannels.length : 1;
  const baseScore = Math.min(88, Math.max(48, 52 + channelsCount * 8));

  const segmentClean = (formData.segment || '').toLowerCase();

  let strengths = [
    'Clareza da proposta de valor central e relevância no segmento',
    'Potencial imediato para diferenciação estética frente a concorrentes genéricos',
    'Canais digitais com terreno fértil para captação direta de clientes qualificados',
  ];

  let opportunities = [
    'Implementar identidade visual proprietária com paleta e tipografia de alto padrão',
    'Criar fluxo de conversão direta via Landing Page de alta velocidade',
    'Adotar linha editorial visual consistente para gerar autoridade imediata no nicho',
  ];

  let suggestedSlogan = 'Autoridade, precisão e design que transformam presença em resultado.';
  let recommendedProducts: {
    slug: string;
    tier: 'essencial' | 'pro' | 'premium';
    title: string;
    reason: string;
  }[] = [
    {
      slug: 'diagnostico-plano-estrategico',
      tier: 'pro',
      title: 'Diagnóstico & Plano Estratégico',
      reason: 'Estruturação do plano mestre de comunicação e táticas de canais.',
    },
    {
      slug: 'identidade-visual',
      tier: 'pro',
      title: 'Identidade Visual & Branding',
      reason: 'Construção da assinatura visual magnética e ativos da marca.',
    },
  ];

  if (segmentClean.includes('saúde') || segmentClean.includes('médic') || segmentClean.includes('odonto')) {
    suggestedSlogan = 'Cuidado com excelência, autoridade que inspira confiança.';
  } else if (segmentClean.includes('advoc') || segmentClean.includes('juríd')) {
    suggestedSlogan = 'Solidez jurídica, presença digital à altura do seu prestígio.';
  } else if (segmentClean.includes('gastronom') || segmentClean.includes('restaurante')) {
    suggestedSlogan = 'Experiência sensorial inesquecível da mesa ao digital.';
  } else if (segmentClean.includes('tech') || segmentClean.includes('software')) {
    suggestedSlogan = 'Inovação com propósito e tração em escala.';
  }

  return {
    businessName: formData.businessName,
    segment: formData.segment,
    overallScore: baseScore,
    subscores: {
      estrategia: Math.min(92, baseScore - 5),
      digital: Math.min(95, baseScore + 4),
      publicidade: Math.min(90, baseScore - 2),
      comunicacao: Math.min(88, baseScore + 2),
    },
    strengths,
    opportunities,
    suggestedSlogan,
    recommendedProducts,
    generatedAt: new Date().toISOString(),
    isAIGenerated: true,
  };
};

export const generateLocalBriefingResponse = (
  userMessage: string,
  questionCount: number,
  productTitle: string,
  history: { role: string; text: string }[]
) => {
  let assistantMessage = '';
  let isComplete = false;
  let summary: Record<string, string> | null = null;

  if (questionCount <= 2) {
    assistantMessage = `Excelente! Compreendi a essência do seu negócio. Agora, me conte: **quem é o seu cliente ideal (público-alvo)**? Aponte faixa etária, classe ou o perfil das pessoas que você mais deseja atrair para a **${productTitle}**.`;
  } else if (questionCount === 3) {
    assistantMessage = `Perfeito! Já temos a base do público. Terceira pergunta: **qual é o tom de voz e a percepção que sua marca deve transmitir**? (Exemplo: sofisticada e reservada, jovem e ousada, acolhedora e humana, técnica e cirúrgica...)`;
  } else if (questionCount === 4) {
    assistantMessage = `Ótima definição de tom! Para finalizar com chave de ouro: você possui **marcas de referência, concorrentes que admira ou links/cores** que gostaria que nossa equipe levasse em consideração na criação?`;
  } else {
    isComplete = true;
    assistantMessage = `Briefing concluído com absoluto sucesso! ✨\n\nCompilamos todas as diretrizes para **${productTitle}**. Nossos diretores criativos acabam de receber seu documento estratégico e já iniciaram a pré-produção. Você pode acompanhar o status em tempo real pelo seu Portal do Cliente!`;

    // Extract basic summary from history
    summary = {
      businessName: history[1]?.text || 'Sua Marca',
      segment: 'Geral / Estratégico',
      targetAudience: history[3]?.text || 'Público qualificado',
      toneOfVoice: history[5]?.text || 'Profissional e sofisticado',
      referencesText: userMessage || 'Referências fornecidas pelo cliente',
      mainGoal: `Excelência e retorno de investimento com ${productTitle}`,
    };
  }

  return {
    assistantMessage,
    isComplete,
    summary,
  };
};
