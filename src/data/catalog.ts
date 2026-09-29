export type PillarId = 'estrategia' | 'digital' | 'publicidade' | 'comunicacao';

export interface Pillar {
  id: PillarId;
  name: string;
  tagline: string;
  colorToken: string; // hex color
  accentClass: string;
  description: string;
}

export const PILLARS: Record<PillarId, Pillar> = {
  estrategia: {
    id: 'estrategia',
    name: 'Marketing Estratégico',
    tagline: 'Direção clara antes de gastar um único centavo.',
    colorToken: '#19D3F3', // Ciano
    accentClass: 'border-[#19D3F3] text-[#19D3F3]',
    description: 'Diagnóstico de mercado, mapeamento de concorrentes, posicionamento de marca e planejamento tático de crescimento.',
  },
  digital: {
    id: 'digital',
    name: 'Marketing Digital',
    tagline: 'Presença consistente e aquisição de clientes.',
    colorToken: '#FF2E93', // Magenta
    accentClass: 'border-[#FF2E93] text-[#FF2E93]',
    description: 'Artes de alta conversão para redes sociais, landing pages ultra-rápidas, SEO técnico e estratégias de conteúdo contínuo.',
  },
  publicidade: {
    id: 'publicidade',
    name: 'Publicidade & Propaganda',
    tagline: 'Criatividade que rompe o ruído e marca presença.',
    colorToken: '#FFD400', // Amarelo
    accentClass: 'border-[#FFD400] text-[#FFD400]',
    description: 'Identidade visual memorável, conceitos criativos de campanhas, redação publicitária afiada e peças gráficas de alto impacto.',
  },
  comunicacao: {
    id: 'comunicacao',
    name: 'Comunicação & Conteúdo',
    tagline: 'Voz institucional que constrói autoridade.',
    colorToken: '#F6C453', // Dourado
    accentClass: 'border-[#F6C453] text-[#F6C453]',
    description: 'Vídeos de campanha, roteiros cinematográficos, manuais de tom de voz e narrativas institucionais para marcas ambiciosas.',
  },
};

export type TierLevel = 'essencial' | 'pro' | 'premium';

export interface ProductTier {
  level: TierLevel;
  name: string;
  price: number; // in BRL
  isRecurring?: boolean;
  deliveryDays: number;
  revisionsCount: number;
  summary: string;
  deliverables: string[];
  notIncluded: string[];
}

export interface Product {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  pillar: PillarId;
  badge?: string;
  iconName: string;
  tiers: Record<TierLevel, ProductTier>;
}

export const INITIAL_CATALOG: Product[] = [
  {
    slug: 'diagnostico-plano-estrategico',
    title: 'Diagnóstico e Plano Estratégico',
    shortDescription: 'Mapeamento profundo do seu negócio, análise de concorrentes e plano de ação estruturado.',
    fullDescription: 'Um documento estratégico completo em formato executivo que aponta exatamente onde investir, quais canais priorizar e como posicionar sua marca para vencer a concorrência.',
    pillar: 'estrategia',
    badge: 'Mais contratado',
    iconName: 'Compass',
    tiers: {
      essencial: {
        level: 'essencial',
        name: 'Essencial',
        price: 490,
        deliveryDays: 3,
        revisionsCount: 1,
        summary: 'Diagnóstico do negócio, público-alvo e 3 principais concorrentes.',
        deliverables: [
          'Dossiê diagnóstico do modelo de negócio (PDF)',
          'Matriz SWOT e análise de 3 concorrentes diretos',
          'Definição clara de 1 Persona e Jornada de Compra',
          'Checklist com 5 ações imediatas de marketing',
        ],
        notIncluded: [
          'Plano tático detalhado de mídia paga',
          'Calendário editorial de 90 dias',
          'Acompanhamento semanal',
        ],
      },
      pro: {
        level: 'pro',
        name: 'Pro',
        price: 1490,
        deliveryDays: 5,
        revisionsCount: 2,
        summary: 'Plano estratégico de 90 dias com metas, canais e funil de conversão.',
        deliverables: [
          'Tudo do nível Essencial',
          'Plano tático de ação para 90 dias (metas e KPIs)',
          'Arquitetura de canais (orgânico, pago, parcerias)',
          'Desenho do funil de atração, conversão e retenção',
          'Estrutura recomendada de investimento e orçamento',
        ],
        notIncluded: [
          'Planejamento anual com revisão trimestral',
          'Consultoria executiva presencial',
        ],
      },
      premium: {
        level: 'premium',
        name: 'Premium',
        price: 3900,
        deliveryDays: 10,
        revisionsCount: 3,
        summary: 'Planejamento anual com calendário completo, indicadores e governança.',
        deliverables: [
          'Tudo do nível Pro',
          'Planejamento anual de marketing com cronograma de 12 meses',
          'Análise aprofundada de até 7 concorrentes e benchmarking setorial',
          'Dashboard de métricas sugeridas (CAC, LTV, ROI)',
          'Reunião de apresentação executiva e alinhamento estratégico',
        ],
        notIncluded: [
          'Gestão operacional das campanhas de tráfego pago',
        ],
      },
    },
  },
  {
    slug: 'identidade-visual',
    title: 'Identidade Visual & Branding',
    shortDescription: 'Design de marca memorável, logotipo vetorial, paleta cromática e tipografia profissional.',
    fullDescription: 'Construção da sua identidade visual desde o conceito conceitual até os arquivos finais de impressão e digital. Criada com velocidade de IA e refinamento estético por designers seniores.',
    pillar: 'publicidade',
    badge: 'Destaque',
    iconName: 'Palette',
    tiers: {
      essencial: {
        level: 'essencial',
        name: 'Essencial',
        price: 990,
        deliveryDays: 4,
        revisionsCount: 2,
        summary: 'Logotipo principal, variações, paleta de cores e guia tipográfico.',
        deliverables: [
          'Logotipo principal e submarca (vetores SVG, EPS, PNG, PDF)',
          'Paleta cromática oficial (códigos HEX, RGB e CMYK)',
          'Guia com 2 famílias tipográficas licenciadas para uso comercial',
          'Versões positiva, negativa e monocromática',
        ],
        notIncluded: [
          'Manual de identidade visual completo',
          'Papelaria corporativa e kit para redes sociais',
        ],
      },
      pro: {
        level: 'pro',
        name: 'Pro',
        price: 2490,
        deliveryDays: 7,
        revisionsCount: 3,
        summary: 'Identidade completa + manual de marca executivo e kit de templates para redes sociais.',
        deliverables: [
          'Tudo do nível Essencial',
          'Manual de Identidade Visual detalhado (Brand Guidelines em PDF)',
          'Regras de aplicação, área de resguardo e proibições',
          'Kit para Redes Sociais: 6 templates editáveis (Figma ou Canva)',
          'Avatares e capas para Instagram, LinkedIn e WhatsApp Business',
        ],
        notIncluded: [
          'Embalagens tridimensionais complexas',
          'Sinalização física de fachadas',
        ],
      },
      premium: {
        level: 'premium',
        name: 'Premium',
        price: 4490,
        deliveryDays: 12,
        revisionsCount: 4,
        summary: 'Branding integral com papelaria de luxo, guia de tom de voz e mockups 3D.',
        deliverables: [
          'Tudo do nível Pro',
          'Kit de Papelaria Corporativa (cartão de visitas, pasta, papel timbrado, envelope)',
          'Guia de Tom de Voz e Personalidade Verbal da Marca',
          'Pack com 10 mockups realistas de aplicação de marca',
          'Arquivos mestres organizados e empacotados para gráfica',
        ],
        notIncluded: [
          'Custos de impressão gráfica',
        ],
      },
    },
  },
  {
    slug: 'pack-artes-redes-sociais',
    title: 'Pack de Artes para Redes Sociais',
    shortDescription: 'Criativos visuais magnéticos para Instagram, LinkedIn e anúncios, prontos para postar.',
    fullDescription: 'Destaque-se no feed com peças gráficas desenhadas com estética editorial, hierarquia tipográfica precisa e apelo comercial irresistível.',
    pillar: 'digital',
    badge: 'Rápido',
    iconName: 'Image',
    tiers: {
      essencial: {
        level: 'essencial',
        name: 'Essencial',
        price: 490,
        deliveryDays: 2,
        revisionsCount: 2,
        summary: '8 artes de alta resolução no formato quadrado ou retrato (1080x1350).',
        deliverables: [
          '8 artes finalizadas em JPG/PNG alta resolução',
          'Adaptação para feed de Instagram e LinkedIn',
          'Textos de legenda sugeridos com hashtags estratégicas',
          'Revisão estética por diretor de arte humano',
        ],
        notIncluded: [
          'Carrosséis longos ou animações em motion',
          'Agendamento direto no perfil do cliente',
        ],
      },
      pro: {
        level: 'pro',
        name: 'Pro',
        price: 690,
        deliveryDays: 3,
        revisionsCount: 2,
        summary: '12 artes estratégicas com mix de posts estáticos e carrosséis institucionais.',
        deliverables: [
          '12 peças gráficas (incluindo até 2 carrosséis de 4 lâminas)',
          'Versões correspondentes para Stories/Reels (1080x1920)',
          'Roteiro de legendas completas com chamadas para ação (CTA)',
          'Arquivos fonte editáveis inclusos',
        ],
        notIncluded: [
          'Gestão de tráfego pago',
        ],
      },
      premium: {
        level: 'premium',
        name: 'Premium',
        price: 1090,
        deliveryDays: 5,
        revisionsCount: 3,
        summary: '20 artes de alto impacto com carrosséis educativos e criativos para anúncios.',
        deliverables: [
          '20 peças gráficas diversificadas para 1 mês de presença',
          'Até 4 carrosséis aprofundados (até 6 lâminas cada)',
          'Criativos otimizados especificamente para Meta Ads e LinkedIn Ads',
          'Guia de melhores horários e sugestão de cronograma de publicação',
        ],
        notIncluded: [
          'Gravação presencial de vídeos ou fotos',
        ],
      },
    },
  },
  {
    slug: 'pecas-avulsas',
    title: 'Peças Publicitárias Avulsas',
    shortDescription: 'Solução sob demanda para banners, carrosséis específicos, lâminas e stories urgentes.',
    fullDescription: 'Precisa apenas de uma peça pontual com urgência e acabamento profissional? Escolha a quantidade exata de itens avulsos com entrega expressa.',
    pillar: 'publicidade',
    iconName: 'LayoutGrid',
    tiers: {
      essencial: {
        level: 'essencial',
        name: '1 Arte Avulsa',
        price: 79,
        deliveryDays: 1,
        revisionsCount: 1,
        summary: '1 arte pontual para feed, anúncio ou banner web com entrega em 24h.',
        deliverables: [
          '1 arte de alta resolução (qualquer proporção)',
          'Ajuste de cores e tratamento de imagem básico',
          'Legenda publicitária inclusa',
        ],
        notIncluded: [
          'Carrossel de múltiplas páginas',
        ],
      },
      pro: {
        level: 'pro',
        name: '1 Carrossel (até 5 slides)',
        price: 149,
        deliveryDays: 2,
        revisionsCount: 2,
        summary: 'Carrossel educativo ou de vendas com até 5 slides com narrativa contínua.',
        deliverables: [
          '1 carrossel completo (até 5 lâminas panorâmicas ou conectadas)',
          'Roteiro textual persuasivo slide por slide',
          'Slide de capa de alta atração e slide final com CTA forte',
        ],
        notIncluded: [
          'Animação em vídeo',
        ],
      },
      premium: {
        level: 'premium',
        name: 'Pack 5 Stories Interativos',
        price: 189,
        deliveryDays: 2,
        revisionsCount: 2,
        summary: 'Sequência coordenada de 5 stories para lançamentos, promoções ou enquetes.',
        deliverables: [
          '5 stories verticais em sequência persuasiva',
          'Espaço planejado para figurinhas interativas (enquetes, caixas, links)',
          'Design visual padronizado com a marca',
        ],
        notIncluded: [
          'Gravação de voz',
        ],
      },
    },
  },
  {
    slug: 'video-de-campanha',
    title: 'Vídeo de Campanha & Audiovisual',
    shortDescription: 'Roteiro publicitário, edição dinâmica, motion graphics e finalização sonora.',
    fullDescription: 'Vídeos que capturam a atenção nos primeiros 3 segundos e conduzem o espectador até a decisão de compra. Desde reels virais até vídeos institucionais corporativos.',
    pillar: 'comunicacao',
    iconName: 'Video',
    tiers: {
      essencial: {
        level: 'essencial',
        name: 'Reel Curto (até 30s)',
        price: 390,
        deliveryDays: 3,
        revisionsCount: 2,
        summary: 'Vídeo vertical de até 30 segundos, com legendas dinâmicas e trilha licenciada.',
        deliverables: [
          'Edição vertical (9:16) de até 30 segundos',
          'Legendas cinemáticas em destaque com cores da marca',
          'Trilha sonora e efeitos de áudio (SFX) licenciados',
          'Roteiro magnético com gancho inicial nos 3 primeiros segundos',
        ],
        notIncluded: [
          'Locução humana personalizada em estúdio',
          'Captação presencial de filmagem',
        ],
      },
      pro: {
        level: 'pro',
        name: 'Vídeo de Campanha (30s a 60s)',
        price: 1490,
        deliveryDays: 5,
        revisionsCount: 2,
        summary: 'Comercial ou vídeo de vendas com motion graphics, locução profissional e múltiplos cortes.',
        deliverables: [
          'Vídeo de 30 a 60 segundos com narrativa de alta conversão',
          'Locução profissional inclusa (estilo publicitário)',
          'Elementos de motion graphics e animações de tipografia',
          '2 formatos entregues: 16:9 (horizontal) e 9:16 (vertical)',
        ],
        notIncluded: [
          'Animação 3D de personagens complexos',
        ],
      },
      premium: {
        level: 'premium',
        name: 'Vídeo Institucional (1 a 2 min)',
        price: 3490,
        deliveryDays: 8,
        revisionsCount: 3,
        summary: 'Mini-documentário corporativo ou vídeo de manifesto com acabamento de cinema.',
        deliverables: [
          'Filme institucional de 1 a 2 minutos com narrativa cinematográfica',
          'Storyboard completo validado antes da produção',
          'Locução de alto padrão e mixagem sonora estéreo masterizada',
          'Entregas em 4K nos formatos horizontal (16:9) e vertical para corte',
        ],
        notIncluded: [
          'Equipe de filmagem em locação física externa',
        ],
      },
    },
  },
  {
    slug: 'landing-page',
    title: 'Landing Page de Alta Conversão',
    shortDescription: 'Página web moderna, responsiva, ultra-rápida e focada em transformar cliques em vendas.',
    fullDescription: 'Projetada sob os mais rigorosos padrões de arquitetura de informação, UX copywriting e design responsivo. Entregue pronta para publicar com código limpo.',
    pillar: 'digital',
    badge: 'Popular',
    iconName: 'Globe',
    tiers: {
      essencial: {
        level: 'essencial',
        name: 'Página Única Direta',
        price: 990,
        deliveryDays: 4,
        revisionsCount: 2,
        summary: 'Landing page direta de alta velocidade focada em um único produto ou serviço.',
        deliverables: [
          'Design visual personalizado em Syne + Manrope (sem templates genéricos)',
          'Estrutura com Hero, Benefícios, Prova de Valor e Chamada de Ação',
          'Código HTML5/Tailwind/CSS totalmente responsivo (desktop e mobile)',
          'Botão direto de conversão para WhatsApp ou checkout externo',
        ],
        notIncluded: [
          'Redação de copywriting estratégico longo',
          'Integração complexa com CRM de vendas',
        ],
      },
      pro: {
        level: 'pro',
        name: 'Pro (Texto Estratégico + Formulário)',
        price: 2290,
        deliveryDays: 6,
        revisionsCount: 3,
        summary: 'Página completa com copywriting persuasivo, formulário inteligente e seções de quebra de objeções.',
        deliverables: [
          'Tudo do nível Essencial',
          'Redação publicitária completa feita com curadoria especializada',
          'Seções de FAQ interativo, comparativo e diferenciais',
          'Formulário inteligente com validação e envio para e-mail/webhook',
          'Otimização básica de SEO on-page e tags OpenGraph',
        ],
        notIncluded: [
          'Painel de login de usuários ou área de membros',
        ],
      },
      premium: {
        level: 'premium',
        name: 'Premium (Integrações & Rastreamento)',
        price: 3990,
        deliveryDays: 10,
        revisionsCount: 3,
        summary: 'Landing page premium com animações suaves, pixels de conversão instalados e integração com CRM.',
        deliverables: [
          'Tudo do nível Pro',
          'Instalação e configuração de Pixel Meta, Google Analytics 4 e Tag Manager',
          'Integração de webhook com CRM (RD Station, HubSpot, ActiveCampaign)',
          'Animações sutis e microinterações de alto padrão',
          'Hospedagem assistida e suporte no apontamento de domínio',
        ],
        notIncluded: [
          'Custo da assinatura do domínio e plataformas terceiras',
        ],
      },
    },
  },
  {
    slug: 'lumen-continuo',
    title: 'Lumen Contínuo (Assinatura Mensal)',
    shortDescription: 'Agência dedicada como serviço contínuo para manter sua marca sempre em evidência.',
    fullDescription: 'A conveniência de um time multidisciplinar de estratégia, design e publicidade trabalhando para o seu negócio todo mês, sem encargos trabalhistas e com entregas previsíveis.',
    pillar: 'estrategia',
    badge: 'Assinatura',
    iconName: 'Repeat',
    tiers: {
      essencial: {
        level: 'essencial',
        name: 'Essencial Mensal',
        price: 1290,
        isRecurring: true,
        deliveryDays: 30,
        revisionsCount: 2,
        summary: 'Presença digital ativa com 10 peças gráficas mensais e alinhamento mensal.',
        deliverables: [
          '10 peças gráficas de redes sociais por mês',
          'Redação de todas as legendas e sugestões de pauta',
          '1 reunião mensal de alinhamento estratégico',
          'Revisão humana contínua de todo o material',
        ],
        notIncluded: [
          'Gestão de tráfego pago ou mídia de terceiros',
        ],
      },
      pro: {
        level: 'pro',
        name: 'Pro Mensal',
        price: 2490,
        isRecurring: true,
        deliveryDays: 30,
        revisionsCount: 3,
        summary: 'Marketing 360 com 18 peças, 2 vídeos curtos, landing page contínua e suporte prioritário.',
        deliverables: [
          '18 peças gráficas com carrosséis inclusos',
          '2 vídeos em formato Reel/Shorts produzidos por mês',
          'Manutenção e otimização contínua de 1 landing page',
          'Acompanhamento de métricas com relatório mensal de desempenho',
          'Canal de comunicação direta via WhatsApp com o curador',
        ],
        notIncluded: [
          'Orçamento de anúncios de terceiros',
        ],
      },
      premium: {
        level: 'premium',
        name: 'Premium Mensal',
        price: 4490,
        isRecurring: true,
        deliveryDays: 30,
        revisionsCount: 4,
        summary: 'Operação completa: 30 peças, 4 vídeos, campanhas mensais e assessoria executiva.',
        deliverables: [
          '30 entregas mensais (artes, carrosséis e banners)',
          '4 vídeos de campanha com locução e edição de cinema',
          'Planejamento editorial semanal com análise de concorrência contínua',
          'Otimização de conversão (CRO) e testes A/B',
          'Consultoria executiva quinzenal com diretor de marketing',
        ],
        notIncluded: [
          'Verba de mídia direta nos canais',
        ],
      },
    },
  },
];
