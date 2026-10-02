import React, { useState } from 'react';
import { useLumen } from '../context/LumenContext';
import { PILLARS, TierLevel } from '../data/catalog';
import { createWhatsAppPlanUrl, LUMEN_WHATSAPP_DISPLAY } from '../utils/whatsapp';
import {
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  UserCheck,
  MessageCircle,
  Zap,
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const { products, selectedProductSlug, selectedTier, navigate } = useLumen();

  // Find product or fallback to first product
  const product =
    products.find((p) => p.slug === selectedProductSlug) || products[0];

  const [currentTier, setCurrentTier] = useState<TierLevel>(selectedTier || 'pro');

  const tierData = product.tiers[currentTier];
  const pillar = PILLARS[product.pillar];

  const whatsAppUrl = createWhatsAppPlanUrl({
    productTitle: product.title,
    tierName: tierData.name,
    price: tierData.price,
    deliveryDays: tierData.deliveryDays,
    revisionsCount: tierData.revisionsCount,
    isRecurring: product.slug === 'lumen-continuo',
  });

  return (
    <div className="py-12 md:py-20 bg-[#070A17] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('produtos')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#98A1BC] hover:text-[#F3F1EA] mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar ao catálogo de produtos</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Product Information & Comparison */}
          <div className="lg:col-span-7">
            {/* Category and Badges */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs font-mono uppercase px-2.5 py-1 rounded border border-current"
                style={{ color: pillar.colorToken }}
              >
                {pillar.name}
              </span>
              {product.badge && (
                <span className="text-[11px] font-bold uppercase tracking-wider bg-[#F6C453]/15 text-[#F6C453] px-2.5 py-1 rounded">
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F3F1EA] tracking-tight mb-4">
              {product.title}
            </h1>

            <p className="text-base sm:text-lg text-[#98A1BC] leading-relaxed mb-8">
              {product.fullDescription}
            </p>

            {/* Mandatory Human Review Badge */}
            <div className="bg-[#0C1226] border border-[#19D3F3]/30 rounded-xl p-4 flex items-start gap-3.5 mb-10">
              <div className="p-2 rounded-lg bg-[#19D3F3]/10 text-[#19D3F3] shrink-0 mt-0.5">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-[#F3F1EA] mb-1">
                  Revisão Obrigatória de Especialista Sênior Lumen
                </h4>
                <p className="text-xs text-[#98A1BC] leading-relaxed">
                  Mesmo com geração acelerada por modelos avançados de IA, seu projeto não é entregue de forma bruta. Um diretor de arte ou estrategista humano analisa, refina e valida 100% dos entregáveis antes do envio final.
                </p>
              </div>
            </div>

            {/* Tier Comparison Switcher */}
            <div className="mb-8">
              <div className="text-xs font-mono uppercase text-[#98A1BC] tracking-wider mb-3">
                Selecione o nível desejado para comparar:
              </div>
              <div className="grid grid-cols-3 gap-2 bg-[#0C1226] p-1.5 rounded-xl border border-[rgba(243,241,234,0.12)]">
                {(['essencial', 'pro', 'premium'] as TierLevel[]).map((level) => {
                  const t = product.tiers[level];
                  const isActive = currentTier === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setCurrentTier(level)}
                      className={`py-3 px-2 rounded-lg text-center transition-all ${
                        isActive
                          ? 'bg-[#F6C453] text-[#070A17] font-bold shadow-md'
                          : 'text-[#98A1BC] hover:text-[#F3F1EA] font-medium'
                      }`}
                    >
                      <span className="block text-xs uppercase tracking-wide">
                        {t.name.split(' ')[0]}
                      </span>
                      <span className="block text-sm font-bold mt-0.5">
                        R$ {t.price.toLocaleString('pt-BR')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* What is Included and What is Not Included */}
            <div className="space-y-6">
              <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.1)] rounded-xl p-6">
                <h3 className="font-heading text-base font-bold text-[#F3F1EA] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F6C453]" />
                  <span>O que está incluído no nível {tierData.name}:</span>
                </h3>
                <ul className="space-y-3">
                  {tierData.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#F3F1EA]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F6C453] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {tierData.notIncluded && tierData.notIncluded.length > 0 && (
                <div className="bg-[#0C1226]/50 border border-[rgba(243,241,234,0.08)] rounded-xl p-6">
                  <h3 className="font-heading text-sm font-bold text-[#98A1BC] mb-4 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-[#98A1BC]" />
                    <span>O que não está incluído neste nível:</span>
                  </h3>
                  <ul className="space-y-2">
                    {tierData.notIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-[#98A1BC]/80">
                        <span className="text-[#98A1BC]/50 mt-0.5">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sticky Configurator Box */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-[#0C1226] border border-[rgba(246,196,83,0.3)] rounded-2xl p-6 sm:p-8 shadow-2xl">
              
              <div className="font-mono text-xs text-[#F6C453] uppercase tracking-wider mb-2">
                Resumo da Contratação
              </div>
              <h2 className="font-heading text-2xl font-bold text-[#F3F1EA] mb-1">
                {product.title}
              </h2>
              <div className="text-xs text-[#98A1BC] mb-6">
                Nível Selecionado: <span className="text-[#F6C453] font-semibold">{tierData.name}</span>
              </div>

              {/* Dynamic Price Display */}
              <div className="py-6 border-y border-[rgba(243,241,234,0.1)] mb-6">
                <div className="text-xs text-[#98A1BC] mb-1">Preço final fixo tabelado:</div>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-4xl sm:text-5xl font-extrabold text-[#F3F1EA]">
                    R$ {tierData.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  {product.slug === 'lumen-continuo' && (
                    <span className="text-sm font-normal text-[#98A1BC]">/mês</span>
                  )}
                </div>
                <div className="text-xs text-[#19D3F3] font-semibold mt-1">
                  À vista via Pix ou em até 12x no cartão
                </div>
              </div>

              {/* Contractual Parameters */}
              <div className="space-y-4 mb-8 text-xs">
                <div className="flex items-center justify-between text-[#98A1BC]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#19D3F3]" /> Prazo contratual de entrega:
                  </span>
                  <span className="font-bold text-[#F3F1EA]">
                    {tierData.deliveryDays} {tierData.deliveryDays === 1 ? 'dia útil' : 'dias úteis'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#98A1BC]">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-[#FF2E93]" /> Rodadas de revisão inclusas:
                  </span>
                  <span className="font-bold text-[#F3F1EA]">
                    {tierData.revisionsCount} {tierData.revisionsCount === 1 ? 'rodada' : 'rodadas'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#98A1BC]">
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" /> Atendimento direto:
                  </span>
                  <span className="font-bold text-[#25D366]">
                    WhatsApp da Lumen
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp Action Button */}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-[#070A17] py-4 px-6 rounded-xl text-sm font-extrabold tracking-wide transition-all shadow-[0_6px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.55)] hover:scale-[1.02] active:scale-[0.98] min-h-[52px] flex items-center justify-center gap-2.5 mb-4 group"
              >
                <MessageCircle className="w-5 h-5 fill-[#070A17] text-[#070A17] shrink-0" />
                <span>Escolher plano e ir para o WhatsApp</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              {/* Trust & Process explanation */}
              <div className="p-3.5 rounded-xl bg-[#070A17] border border-[rgba(243,241,234,0.08)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#F3F1EA]">
                  <Zap className="w-3.5 h-3.5 text-[#F6C453]" />
                  <span>Como funciona a contratação:</span>
                </div>
                <p className="text-[11px] text-[#98A1BC] leading-relaxed">
                  Ao clicar, você será redirecionado para o WhatsApp oficial da Lumen (<strong className="text-[#F3F1EA]">{LUMEN_WHATSAPP_DISPLAY}</strong>) com o plano <strong className="text-[#F6C453]">{tierData.name}</strong> e valor de <strong className="text-[#F3F1EA]">R$ {tierData.price.toLocaleString('pt-BR')}</strong> já organizados para você ser atendido por um especialista sênior.
                </p>
                <div className="text-[10px] text-[#98A1BC]/70 flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3 h-3 text-[#19D3F3]" />
                  <span>Sem formulários cansativos • Sem checkout • Atendimento humano</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
