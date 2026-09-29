import { Order } from '../types';

export const SEED_ORDERS: Order[] = [
  {
    id: 'LUM-94812',
    createdAt: '2026-09-20T10:15:00.000Z',
    productSlug: 'diagnostico-plano-estrategico',
    tierLevel: 'pro',
    productTitle: 'Diagnóstico e Plano Estratégico',
    tierName: 'Pro (90 Dias)',
    price: 1490,
    deliveryDays: 5,
    customer: {
      name: 'Camila Vasconcelos',
      email: 'camila.v@aurorasaude.com.br',
      phone: '(11) 98765-4321',
      document: '34.892.102/0001-44',
      acceptedTerms: true,
    },
    payment: {
      method: 'pix',
      status: 'approved',
      txId: 'PIX-E948102941-LUM',
      paidAt: '2026-09-20T10:16:30.000Z',
      amount: 1490,
    },
    status: 'entregue',
    timeline: [
      {
        timestamp: '2026-09-20T10:16:30.000Z',
        title: 'Pagamento aprovado via Pix',
        description: 'Transação confirmada no valor de R$ 1.490,00.',
        status: 'aguardando_briefing',
      },
      {
        timestamp: '2026-09-20T11:45:00.000Z',
        title: 'Briefing estratégico concluído',
        description: 'Resumo estruturado validado e enviado para produção.',
        status: 'em_producao',
      },
      {
        timestamp: '2026-09-22T16:00:00.000Z',
        title: 'Curadoria executiva concluída',
        description: 'Revisão estratégica realizada por Renato Cunha (Diretor Estratégico Lumen).',
        status: 'em_revisao',
      },
      {
        timestamp: '2026-09-23T14:30:00.000Z',
        title: 'Material entregue na plataforma',
        description: 'Dossiê estratégico completo e plano tático de 90 dias disponíveis para download.',
        status: 'entregue',
      },
    ],
    briefing: {
      businessName: 'Aurora Saúde Integrada',
      segment: 'Clínica de Medicina Integrativa & Longevidade',
      targetAudience: 'Mulheres e homens de 35 a 60 anos, classe A/B, buscando prevenção e qualidade de vida.',
      mainGoal: 'Aumentar a taxa de ocupação dos consultórios particulares em 40% em 3 meses sem depender de planos de saúde.',
      toneOfVoice: 'Científico, acolhedor, sóbrio e sofisticado.',
      referencesText: 'Clínica Albert Einstein bem-estar, Kurotel, One Medical.',
      confirmedAt: '2026-09-20T11:45:00.000Z',
    },
    revisionRoundsTotal: 2,
    revisionRoundsUsed: 0,
    adjustments: [],
    deliverables: [
      {
        id: 'del-01',
        title: 'Dossiê Estratégico Executivo - Aurora Saúde (90 Dias)',
        type: 'pdf',
        description: 'Diagnóstico de maturidade, análise de 3 concorrentes da região nobre de SP, funil de atração orgânica e paga e calendário tático de 90 dias.',
        approvedByCuratorName: 'Renato Cunha (Diretor de Estratégia Lumen)',
        fileSize: '4.8 MB',
        content: `DOSSIÊ ESTRATÉGICO EXECUTIVO - AURORA SAÚDE INTEGRADA
Curadoria: Renato Cunha | Lumen Agência Virtual

1. SUMÁRIO EXECUTIVO & DIAGNÓSTICO
A Aurora Saúde possui posicionamento premium genuíno, mas sofre de invisibilidade digital qualificada. Seus concorrentes diretos capturam mais de 70% das buscas no Google por termos de longevidade e medicina preventiva na capital paulista.

2. MAPEAMENTO DE PERSONA & JORNADA
- Persona Primária: "Helena, 44 anos, executiva sênior, rotina exaustiva, busca reequilíbrio hormonal e sono reparador sem intervenções invasivas."
- Ponto de Contato Decisivo: Conteúdo técnico-explicativo com autoridade médica, não conteúdo genérico de dicas.

3. PLANO TÁTICO DE 90 DIAS
- Mês 1: Reformulação de 3 páginas de serviços de alto valor e ativação de Google Search focado em intenção transacional.
- Mês 2: Campanha de posicionamento institucional com vídeos curtos dos médicos fundadores abordando casos reais (sem promessas milagrosas).
- Mês 3: Implementação de régua de relacionamento pós-consulta para aumento do LTV em 25%.

4. KPIs DE SUCESSO
- Meta de CAC: < R$ 180 por agendamento qualificado
- Meta de Ocupação: 85% da agenda nos 3 consultórios principais.`,
      },
    ],
  },
  {
    id: 'LUM-88310',
    createdAt: '2026-09-22T08:30:00.000Z',
    productSlug: 'identidade-visual',
    tierLevel: 'pro',
    productTitle: 'Identidade Visual & Branding',
    tierName: 'Pro (Completa + Manual)',
    price: 2490,
    deliveryDays: 7,
    customer: {
      name: 'Gabriel Albuquerque',
      email: 'gabriel@voltstudio.co',
      phone: '(21) 99887-1122',
      document: '41.220.912/0001-09',
      acceptedTerms: true,
    },
    payment: {
      method: 'credit_card',
      status: 'approved',
      txId: 'CC-AUTH-88219-LUM',
      paidAt: '2026-09-22T08:31:00.000Z',
      amount: 2490,
      installments: 3,
    },
    status: 'em_revisao',
    timeline: [
      {
        timestamp: '2026-09-22T08:31:00.000Z',
        title: 'Pagamento aprovado em 3x sem juros',
        description: 'Cobrança confirmada pela operadora de cartão.',
        status: 'aguardando_briefing',
      },
      {
        timestamp: '2026-09-22T09:20:00.000Z',
        title: 'Briefing preenchido e auditado por IA',
        description: 'Preferências visuais e paleta cromática identificadas.',
        status: 'em_producao',
      },
      {
        timestamp: '2026-09-23T15:00:00.000Z',
        title: 'Geração e curadoria em andamento',
        description: 'Designers seniores refinando tipografia e vetores na mesa de corte.',
        status: 'em_revisao',
      },
    ],
    briefing: {
      businessName: 'Volt Arquitetura Espacial',
      segment: 'Escritório de Arquitetura Comercial e Cenografia',
      targetAudience: 'Fundadores de startups, marcas de varejo que buscam flagship stores e restaurantes modernos.',
      mainGoal: 'Transmitir vanguarda tecnológica aliada à elegância brutalista.',
      toneOfVoice: 'Arrojado, minimalista, preciso e disruptivo.',
      referencesText: 'Estúdio OMA, David Chipperfield, Dieter Rams, tipografia suíça dos anos 60.',
      confirmedAt: '2026-09-22T09:20:00.000Z',
    },
    revisionRoundsTotal: 3,
    revisionRoundsUsed: 0,
    adjustments: [],
  },
];
