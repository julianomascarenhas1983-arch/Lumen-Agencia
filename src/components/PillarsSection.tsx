import React from 'react';
import { useLumen } from '../context/LumenContext';
import { PILLARS, PillarId } from '../data/catalog';
import { Compass, Smartphone, Palette, MessageSquareText, ArrowRight } from 'lucide-react';

const pillarIcons: Record<PillarId, React.ReactNode> = {
  estrategia: <Compass className="w-5 h-5 text-[#19D3F3]" />,
  digital: <Smartphone className="w-5 h-5 text-[#FF2E93]" />,
  publicidade: <Palette className="w-5 h-5 text-[#FFD400]" />,
  comunicacao: <MessageSquareText className="w-5 h-5 text-[#F6C453]" />,
};

const pillarBorders: Record<PillarId, string> = {
  estrategia: 'border-l-4 border-l-[#19D3F3]',
  digital: 'border-l-4 border-l-[#FF2E93]',
  publicidade: 'border-l-4 border-l-[#FFD400]',
  comunicacao: 'border-l-4 border-l-[#F6C453]',
};

export const PillarsSection: React.FC = () => {
  const { navigate } = useLumen();

  return (
    <section className="py-20 md:py-28 bg-[#0C1226]/60 border-b border-[rgba(243,241,234,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="font-mono text-xs uppercase tracking-widest text-[#98A1BC] mb-3">
            01 // Estrutura Operacional
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F3F1EA]">
            Quatro pilares integrados para marcas que não aceitam a invisibilidade.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#98A1BC] leading-relaxed">
            Eliminamos os departamentos engessados das agências tradicionais. Na Lumen, cada pilar combina ferramentas generativas de alta velocidade com curadores com mais de uma década de experiência no mercado.
          </p>
        </div>

        {/* 4 Pillars in ordered rows/columns with colored vertical left stripe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(PILLARS) as PillarId[]).map((key, index) => {
            const pillar = PILLARS[key];
            return (
              <div
                key={pillar.id}
                className={`bg-[#070A17]/80 rounded-r-xl p-8 border border-[rgba(243,241,234,0.1)] ${pillarBorders[pillar.id]} transition-all hover:bg-[#070A17] hover:border-[rgba(243,241,234,0.2)] group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                        {pillarIcons[pillar.id]}
                      </div>
                      <span className="font-mono text-xs text-[#98A1BC]">
                        0{index + 1}
                      </span>
                    </div>
                    <span
                      className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-white/5"
                      style={{ color: pillar.colorToken }}
                    >
                      {pillar.id}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-[#F3F1EA] mb-2">
                    {pillar.name}
                  </h3>

                  <p className="text-sm font-semibold text-[#F6C453] mb-3">
                    {pillar.tagline}
                  </p>

                  <p className="text-sm text-[#98A1BC] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-[rgba(243,241,234,0.08)] flex items-center justify-between">
                  <span className="text-xs text-[#98A1BC]">Produtos com preço fixo</span>
                  <button
                    onClick={() => navigate('produtos')}
                    className="text-xs font-semibold text-[#F3F1EA] group-hover:text-[#F6C453] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Ver entregáveis</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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
