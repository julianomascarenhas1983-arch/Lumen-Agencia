import React from 'react';
import { useLumen } from '../context/LumenContext';
import { PILLARS } from '../data/catalog';
import { ArrowRight, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CatalogVitrine: React.FC = () => {
  const { products, navigate } = useLumen();

  return (
    <section className="py-20 md:py-28 bg-[#070A17] border-b border-[rgba(243,241,234,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-widest text-[#F6C453] mb-3">
              02 // Vitrine de Soluções
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F3F1EA]">
              Produtos de marketing com preço fixo e prazo contratual.
            </h2>
            <p className="mt-4 text-base text-[#98A1BC]">
              Sem reuniões intermináveis de orçamento. Escolha o serviço, selecione o nível ideal para o momento do seu negócio e inicie a produção imediatamente.
            </p>
          </div>

          <button
            onClick={() => navigate('produtos')}
            className="self-start md:self-end text-sm font-semibold text-[#F6C453] hover:text-[#ffd875] flex items-center gap-2 border-b border-[#F6C453]/40 pb-1"
          >
            <span>Ver tabela comparativa completa</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => {
            const pillar = PILLARS[product.pillar];
            // Compute lowest price tier
            const startingPrice = Math.min(
              ...Object.values(product.tiers).map((t) => t.price)
            );
            const fastestDelivery = Math.min(
              ...Object.values(product.tiers).map((t) => t.deliveryDays)
            );

            return (
              <div
                key={product.slug}
                className="hud-corner bg-[#0C1226]/90 border border-[rgba(243,241,234,0.12)] rounded-xl p-6 flex flex-col justify-between hover:border-[#19D3F3]/60 hover:shadow-[0_0_25px_rgba(25,211,243,0.15)] transition-all duration-300 group backdrop-blur-sm relative"
              >
                <div>
                  {/* Top tech telemetry & tags */}
                  <div className="flex items-center justify-between gap-2 mb-4 font-mono text-[10px]">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono uppercase px-2 py-0.5 rounded border border-current text-[11px]"
                        style={{ color: pillar.colorToken }}
                      >
                        {pillar.name}
                      </span>
                      <span className="text-[#98A1BC]/60 tracking-wider">
                        #SVC-0{idx + 1}
                      </span>
                    </div>

                    {product.badge ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F6C453]/15 text-[#F6C453] px-2 py-0.5 rounded border border-[#F6C453]/30">
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[#19D3F3]/70">
                        GEMINI 3.6 READY
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading text-xl font-bold text-[#F3F1EA] group-hover:text-[#F6C453] transition-colors mb-2.5">
                    {product.title}
                  </h3>
                  <p className="text-sm text-[#98A1BC] line-clamp-3 mb-6">
                    {product.shortDescription}
                  </p>

                  {/* Sample deliverables */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-[rgba(243,241,234,0.08)]">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-[#98A1BC] font-semibold mb-2 flex items-center justify-between">
                      <span>Entregáveis do nível inicial:</span>
                      <span className="text-[#19D3F3] text-[9px]">CURADORIA SÊNIOR</span>
                    </div>
                    {product.tiers.essencial.deliverables.slice(0, 2).map((del, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#F3F1EA]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F6C453] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom: Pricing & CTA */}
                <div className="pt-6 border-t border-[rgba(243,241,234,0.1)]">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#98A1BC] block">Preço Tabelado</span>
                      <span className="font-heading text-2xl font-extrabold text-[#F3F1EA]">
                        R$ {startingPrice.toLocaleString('pt-BR')}
                        {product.slug === 'lumen-continuo' && (
                          <span className="text-xs font-normal text-[#98A1BC]">/mês</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#98A1BC] bg-[#050813] px-2 py-1 rounded border border-white/5">
                      <Clock className="w-3.5 h-3.5 text-[#19D3F3]" />
                      <span>SLA {fastestDelivery}d</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('produto-detalhe', { slug: product.slug, tier: 'pro' })}
                    className="w-full bg-white/5 hover:bg-[#FF3B30] text-[#F3F1EA] py-3 rounded-lg text-xs font-bold tracking-wide transition-all border border-white/10 hover:border-transparent flex items-center justify-center gap-2 group-hover:bg-[#FF3B30] min-h-[44px] shadow-sm hover:shadow-[0_0_20px_rgba(255,59,48,0.3)]"
                  >
                    <span>Configurar e Contratar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
