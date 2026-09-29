import React from 'react';
import { useLumen } from '../context/LumenContext';
import { ShieldCheck, UserCheck, Lock, Eye, Sparkles, Check, ArrowRight } from 'lucide-react';

export const HumanCuratedSection: React.FC = () => {
  const { navigate } = useLumen();

  return (
    <section className="py-20 md:py-28 bg-[#070A17] border-b border-[rgba(243,241,234,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="font-mono text-xs uppercase tracking-widest text-[#F6C453] mb-3">
            04 // Filosofia & Responsabilidade
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F3F1EA]">
            Por que IA pura não basta — e por que a curadoria humana é o nosso filtro de ouro.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#98A1BC] leading-relaxed">
            Ferramentas generativas criam volume em segundos, mas desconhecem a cultura brasileira, nuances de categoria e a sutileza do design autoral. Na Lumen, a IA faz o trabalho pesado de iteração; os especialistas garantem a relevância e a originalidade da sua marca.
          </p>
        </div>

        {/* 3 Pillars of Trust & Governance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] p-8 rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#19D3F3]/10 border border-[#19D3F3]/30 flex items-center justify-center mb-6">
                <UserCheck className="w-5 h-5 text-[#19D3F3]" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#F3F1EA] mb-3">
                Assinatura de Curador Sênior
              </h3>
              <p className="text-sm text-[#98A1BC] leading-relaxed">
                Nenhuma peça, plano ou roteiro sai da agência sem a inspeção e a aprovação de um diretor de arte ou estrategista humano com experiência comprovada em grandes marcas.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[rgba(243,241,234,0.08)] flex items-center gap-2 text-xs text-[#19D3F3]">
              <Check className="w-3.5 h-3.5" />
              <span>Sem alucinações ou clichês vazios</span>
            </div>
          </div>

          <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] p-8 rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#FF2E93]/10 border border-[#FF2E93]/30 flex items-center justify-center mb-6">
                <Lock className="w-5 h-5 text-[#FF2E93]" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#F3F1EA] mb-3">
                Privacidade & Conformidade LGPD
              </h3>
              <p className="text-sm text-[#98A1BC] leading-relaxed">
                Seus briefings, métricas e segredos comerciais não são compartilhados para treino público de inteligências artificiais. Tratamos cada projeto sob rigorosa confidencialidade.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[rgba(243,241,234,0.08)] flex items-center gap-2 text-xs text-[#FF2E93]">
              <Check className="w-3.5 h-3.5" />
              <span>Dados confidenciais protegidos</span>
            </div>
          </div>

          <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] p-8 rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#FFD400]/10 border border-[#FFD400]/30 flex items-center justify-center mb-6">
                <Eye className="w-5 h-5 text-[#FFD400]" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#F3F1EA] mb-3">
                Transparência de Processo
              </h3>
              <p className="text-sm text-[#98A1BC] leading-relaxed">
                Você sabe exatamente o que a IA auxiliou a conceber e onde o curador humano lapidou. Sem promessas falsas de "mágica": apenas engenharia de processo de alto nível.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[rgba(243,241,234,0.08)] flex items-center gap-2 text-xs text-[#FFD400]">
              <Check className="w-3.5 h-3.5" />
              <span>Relatório de curadoria na entrega</span>
            </div>
          </div>

        </div>

        {/* Honest Portfolio State Callout (Anti-slop rule) */}
        <div className="bg-gradient-to-r from-[#0C1226] to-[#070A17] border border-[rgba(246,196,83,0.3)] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6C453]/10 text-[#F6C453] text-xs font-mono mb-4">
              + POLÍTICA DE VERACIDADE
            </div>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-[#F3F1EA] mb-3">
              Não inventamos clientes fictícios, cases falsos nem prêmios maquiados.
            </h3>
            <p className="text-sm sm:text-base text-[#98A1BC] leading-relaxed">
              Preferimos que você teste a solidez do nosso método pelo diagnóstico interativo ou experimente uma peça avulsa. A confiança se conquista na entrega, não em números inflados no rodapé.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => navigate('diagnostico')}
              className="bg-[#070A17] hover:bg-black text-[#F3F1EA] border border-[rgba(243,241,234,0.2)] px-6 py-3.5 rounded-full text-xs font-bold transition-all text-center min-h-[44px] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#F6C453]" />
              <span>Testar diagnóstico gratuito</span>
            </button>
            <button
              onClick={() => navigate('produtos')}
              className="bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] px-6 py-3.5 rounded-full text-xs font-bold transition-all text-center min-h-[44px] flex items-center justify-center gap-2"
            >
              <span>Escolher um produto</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
