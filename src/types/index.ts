import { Product, TierLevel, ProductTier } from '../data/catalog';
export type { Product, TierLevel, ProductTier };

export type OrderStatus =
  | 'aguardando_briefing'
  | 'em_producao'
  | 'em_revisao'
  | 'entregue'
  | 'aprovado';

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  document: string; // CPF or CNPJ
  acceptedTerms: boolean;
}

export interface PaymentData {
  method: 'pix' | 'credit_card';
  status: 'pending' | 'approved' | 'failed';
  txId: string;
  paidAt?: string;
  amount: number;
  installments?: number;
}

export interface BriefingData {
  businessName: string;
  segment: string;
  targetAudience: string;
  mainGoal: string;
  toneOfVoice: string;
  referencesText: string;
  deadlineConstraint?: string;
  extraNotes?: string;
  confirmedAt?: string;
  chatTranscript?: { role: 'assistant' | 'user'; text: string; timestamp: string }[];
}

export interface DeliverableItem {
  id: string;
  title: string;
  type: 'pdf' | 'image' | 'video' | 'html';
  previewUrl?: string;
  downloadUrl?: string;
  content?: string;
  description: string;
  fileSize?: string;
  approvedByCuratorName: string;
}

export interface OrderTimelineEvent {
  timestamp: string;
  title: string;
  description: string;
  status: OrderStatus;
}

export interface AdjustmentRequest {
  id: string;
  requestedAt: string;
  notes: string;
  status: 'pending' | 'resolved';
}

export interface Order {
  id: string;
  createdAt: string;
  productSlug: string;
  tierLevel: TierLevel;
  productTitle: string;
  tierName: string;
  price: number;
  deliveryDays: number;
  customer: CustomerData;
  payment: PaymentData;
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
  briefing?: BriefingData;
  deliverables?: DeliverableItem[];
  revisionRoundsTotal: number;
  revisionRoundsUsed: number;
  adjustments: AdjustmentRequest[];
}

export interface DiagnosticoFormData {
  // Passo 1: O negócio
  businessName: string; // Nome do negócio ou marca (obrigatório)
  segment: string; // Segmento de atuação (obrigatório)
  whatItDoes: string; // O que o seu negócio vende ou faz, em uma frase? (obrigatório)
  targetAudience?: string; // Para quem você vende? (público-alvo) (opcional)

  // Passo 2: Situação atual
  currentChannels: string[]; // Canais onde já tem presença
  postingFrequency: string; // Com que frequência você publica ou anuncia hoje? (obrigatório)
  monthlyInvestment: string; // Quanto investe em marketing hoje por mês? (obrigatório)
  priceRange?: string; // Qual a faixa de preço do que você vende? (opcional)

  // Passo 3: O objetivo e a dor
  mainGoal: string; // Qual o objetivo prioritário (obrigatório)
  mainDifficulty: string; // Qual é a sua maior dificuldade com marketing hoje? (obrigatório)
  city?: string; // Cidade e estado (opcional)
  contactEmail: string; // E-mail profissional (obrigatório)
  lgpdConsent: boolean; // Consentimento LGPD (obrigatório)
}

export interface DiagnosticoPillars {
  estrategico: number;
  digital: number;
  publicidade: number;
  comunicacao: number;
}

export interface DiagnosticoGeminiResponse {
  notaGeral: number;
  notasPorPilar: DiagnosticoPillars;
  pontosFortes: string[];
  oportunidades: string[];
  sloganSugerido: string;
  produtoRecomendado: string;
  motivoRecomendacao: string;
}

export interface DiagnosticoResult extends DiagnosticoGeminiResponse {
  businessName: string;
  segment: string;
  whatItDoes: string;
  generatedAt: string;
  isAIGenerated: boolean;
  contactEmail?: string;
}
