import React, { useState, useEffect, useRef } from 'react';
import { useLumen } from '../context/LumenContext';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { InteractiveLightStudio } from './InteractiveLightStudio';

export const HeroSection: React.FC = () => {
  const { navigate } = useLumen();
  const heroRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Relative mouse position from center (-1 to 1)
    const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    setMouseOffset({
      x: Math.max(-1, Math.min(1, relX)),
      y: Math.max(-1, Math.min(1, relY)),
    });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Residual offset calculations for print out-of-registration
  const cyanShiftX = isReducedMotion ? 0 : -2 + mouseOffset.x * -2.5;
  const cyanShiftY = isReducedMotion ? 0 : -1 + mouseOffset.y * -1.5;

  const magentaShiftX = isReducedMotion ? 0 : 2 + mouseOffset.x * 2.5;
  const magentaShiftY = isReducedMotion ? 0 : 1 + mouseOffset.y * 1.5;

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28 border-b border-[rgba(243,241,234,0.1)]"
    >
      {/* Golden conical light beam in top-right corner */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 w-[550px] h-[550px] md:w-[750px] md:h-[750px] opacity-25 md:opacity-35 blur-[90px] select-none"
        style={{
          background: 'radial-gradient(circle at 75% 25%, #F6C453 0%, rgba(246, 196, 83, 0.4) 35%, rgba(7, 10, 23, 0) 70%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle editorial marks in corners */}
      <div className="absolute top-6 left-6 pointer-events-none select-none text-[rgba(243,241,234,0.3)] font-mono text-[10px] hidden sm:flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#19D3F3]" />
        <span>CALIBRAÇÃO CMYK [100.80.0.0]</span>
      </div>
      <div className="absolute top-6 right-6 pointer-events-none select-none text-[rgba(243,241,234,0.3)] font-mono text-[10px] hidden sm:flex items-center gap-2">
        <span>CURADORIA SÊNIOR CERTIFICADA</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#F6C453]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Tagline / Assinatura */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(246,196,83,0.35)] bg-[#F6C453]/10 text-[#F6C453] text-xs font-mono tracking-wider mb-6 shadow-[0_0_20px_rgba(246,196,83,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F6C453] animate-ping" />
            <span>MARCAS QUE SE FAZEM VER</span>
          </div>

          {/* MOMENTO MARCANTE: Giant "Lumen" with print out-of-registration converging layers */}
          <div className="relative py-4 my-2 select-none">
            {/* Cyan layer (left/top misregistration) */}
            <h1
              className="font-heading font-extrabold tracking-tighter text-6xl sm:text-8xl md:text-9xl lg:text-[140px] leading-none absolute inset-0 flex items-center justify-center text-[#19D3F3] pointer-events-none opacity-80 mix-blend-screen transition-transform duration-100 ease-out animate-converge-cyan"
              style={{
                transform: `translate(${cyanShiftX}px, ${cyanShiftY}px)`,
              }}
              aria-hidden="true"
            >
              Lumen
            </h1>

            {/* Magenta layer (right/bottom misregistration) */}
            <h1
              className="font-heading font-extrabold tracking-tighter text-6xl sm:text-8xl md:text-9xl lg:text-[140px] leading-none absolute inset-0 flex items-center justify-center text-[#FF2E93] pointer-events-none opacity-80 mix-blend-screen transition-transform duration-100 ease-out animate-converge-magenta"
              style={{
                transform: `translate(${magentaShiftX}px, ${magentaShiftY}px)`,
              }}
              aria-hidden="true"
            >
              Lumen
            </h1>

            {/* Main Ink (K) layer in pure ivory white */}
            <h1 className="font-heading font-extrabold tracking-tighter text-6xl sm:text-8xl md:text-9xl lg:text-[140px] leading-none relative text-[#F3F1EA]">
              Lumen
            </h1>
          </div>

          {/* Subtítulo direto e objetivo */}
          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-[#98A1BC] max-w-2xl mx-auto font-normal leading-relaxed">
            Agência virtual de marketing estratégico, publicidade e comunicação.{' '}
            <span className="text-[#F3F1EA] font-medium">
              Inteligência artificial para velocidade de execução. Curadoria de especialistas seniores para estratégia e refinamento.
            </span>
          </p>

          {/* CTAs principais */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('produtos')}
              className="w-full sm:w-auto bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] px-8 py-3.5 rounded-full text-sm font-bold tracking-wide transition-all shadow-[0_6px_24px_rgba(255,59,48,0.35)] hover:shadow-[0_8px_30px_rgba(255,59,48,0.5)] hover:scale-[1.02] active:scale-[0.98] min-h-[48px] flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#F6C453]"
            >
              <span>Ver produtos e preços fixos</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('diagnostico')}
              className="w-full sm:w-auto bg-[#0C1226] hover:bg-[#121a36] text-[#F3F1EA] border border-[rgba(246,196,83,0.3)] hover:border-[#F6C453] px-7 py-3.5 rounded-full text-sm font-semibold transition-all min-h-[48px] flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(246,196,83,0.1)]"
            >
              <Sparkles className="w-4 h-4 text-[#F6C453] group-hover:rotate-12 transition-transform" />
              <span>Diagnóstico gratuito</span>
            </button>
          </div>

          {/* Micro badges com valores reais do método */}
          <div className="mt-10 pt-6 border-t border-[rgba(243,241,234,0.08)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-[#98A1BC]">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#19D3F3] shadow-[0_0_8px_#19D3F3]" />
              <span>Preço fixo tabelado, sem surpresa</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF2E93] shadow-[0_0_8px_#FF2E93]" />
              <span>Revisão obrigatória de especialista humano</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFD400] shadow-[0_0_8px_#FFD400]" />
              <span>Contratação via WhatsApp com revisões garantidas</span>
            </div>
          </div>

          {/* Interactive Light Studio (Mesa de Luz Criativa) */}
          <InteractiveLightStudio />

        </div>
      </div>

      {/* CMYK 4-color thin registration bar directly under the hero */}
      <div className="mt-16 w-full h-1 grid grid-cols-4">
        <div className="bg-[#19D3F3] h-full" title="Cyan 100%" />
        <div className="bg-[#FF2E93] h-full" title="Magenta 100%" />
        <div className="bg-[#FFD400] h-full" title="Yellow 100%" />
        <div className="bg-[#F3F1EA] h-full" title="Black/Ivory" />
      </div>
    </section>
  );
};

