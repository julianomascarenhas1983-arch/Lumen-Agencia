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

export interface InteractionMessage {
  id: string;
  senderRole: 'client' | 'admin' | 'curator';
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  attachments?: { name: string; url?: string; size?: string }[];
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  document: string;
  companyName: string;
  segment: string;
  city?: string;
  website?: string;
  instagram?: string;
  avatarUrl?: string;
  joinedAt: string;
  role?: 'client' | 'admin' | 'curator';
  notesFromTeam?: string; // Private internal notes for agency users
  accountManager?: string; // Assigned Lumen manager
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
  interactions?: InteractionMessage[];
  receiptUrl?: string;
  contractNumber?: string;
}

export interface DiagnosticoInput {
  businessName: string;
  segment: string;
  city: string;
  mainGoal: string;
  currentChannels: string[];
  contactEmail: string;
  lgpdConsent: boolean;
}

export interface DiagnosticoResult {
  businessName: string;
  segment: string;
  overallScore: number;
  subscores: {
    estrategia: number;
    digital: number;
    publicidade: number;
    comunicacao: number;
  };
  strengths: string[];
  opportunities: string[];
  suggestedSlogan: string;
  recommendedProducts: {
    slug: string;
    tier: TierLevel;
    title: string;
    reason: string;
  }[];
  generatedAt: string;
}
