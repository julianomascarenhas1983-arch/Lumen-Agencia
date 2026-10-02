import React from 'react';
import { useLumen } from '../context/LumenContext';
import { CheckCircle2, MessageSquare, Sparkles, RefreshCw, FileCheck } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const { navigate } = useLumen();

  const steps = [
    {
      num: '01',
      title: 'Escolha do produto e nível',
      tag: 'Transparência total',
      color: '#19D3F3',
      description:
        'Navegue pelo catálogo com preços abertos, prazos e entregáveis detalhados. Selecione o nível ideal (Essencial, Pro ou Premium) e clique para iniciar no WhatsApp da Lumen.',
    },
    {
      num: '02',
      title: 'Alinhamento direto no WhatsApp',
      tag: 'Sem burocracia',
      color: '#FF2E93',
      description:
        'A mensagem com o plano e valor já vai preenchida. Um especialista da Lumen recebe seu pedido na hora, alinha o objetivo do seu negócio e inicia o briefing de forma dinâmica.',
    },
    {
      num: '03',
      title: 'Produção com curadoria de especialistas',
      tag: 'Padrão sênior',
      color: '#FFD400',
      description:
        'A IA acelera rascunhos, variações e estruturas de dados. Em seguida, diretores de arte, estrategistas e redatores seniores refinam, lapidam e auditam cada detalhe com rigor publicitário.',
    },
    {
      num: '04',
      title: 'Entrega com rodadas de ajuste garantidas',
      tag: 'Garantia contratual',
      color: '#F6C453',
      description:
        'Seus materiais prontos são entregues em alta resolução diretamente com seu curador responsável, com rodadas contratuais de revisão inclusas para sua total segurança.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#0C1226]/50 border-b border-[rgba(243,241,234,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="font-mono text-xs uppercase tracking-widest text-[#98A1BC] mb-3">
            03 // O Ciclo Lumen
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F3F1EA]">
            Como funciona: do clique à entrega final em 4 etapas lineares.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#98A1BC]">
            Substituímos a burocracia de cadastros e checkouts por atendimento direto no WhatsApp com nossos curadores especialistas.
          </p>
        </div>

        {/* Steps Grid with thin connecting dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-[#070A17] border border-[rgba(243,241,234,0.1)] rounded-xl p-6 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="font-heading text-4xl font-extrabold"
                    style={{ color: step.color }}
                  >
                    {step.num}
                  </span>
                  <span
                    className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5"
                    style={{ color: step.color }}
                  >
                    {step.tag}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-[#F3F1EA] mb-3 leading-snug">
                  {step.title}
                </h3>

                <p className="text-sm text-[#98A1BC] leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Step indicator dot */}
              <div className="mt-6 pt-4 border-t border-[rgba(243,241,234,0.06)] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: step.color }} />
                <span className="text-[11px] font-mono text-[#98A1BC]">Etapa {step.num}/04</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
