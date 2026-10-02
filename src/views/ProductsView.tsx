import React, { useState } from 'react';
import { useLumen } from '../context/LumenContext';
import { PILLARS, PillarId } from '../data/catalog';
import { Sparkles, ArrowRight, Clock, CheckCircle2, Search, SlidersHorizontal, Loader2 } from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { products, navigate } = useLumen();
  const [selectedPillar, setSelectedPillar] = useState<PillarId | 'todos'>('todos');
  const [userQuery, setUserQuery] = useState('');
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    slug: string;
    tier: string;
    productTitle: string;
    justification: string;
  } | null>(null);

  const filteredProducts =
    selectedPillar === 'todos'
      ? products
      : products.filter((p) => p.pillar === selectedPillar);

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setIsRecommending(true);
    try {
      const response = await fetch('/api/recomendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery }),
      });
      const data = await response.json();
      setRecommendation(data);
    } catch (err) {
      console.error('Error recommending product:', err);
    } finally {
      setIsRecommending(false);
    }
  };

  return (
    <div className="py-12 md:py-20 bg-[#070A17] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="font-mono text-xs uppercase tracking-widest text-[#F6C453] mb-3">
            CATÁLOGO ABERTO // TABELA DE SERVIÇOS
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[#F3F1EA] tracking-tight">
            Soluções com preço fixo, escopo fechado e garantia de entrega.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#98A1BC]">
            Escolha o produto, configure o nível adequado para a maturidade do seu negócio e comece a produção hoje mesmo.
          </p>
        </div>

        {/* AI Product Recommender Bar ("Descreva o que você precisa") */}
        <div className="bg-[#0C1226] border border-[rgba(246,196,83,0.3)] rounded-2xl p-6 mb-12 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#F6C453]" />
            <h3 className="font-heading text-sm uppercase tracking-wider text-[#F6C453] font-bold">
              Recomendador Inteligente da Lumen
            </h3>
          </div>
          <p className="text-xs text-[#98A1BC] mb-4">
            Em dúvida sobre qual serviço contratar? Digite seu objetivo em poucas palavras e nossa IA indicará o produto e nível ideais.
          </p>

          <form onSubmit={handleRecommend} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ex.: Preciso criar a marca do meu novo consultório e ter templates prontos para o Instagram..."
                className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] transition-colors min-h-[44px]"
              />
            </div>
            <button
              type="submit"
              disabled={isRecommending || !userQuery.trim()}
              className="bg-[#F6C453] hover:bg-[#ffd875] text-[#070A17] px-6 py-3 rounded-xl text-xs font-bold transition-all disabled:opacity-50 min-h-[44px] flex items-center justify-center gap-2 shrink-0"
            >
              {isRecommending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analisando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Recomendar produto</span>
                </>
              )}
            </button>
          </form>

          {/* AI Recommendation Box */}
          {recommendation && (
            <div className="mt-5 p-4 rounded-xl bg-[#070A17] border border-[#F6C453]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#F6C453] font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sugestão: {recommendation.productTitle} (Nível {recommendation.tier.toUpperCase()})</span>
                </div>
                <p className="text-xs text-[#98A1BC]">{recommendation.justification}</p>
              </div>

              <button
                onClick={() =>
                  navigate('produto-detalhe', {
                    slug: recommendation.slug,
                    tier: (recommendation.tier as any) || 'pro',
                  })
                }
                className="bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] px-4 py-2 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors"
              >
                <span>Ver este produto</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Pillar Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedPillar('todos')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedPillar === 'todos'
                ? 'bg-[#F3F1EA] text-[#070A17] border-[#F3F1EA]'
                : 'bg-transparent text-[#98A1BC] border-[rgba(243,241,234,0.12)] hover:border-[rgba(243,241,234,0.3)]'
            }`}
          >
            Todos os produtos ({products.length})
          </button>

          {(Object.keys(PILLARS) as PillarId[]).map((key) => {
            const pillar = PILLARS[key];
            const isSelected = selectedPillar === key;
            return (
              <button
                key={pillar.id}
                onClick={() => setSelectedPillar(pillar.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-white/10 text-[#F3F1EA] border-current'
                    : 'bg-transparent text-[#98A1BC] border-[rgba(243,241,234,0.12)] hover:border-[rgba(243,241,234,0.3)]'
                }`}
                style={{ borderColor: isSelected ? pillar.colorToken : undefined }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: pillar.colorToken }}
                />
                <span>{pillar.name}</span>
              </button>
            );
          })}
        </div>

        {/* Product Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const pillar = PILLARS[product.pillar];
            const startingPrice = Math.min(...Object.values(product.tiers).map((t) => t.price));
            const tiersList = Object.values(product.tiers);

            return (
              <div
                key={product.slug}
                className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-xl p-6 flex flex-col justify-between hover:border-[rgba(243,241,234,0.3)] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[11px] font-mono uppercase px-2 py-0.5 rounded border border-current"
                      style={{ color: pillar.colorToken }}
                    >
                      {pillar.name}
                    </span>
                    {product.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F6C453]/15 text-[#F6C453] px-2 py-0.5 rounded">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading text-xl font-bold text-[#F3F1EA] group-hover:text-[#F6C453] transition-colors mb-2">
                    {product.title}
                  </h3>
                  <p className="text-xs text-[#98A1BC] mb-5 leading-relaxed">
                    {product.shortDescription}
                  </p>

                  {/* Tier pricing preview pills */}
                  <div className="grid grid-cols-3 gap-1.5 mb-6 bg-[#070A17] p-2 rounded-lg border border-[rgba(243,241,234,0.06)] text-center">
                    {tiersList.map((t) => (
                      <div key={t.level} className="p-1">
                        <span className="text-[10px] uppercase text-[#98A1BC] block">{t.name.split(' ')[0]}</span>
                        <span className="text-xs font-bold text-[#F3F1EA]">
                          R${t.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Deliverables snippet */}
                  <div className="space-y-1.5 mb-6 text-xs text-[#F3F1EA]">
                    <div className="text-[10px] font-mono uppercase text-[#98A1BC]">Entregáveis inclusos:</div>
                    {product.tiers.pro.deliverables.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F6C453] shrink-0 mt-0.5" />
                        <span className="text-xs line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[rgba(243,241,234,0.08)]">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xs text-[#98A1BC]">A partir de</span>
                    <span className="font-heading text-xl font-bold text-[#F3F1EA]">
                      R$ {startingPrice.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate('produto-detalhe', { slug: product.slug, tier: 'pro' })}
                    className="w-full bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] py-3 rounded-lg text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <span>Escolher plano e contratar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
