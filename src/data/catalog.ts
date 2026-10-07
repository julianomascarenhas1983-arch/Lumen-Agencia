export type PillarId = 'estrategia' | 'digital' | 'publicidade' | 'comunicacao';

export interface Pillar {
  id: PillarId;
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  colorToken: string; // hex color
  accentClass: string;
  description: string;
  descriptionEn: string;
}

export const PILLARS: Record<PillarId, Pillar> = {
  estrategia: {
    id: 'estrategia',
    name: 'Marketing Estratégico',
    nameEn: 'Strategic Marketing',
    tagline: 'Direção clara antes de gastar um único centavo.',
    taglineEn: 'Clear strategic direction before spending a single dollar.',
    colorToken: '#19D3F3', // Ciano
    accentClass: 'border-[#19D3F3] text-[#19D3F3]',
    description: 'Diagnóstico de mercado, mapeamento de concorrentes, posicionamento de marca e planejamento tático de crescimento.',
    descriptionEn: 'Market diagnostics, competitor mapping, brand positioning, and structured tactical growth roadmaps.',
  },
  digital: {
    id: 'digital',
    name: 'Marketing Digital',
    nameEn: 'Digital Marketing',
    tagline: 'Presença consistente e aquisição de clientes.',
    taglineEn: 'Consistent online presence and high-intent customer acquisition.',
    colorToken: '#FF2E93', // Magenta
    accentClass: 'border-[#FF2E93] text-[#FF2E93]',
    description: 'Artes de alta conversão para redes sociais, landing pages ultra-rápidas, SEO técnico e estratégias de conteúdo contínuo.',
    descriptionEn: 'High-converting social creatives, lightning-fast landing pages, technical SEO, and continuous content engines.',
  },
  publicidade: {
    id: 'publicidade',
    name: 'Publicidade & Propaganda',
    nameEn: 'Advertising & Branding',
    tagline: 'Criatividade que rompe o ruído e marca presença.',
    taglineEn: 'Bold creativity that cuts through the noise and establishes authority.',
    colorToken: '#FFD400', // Amarelo
    accentClass: 'border-[#FFD400] text-[#FFD400]',
    description: 'Identidade visual memorável, conceitos criativos de campanhas, redação publicitária afiada e peças gráficas de alto impacto.',
    descriptionEn: 'Memorable visual identities, campaign concepts, sharp advertising copywriting, and high-impact graphic design.',
  },
  comunicacao: {
    id: 'comunicacao',
    name: 'Comunicação & Conteúdo',
    nameEn: 'Communication & Media',
    tagline: 'Voz institucional que constrói autoridade.',
    taglineEn: 'An authoritative institutional voice that builds enduring credibility.',
    colorToken: '#F6C453', // Dourado
    accentClass: 'border-[#F6C453] text-[#F6C453]',
    description: 'Vídeos de campanha, roteiros cinematográficos, manuais de tom de voz e narrativas institucionais para marcas ambiciosas.',
    descriptionEn: 'Campaign videos, cinematic commercial scripts, brand voice guidelines, and institutional narratives for ambitious brands.',
  },
};

export type TierLevel = 'essencial' | 'pro' | 'premium';

export interface ProductTier {
  level: TierLevel;
  name: string;
  nameEn: string;
  price: number; // in BRL (source of truth)
  priceUSD: number; // in USD (fixed price, manually set, commercial rounded numbers)
  isRecurring?: boolean;
  deliveryDays: number;
  revisionsCount: number;
  summary: string;
  summaryEn: string;
  deliverables: string[];
  deliverablesEn: string[];
  notIncluded: string[];
  notIncludedEn: string[];
}

export interface Product {
  slug: string;
  title: string;
  titleEn: string;
  shortDescription: string;
  shortDescriptionEn: string;
  fullDescription: string;
  fullDescriptionEn: string;
  pillar: PillarId;
  badge?: string;
  badgeEn?: string;
  iconName: string;
  tiers: Record<TierLevel, ProductTier>;
}

export const INITIAL_CATALOG: Product[] = [
  {
    slug: 'diagnostico-plano-estrategico',
    title: 'Diagnóstico e Plano Estratégico',
    titleEn: 'Strategic Diagnosis & Growth Plan',
    shortDescription: 'Mapeamento profundo do seu negócio, análise de concorrentes e plano de ação estruturado.',
    shortDescriptionEn: 'In-depth business audit, competitive benchmark, and a structured 90-day action plan.',
    fullDescription: 'Um documento estratégico completo em formato executivo que aponta exatamente onde investir, quais canais priorizar e como posicionar sua marca para vencer a concorrência.',
    fullDescriptionEn: 'A comprehensive executive-ready strategic dossier revealing exactly where to invest, which acquisition channels to prioritize, and how to position your brand for sustainable market dominance.',
    pillar: 'estrategia',
    badge: 'Mais contratado',
    badgeEn: 'Most Popular',
    iconName: 'Compass',
    tiers: {
      essencial: {
        level: 'essencial',
        name: 'Essencial',
        nameEn: 'Essential',
        price: 490,
        priceUSD: 149,
        deliveryDays: 3,
        revisionsCount: 1,
        summary: 'Diagnóstico do negócio, público-alvo e 3 principais concorrentes.',
        summaryEn: 'Core business audit, target buyer persona, and 3 key competitor benchmarks.',
        deliverables: [
          'Dossiê diagnóstico do modelo de negócio (PDF)',
          'Matriz SWOT e análise de 3 concorrentes diretos',
          'Definição clara de 1 Persona e Jornada de Compra',
          'Checklist com 5 ações imediatas de marketing',
        ],
        deliverablesEn: [
          'Executive business diagnosis dossier (PDF)',
          'SWOT matrix and direct audit of 3 key competitors',
          'Clear Buyer Persona profile & customer journey map',
          'Immediate 5-point tactical marketing checklist',
        ],
        notIncluded: [
          'Plano tático detalhado de mídia paga',
          'Calendário editorial de 90 dias',
          'Acompanhamento semanal',
        ],
        notIncludedEn: [
          'Detailed paid media architecture',
          '90-day editorial calendar',
          'Weekly strategy calls',
        ],
      },
      pro: {
        level: 'pro',
        name: 'Pro',
        nameEn: 'Pro',
        price: 1490,
        priceUSD: 390,
        deliveryDays: 5,
        revisionsCount: 2,
        summary: 'Plano estratégico de 90 dias com metas, canais e funil de conversão.',
        summaryEn: 'Comprehensive 90-day growth roadmap with KPIs, channel mix, and full-funnel strategy.',
        deliverables: [
          'Tudo do nível Essencial',
          'Plano tático de ação para 90 dias (metas e KPIs)',
          'Arquitetura de canais (orgânico, pago, parcerias)',
          'Desenho do funil de atração, conversão e retenção',
          'Estrutura recomendada de investimento e orçamento',
        ],
        deliverablesEn: [
          'Everything in Essential',
          'Actionable 90-day tactical roadmap (goals & KPIs)',
          'Omnichannel architecture (organic, paid, outbound)',
          'Full-funnel design (attract, convert, retain)',
          'Recommended budget allocation and CAC benchmarks',
        ],
        notIncluded: [
          'Planejamento anual com revisão trimestral',
          'Consultoria executiva presencial',
        ],
        notIncludedEn: [
          'Full annual corporate governance',
          'In-person executive consulting',
        ],
      },
      premium: {
        level: 'premium',
        name: 'Premium',
        nameEn: 'Premium',
        price: 3900,
        priceUSD: 890,
        deliveryDays: 10,
        revisionsCount: 3,
        summary: 'Planejamento anual com calendário completo, indicadores e governança.',
        summaryEn: 'Full annual enterprise strategy with 12-month calendar, board-level metrics, and alignment.',
        deliverables: [
          'Tudo do nível Pro',
          'Planejamento anual de marketing com cronograma de 12 meses',
          'Análise aprofundada de até 7 concorrentes e benchmarking setorial',
          'Dashboard de métricas sugeridas (CAC, LTV, ROI)',
          'Reunião de apresentação executiva e alinhamento estratégico',
        ],
        deliverablesEn: [
          'Everything in Pro',
          'Annual strategic marketing plan with 12-month timeline',
          'Deep audit of up to 7 competitors and industry benchmarks',
          'Financial KPI dashboard framework (CAC, LTV, Payback, ROI)',
          '60-minute executive presentation & alignment workshop',
        ],
        notIncluded: [
          'Gestão operacional das campanhas de tráfego pago',
        ],
        notIncludedEn: [
          'Daily operational management of ad accounts',
        ],
      },
    },
  },
  {
    slug: 'identidade-visual',
    title: 'Identidade Visual & Branding',
    titleEn: 'Visual Identity & Brand Design',
    shortDescription: 'Design de marca memorável, logotipo vetorial, paleta cromática e tipografia profissional.',
    shortDescriptionEn: 'Memorable brand identity, vector logos, custom chromatic palettes, and typography system.',
    fullDescription: 'Construção da sua identidade visual desde o conceito conceitual até os arquivos finais de impressão e digital. Criada com velocidade de IA e refinamento estético por designers seniores.',
    fullDescriptionEn: 'Crafting your visual identity from initial concept to print-ready and digital vector assets. Built with AI-accelerated exploration and honed by senior art directors.',
    pillar: 'publicidade',
    badge: 'Destaque',
    badgeEn: 'Featured',
    iconName: 'Palette',
    tiers: {
      essencial: {
        level: 'essencial',
        name: 'Essencial',
        nameEn: 'Essential',
        price: 990,
        priceUSD: 290,
        deliveryDays: 4,
        revisionsCount: 2,
        summary: 'Logotipo principal, variações, paleta de cores e guia tipográfico.',
        summaryEn: 'Primary logo, submark, brand color palette, and commercial typography guide.',
        deliverables: [
          'Logotipo principal e submarca (vetores SVG, EPS, PNG, PDF)',
          'Paleta cromática oficial (códigos HEX, RGB e CMYK)',
          'Guia com 2 famílias tipográficas licenciadas para uso comercial',
          'Versões positiva, negativa e monocromática',
        ],
        deliverablesEn: [
          'Primary logo & secondary lockups (vector SVG, EPS, PNG, PDF)',
          'Official color palette with HEX, RGB, and CMYK codes',
          'Font pairing system with commercial license recommendations',
          'Dark, light, and monochrome high-resolution variations',
        ],
        notIncluded: [
          'Manual de identidade visual completo',
          'Papelaria corporativa e kit para redes sociais',
        ],
        notIncludedEn: [
          'Full comprehensive brand guidelines book',
          'Stationery package and social media templates',
        ],
      },
      pro: {
        level: 'pro',
        name: 'Pro',
        nameEn: 'Pro',
        price: 2490,
        priceUSD: 590,
        deliveryDays: 7,
        revisionsCount: 3,
        summary: 'Identidade completa + manual de marca executivo e kit de templates para redes sociais.',
        summaryEn: 'Complete identity system + brand guidelines manual and editable social media design kit.',
        deliverables: [
          'Tudo do nível Essencial',
          'Manual de Identidade Visual detalhado (Brand Guidelines em PDF)',
          'Regras de aplicação, área de resguardo e proibições',
          'Kit para Redes Sociais: 6 templates editáveis (Figma ou Canva)',
          'Avatares e capas para Instagram, LinkedIn e WhatsApp Business',
        ],
        deliverablesEn: [
          'Everything in Essential',
          'Detailed Brand Guidelines Manual (PDF)',
          'Clear usage rules, clearspace standards, and dos & don’ts',
          'Social Media Kit: 6 customizable templates (Figma or Canva)',
          'High-res profile avatars and header banners (LinkedIn, Instagram)',
        ],
        notIncluded: [
          'Embalagens tridimensionais complexas',
          'Sinalização física de fachadas',
        ],
        notIncludedEn: [
          'Complex 3D product packaging dies',
          'Architectural signage and facade fabrication',
        ],
      },
      premium: {
        level: 'premium',
        name: 'Premium',
        nameEn: 'Premium',
        price: 4490,
        priceUSD: 990,
        deliveryDays: 12,
        revisionsCount: 4,
        summary: 'Branding integral com papelaria de luxo, guia de tom de voz e mockups 3D.',
        summaryEn: 'End-to-end luxury branding with stationery suite, verbal identity guide, and 3D mockups.',
        deliverables: [
          'Tudo do nível Pro',
          'Kit de Papelaria Corporativa (cartão de visitas, pasta, papel timbrado, envelope)',
          'Guia de Tom de Voz e Personalidade Verbal da Marca',
          'Pack com 10 mockups realistas de aplicação de marca',
          'Arquivos mestres organizados e empacotados para gráfica',
        ],
        deliverablesEn: [
          'Everything in Pro',
          'Corporate Stationery Suite (business cards, folder, letterhead, envelope)',
          'Verbal Identity & Brand Tone of Voice Guide',
          'Pack of 10 photorealistic 3D brand mockups',
          'Master asset package pre-flighted for commercial printing',
        ],
        notIncluded: [
          'Custos de impressão gráfica',
        ],
        notIncludedEn: [
          'Physical print production and shipping costs',
        ],
      },
    },
  },
  {
    slug: 'pack-artes-redes-sociais',
    title: 'Pack de Artes para Redes Sociais',
    titleEn: 'Social Media Creative Suite',
    shortDescription: 'Criativos visuais magnéticos para Instagram, LinkedIn e anúncios, prontos para postar.',
    shortDescriptionEn: 'Scroll-stopping visual assets for Instagram, LinkedIn, and paid ads, delivered ready to publish.',
    fullDescription: 'Destaque-se no feed com peças gráficas desenhadas com estética editorial, hierarquia tipográfica precisa e apelo comercial irresistível.',
    fullDescriptionEn: 'Stand out in high-competition feeds with visual pieces designed with editorial flair, crisp typographic hierarchy, and sharp conversion psychology.',
    pillar: 'digital',
    badge: 'Rápido',
    badgeEn: 'Fast Turnaround',
    iconName: 'Image',
    tiers: {
      essencial: {
        level: 'essencial',
        name: 'Essencial',
        nameEn: 'Essential',
        price: 490,
        priceUSD: 149,
        deliveryDays: 2,
        revisionsCount: 2,
        summary: '8 artes de alta resolução no formato quadrado ou retrato (1080x1350).',
        summaryEn: '8 high-resolution creative assets formatted in square or portrait (1080x1350).',
        deliverables: [
          '8 artes finalizadas em JPG/PNG alta resolução',
          'Adaptação para feed de Instagram e LinkedIn',
          'Textos de legenda sugeridos com hashtags estratégicas',
          'Revisão estética por diretor de arte humano',
        ],
        deliverablesEn: [
          '8 finished creative designs in high-res JPG/PNG',
          'Optimized for Instagram and LinkedIn feeds',
          'Suggested caption copy with strategic hashtags and CTAs',
          'Quality control by senior art director',
        ],
        notIncluded: [
          'Carrosséis longos ou animações em motion',
          'Agendamento direto no perfil do cliente',
        ],
        notIncludedEn: [
          'Multi-slide carousels or video motion graphics',
          'Direct posting or social account management',
        ],
      },
      pro: {
        level: 'pro',
        name: 'Pro',
        nameEn: 'Pro',
        price: 690,
        priceUSD: 199,
        deliveryDays: 3,
        revisionsCount: 2,
        summary: '12 artes estratégicas com mix de posts estáticos e carrosséis institucionais.',
        summaryEn: '12 strategic assets blending static highlights, educational carousels, and stories.',
        deliverables: [
          '12 peças gráficas (incluindo até 2 carrosséis de 4 lâminas)',
          'Versões correspondentes para Stories/Reels (1080x1920)',
          'Roteiro de legendas completas com chamadas para ação (CTA)',
          'Arquivos fonte editáveis inclusos',
        ],
        deliverablesEn: [
          '12 visual assets (including up to 2 multi-slide carousels)',
          'Matching vertical versions for Stories/Reels (1080x1920)',
          'Complete caption copywriting with high-converting CTAs',
          'Editable source design files included',
        ],
        notIncluded: [
          'Gestão de tráfego pago',
        ],
        notIncludedEn: [
          'Paid media campaign management',
        ],
      },
      premium: {
        level: 'premium',
        name: 'Premium',
        nameEn: 'Premium',
        price: 1090,
        priceUSD: 299,
        deliveryDays: 5,
        revisionsCount: 3,
        summary: '20 artes de alto impacto com carrosséis educativos e criativos para anúncios.',
        summaryEn: '20 high-impact assets covering an entire month: deep carousels, promos, and paid ad variations.',
        deliverables: [
          '20 peças gráficas diversificadas para 1 mês de presença',
          'Até 4 carrosséis aprofundados (até 6 lâminas cada)',
          'Criativos otimizados especificamente para Meta Ads e LinkedIn Ads',
          'Guia de melhores horários e sugestão de cronograma de publicação',
        ],
        deliverablesEn: [
          '20 diversified creative assets covering a full month of presence',
          'Up to 4 in-depth carousels (up to 6 slides each)',
          'Ad-optimized variants for Meta Ads and LinkedIn Sponsored Content',
          'Publishing schedule recommendations and best practices',
        ],
        notIncluded: [
          'Gravação presencial de vídeos ou fotos',
        ],
        notIncludedEn: [
          'In-person on-site photo or video shoots',
        ],
      },
    },
  },
  {
    slug: 'pecas-avulsas',
    title: 'Peças Publicitárias Avulsas',
    titleEn: 'On-Demand Creative Assets',
    shortDescription: 'Solução sob demanda para banners, carrosséis específicos, lâminas e stories urgentes.',
    shortDescriptionEn: 'A la carte design solution for ad banners, specific carousels, one-off slides, and urgent stories.',
    fullDescription: 'Precisa apenas de uma peça pontual com urgência e acabamento profissional? Escolha a quantidade exata de itens avulsos com entrega expressa.',
    fullDescriptionEn: 'Need a single high-priority piece with studio-grade polish on a tight deadline? Choose the exact asset you need with express turnaround.',
    pillar: 'publicidade',
    iconName: 'LayoutGrid',
    tiers: {
      essencial: {
        level: 'essencial',
        name: '1 Arte Avulsa',
        nameEn: '1 Single Asset',
        price: 79,
        priceUSD: 25,
        deliveryDays: 1,
        revisionsCount: 1,
        summary: '1 arte pontual para feed, anúncio ou banner web com entrega em 24h.',
        summaryEn: '1 single asset for feed, ad creative, or web banner with 24h delivery.',
        deliverables: [
          '1 arte de alta resolução (qualquer proporção)',
          'Ajuste de cores e tratamento de imagem básico',
          'Legenda publicitária inclusa',
        ],
        deliverablesEn: [
          '1 high-resolution asset in your specified aspect ratio',
          'Color grading and basic photo retouching',
          'Ad caption and CTA copy included',
        ],
        notIncluded: [
          'Carrossel de múltiplas páginas',
        ],
        notIncludedEn: [
          'Multi-slide carousel design',
        ],
      },
      pro: {
        level: 'pro',
        name: '1 Carrossel (até 5 slides)',
        nameEn: '1 Carousel (up to 5 slides)',
        price: 149,
        priceUSD: 45,
        deliveryDays: 2,
        revisionsCount: 2,
        summary: 'Carrossel educativo ou de vendas com até 5 slides com narrativa contínua.',
        summaryEn: 'Educational or sales carousel with up to 5 seamlessly connected slides.',
        deliverables: [
          '1 carrossel completo (até 5 lâminas panorâmicas ou conectadas)',
          'Roteiro textual persuasivo slide por slide',
          'Slide de capa de alta atração e slide final com CTA forte',
        ],
        deliverablesEn: [
          '1 full carousel (up to 5 panoramic or seamlessly connected slides)',
          'Persuasive slide-by-slide copywriting',
          'High-CTR cover slide and high-conversion final CTA slide',
        ],
        notIncluded: [
          'Animação em vídeo',
        ],
        notIncludedEn: [
          'Video motion graphics',
        ],
      },
      premium: {
        level: 'premium',
        name: 'Pack 5 Stories Interativos',
        nameEn: '5 Interactive Stories Pack',
        price: 189,
        priceUSD: 55,
        deliveryDays: 2,
        revisionsCount: 2,
        summary: 'Sequência coordenada de 5 stories para lançamentos, promoções ou enquetes.',
        summaryEn: 'Coordinated 5-story sequential funnel for product launches, flash sales, or polls.',
        deliverables: [
          '5 stories verticais em sequência persuasiva',
          'Espaço planejado para figurinhas interativas (enquetes, caixas, links)',
          'Design visual padronizado com a marca',
        ],
        deliverablesEn: [
          '5 vertical story frames in a high-retention sequential narrative',
          'Designed integration areas for native stickers (polls, links, Q&As)',
          'Brand-aligned typography and color palette',
        ],
        notIncluded: [
          'Gravação de voz',
        ],
        notIncludedEn: [
          'Custom voice recording',
        ],
      },
    },
  },
  {
    slug: 'video-de-campanha',
    title: 'Vídeo de Campanha & Audiovisual',
    titleEn: 'Campaign Video & Motion Media',
    shortDescription: 'Roteiro publicitário, edição dinâmica, motion graphics e finalização sonora.',
    shortDescriptionEn: 'Scriptwriting, dynamic editing, motion typography, and commercial audio mastering.',
    fullDescription: 'Vídeos que capturam a atenção nos primeiros 3 segundos e conduzem o espectador até a decisão de compra. Desde reels virais até vídeos institucionais corporativos.',
    fullDescriptionEn: 'Videos engineered to hook viewers in the first 3 seconds and guide them to a clear purchasing decision. From viral short-form reels to corporate manifesto films.',
    pillar: 'comunicacao',
    iconName: 'Video',
    tiers: {
      essencial: {
        level: 'essencial',
        name: 'Reel Curto (até 30s)',
        nameEn: 'Short Reel (up to 30s)',
        price: 390,
        priceUSD: 99,
        deliveryDays: 3,
        revisionsCount: 2,
        summary: 'Vídeo vertical de até 30 segundos, com legendas dinâmicas e trilha licenciada.',
        summaryEn: 'Vertical short-form video (up to 30s) with kinetic captions and licensed audio.',
        deliverables: [
          'Edição vertical (9:16) de até 30 segundos',
          'Legendas cinemáticas em destaque com cores da marca',
          'Trilha sonora e efeitos de áudio (SFX) licenciados',
          'Roteiro magnético com gancho inicial nos 3 primeiros segundos',
        ],
        deliverablesEn: [
          'Vertical 9:16 edit up to 30 seconds',
          'Kinetic styled captions with brand colors',
          'Licensed commercial soundtrack and SFX audio mix',
          'High-retention script with a 3-second opening hook',
        ],
        notIncluded: [
          'Locução humana personalizada em estúdio',
          'Captação presencial de filmagem',
        ],
        notIncludedEn: [
          'Studio-recorded human voiceover',
          'On-site filming crew',
        ],
      },
      pro: {
        level: 'pro',
        name: 'Vídeo de Campanha (30s a 60s)',
        nameEn: 'Campaign Ad Video (30s to 60s)',
        price: 1490,
        priceUSD: 390,
        deliveryDays: 5,
        revisionsCount: 2,
        summary: 'Comercial ou vídeo de vendas com motion graphics, locução profissional e múltiplos cortes.',
        summaryEn: 'High-conversion commercial with motion graphics, pro voiceover, and multi-aspect exports.',
        deliverables: [
          'Vídeo de 30 a 60 segundos com narrativa de alta conversão',
          'Locução profissional inclusa (estilo publicitário)',
          'Elementos de motion graphics e animações de tipografia',
          '2 formatos entregues: 16:9 (horizontal) e 9:16 (vertical)',
        ],
        deliverablesEn: [
          '30 to 60-second commercial with high-converting narrative structure',
          'Professional studio voiceover narration included',
          'Kinetic typography, motion graphics, and graphic badges',
          'Delivered in both 16:9 (horizontal) and 9:16 (vertical) formats',
        ],
        notIncluded: [
          'Animação 3D de personagens complexos',
        ],
        notIncludedEn: [
          'Complex 3D character rigging or modeling',
        ],
      },
      premium: {
        level: 'premium',
        name: 'Vídeo Institucional (1 a 2 min)',
        nameEn: 'Institutional Brand Film (1 to 2 min)',
        price: 3490,
        priceUSD: 890,
        deliveryDays: 8,
        revisionsCount: 3,
        summary: 'Mini-documentário corporativo ou vídeo de manifesto com acabamento de cinema.',
        summaryEn: 'Corporate documentary or brand manifesto video with cinematic-grade post-production.',
        deliverables: [
          'Filme institucional de 1 a 2 minutos com narrativa cinematográfica',
          'Storyboard completo validado antes da produção',
          'Locução de alto padrão e mixagem sonora estéreo masterizada',
          'Entregas em 4K nos formatos horizontal (16:9) e vertical para corte',
        ],
        deliverablesEn: [
          '1 to 2-minute cinematic institutional film',
          'Comprehensive visual storyboard approved prior to final rendering',
          'Premium commercial voiceover and stereo master audio mix',
          '4K master delivery in horizontal (16:9) and vertical social cuts',
        ],
        notIncluded: [
          'Equipe de filmagem em locação física externa',
        ],
        notIncludedEn: [
          'On-location filming crew and actors',
        ],
      },
    },
  },
  {
    slug: 'landing-page',
    title: 'Landing Page de Alta Conversão',
    titleEn: 'High-Conversion Landing Page',
    shortDescription: 'Página web moderna, responsiva, ultra-rápida e focada em transformar cliques em vendas.',
    shortDescriptionEn: 'Modern, responsive, ultra-fast web page architected to convert paid & organic traffic into revenue.',
    fullDescription: 'Projetada sob os mais rigorosos padrões de arquitetura de informação, UX copywriting e design responsivo. Entregue pronta para publicar com código limpo.',
    fullDescriptionEn: 'Engineered according to rigorous standards of information architecture, conversion copywriting, and responsive UX design. Shipped ready to deploy with pristine code.',
    pillar: 'digital',
    badge: 'Popular',
    badgeEn: 'Popular',
    iconName: 'Globe',
    tiers: {
      essencial: {
        level: 'essencial',
        name: 'Página Única Direta',
        nameEn: 'Direct Single Page',
        price: 990,
        priceUSD: 290,
        deliveryDays: 4,
        revisionsCount: 2,
        summary: 'Landing page direta de alta velocidade focada em um único produto ou serviço.',
        summaryEn: 'High-speed conversion page engineered around a single core product or offer.',
        deliverables: [
          'Design visual personalizado em Syne + Manrope (sem templates genéricos)',
          'Estrutura com Hero, Benefícios, Prova de Valor e Chamada de Ação',
          'Código HTML5/Tailwind/CSS totalmente responsivo (desktop e mobile)',
          'Botão direto de conversão para WhatsApp ou checkout externo',
        ],
        deliverablesEn: [
          'Custom visual design (zero generic boilerplate themes)',
          'Clear layout: Hero, Core Benefits, Social Proof, and Call to Action',
          'Clean, ultra-fast responsive HTML5/Tailwind code',
          'Direct lead conversion buttons to WhatsApp or checkout gateway',
        ],
        notIncluded: [
          'Redação de copywriting estratégico longo',
          'Integração complexa com CRM de vendas',
        ],
        notIncludedEn: [
          'Long-form sales letter copywriting',
          'Complex multi-stage CRM webhooks',
        ],
      },
      pro: {
        level: 'pro',
        name: 'Pro (Texto Estratégico + Formulário)',
        nameEn: 'Pro (Full Copy + Smart Form)',
        price: 2290,
        priceUSD: 590,
        deliveryDays: 6,
        revisionsCount: 3,
        summary: 'Página completa com copywriting persuasivo, formulário inteligente e seções de quebra de objeções.',
        summaryEn: 'Complete long-form page with persuasion copywriting, smart lead form, and FAQ objection handlers.',
        deliverables: [
          'Tudo do nível Essencial',
          'Redação publicitária completa feita com curadoria especializada',
          'Seções de FAQ interativo, comparativo e diferenciais',
          'Formulário inteligente com validação e envio para e-mail/webhook',
          'Otimização básica de SEO on-page e tags OpenGraph',
        ],
        deliverablesEn: [
          'Everything in Essential',
          'Full conversion copywriting crafted by specialized copy curators',
          'Interactive FAQ, comparison table, and competitive advantages',
          'Smart lead capture form with email/webhook routing',
          'On-page SEO optimization and OpenGraph social share cards',
        ],
        notIncluded: [
          'Painel de login de usuários ou área de membros',
        ],
        notIncludedEn: [
          'User membership portal or custom authentication backend',
        ],
      },
      premium: {
        level: 'premium',
        name: 'Premium (Integrações & Rastreamento)',
        nameEn: 'Premium (Integrations & Tracking)',
        price: 3990,
        priceUSD: 990,
        deliveryDays: 10,
        revisionsCount: 3,
        summary: 'Landing page premium com animações suaves, pixels de conversão instalados e integração com CRM.',
        summaryEn: 'Enterprise-grade landing page with micro-interactions, conversion tracking pixels, and CRM pipelines.',
        deliverables: [
          'Tudo do nível Pro',
          'Instalação e configuração de Pixel Meta, Google Analytics 4 e Tag Manager',
          'Integração de webhook com CRM (RD Station, HubSpot, ActiveCampaign)',
          'Animações sutis e microinterações de alto padrão',
          'Hospedagem assistida e suporte no apontamento de domínio',
        ],
        deliverablesEn: [
          'Everything in Pro',
          'Full tracking setup: Meta Pixel, Google Analytics 4, and GTM',
          'Direct webhook pipeline to your CRM (HubSpot, ActiveCampaign, etc.)',
          'Polished luxury micro-interactions and smooth scroll choreography',
          'Deployment assistance and custom domain DNS configuration',
        ],
        notIncluded: [
          'Custo da assinatura do domínio e plataformas terceiras',
        ],
        notIncludedEn: [
          'Domain registration and third-party SaaS subscription costs',
        ],
      },
    },
  },
  {
    slug: 'lumen-continuo',
    title: 'Lumen Contínuo (Assinatura Mensal)',
    titleEn: 'Lumen Continuous (Monthly Retainer)',
    shortDescription: 'Agência dedicada como serviço contínuo para manter sua marca sempre em evidência.',
    shortDescriptionEn: 'A dedicated virtual agency on monthly retainer to keep your brand consistently visible and growing.',
    fullDescription: 'A conveniência de um time multidisciplinar de estratégia, design e publicidade trabalhando para o seu negócio todo mês, sem encargos trabalhistas e com entregas previsíveis.',
    fullDescriptionEn: 'The convenience of a senior multidisciplinary team spanning strategy, design, and advertising working on your brand every single month, with predictable sprints and zero payroll overhead.',
    pillar: 'estrategia',
    badge: 'Assinatura',
    badgeEn: 'Retainer',
    iconName: 'Repeat',
    tiers: {
      essencial: {
        level: 'essencial',
        name: 'Essencial Mensal',
        nameEn: 'Essential Monthly',
        price: 1290,
        priceUSD: 390,
        isRecurring: true,
        deliveryDays: 30,
        revisionsCount: 2,
        summary: 'Presença digital ativa com 10 peças gráficas mensais e alinhamento mensal.',
        summaryEn: 'Consistent digital presence with 10 monthly creative deliverables and strategic alignment.',
        deliverables: [
          '10 peças gráficas de redes sociais por mês',
          'Redação de todas as legendas e sugestões de pauta',
          '1 reunião mensal de alinhamento estratégico',
          'Revisão humana contínua de todo o material',
        ],
        deliverablesEn: [
          '10 social media graphic deliverables per month',
          'Complete copy for all captions and content suggestions',
          '1 monthly strategic alignment sprint call',
          'Continuous human art direction and QA on every asset',
        ],
        notIncluded: [
          'Gestão de tráfego pago ou mídia de terceiros',
        ],
        notIncludedEn: [
          'Direct paid media campaign management',
        ],
      },
      pro: {
        level: 'pro',
        name: 'Pro Mensal',
        nameEn: 'Pro Monthly',
        price: 2490,
        priceUSD: 690,
        isRecurring: true,
        deliveryDays: 30,
        revisionsCount: 3,
        summary: 'Marketing 360 com 18 peças, 2 vídeos curtos, landing page contínua e suporte prioritário.',
        summaryEn: 'Comprehensive 360 marketing: 18 assets, 2 short-form videos, landing page upkeep, and priority support.',
        deliverables: [
          '18 peças gráficas com carrosséis inclusos',
          '2 vídeos em formato Reel/Shorts produzidos por mês',
          'Manutenção e otimização contínua de 1 landing page',
          'Acompanhamento de métricas com relatório mensal de desempenho',
          'Canal de comunicação direta via WhatsApp com o curador',
        ],
        deliverablesEn: [
          '18 visual assets per month (including multi-slide carousels)',
          '2 edited short-form video reels produced per month',
          'Continuous maintenance and CRO updates for 1 landing page',
          'Monthly performance report and KPI tracking',
          'Direct communication channel with your assigned senior curator',
        ],
        notIncluded: [
          'Orçamento de anúncios de terceiros',
        ],
        notIncludedEn: [
          'Third-party paid media ad spend',
        ],
      },
      premium: {
        level: 'premium',
        name: 'Premium Mensal',
        nameEn: 'Premium Monthly',
        price: 4490,
        priceUSD: 1190,
        isRecurring: true,
        deliveryDays: 30,
        revisionsCount: 4,
        summary: 'Operação completa: 30 peças, 4 vídeos, campanhas mensais e assessoria executiva.',
        summaryEn: 'Full-service agency operation: 30 assets, 4 commercial videos, monthly campaigns, and CMO advisory.',
        deliverables: [
          '30 entregas mensais (artes, carrosséis e banners)',
          '4 vídeos de campanha com locução e edição de cinema',
          'Planejamento editorial semanal com análise de concorrência contínua',
          'Otimização de conversão (CRO) e testes A/B',
          'Consultoria executiva quinzenal com diretor de marketing',
        ],
        deliverablesEn: [
          '30 monthly deliverables (design assets, carousels, banners, ads)',
          '4 campaign videos with voiceover and cinematic editing',
          'Weekly editorial sprints with ongoing competitor monitoring',
          'Continuous conversion rate optimization (CRO) and copy A/B tests',
          'Bi-weekly executive advisory session with senior marketing director',
        ],
        notIncluded: [
          'Verba de mídia direta nos canais',
        ],
        notIncludedEn: [
          'Direct ad spend placed in advertising platforms',
        ],
      },
    },
  },
];
