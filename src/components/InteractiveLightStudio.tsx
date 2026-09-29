import React, { useState } from 'react';
import { useLumen } from '../context/LumenContext';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Copy,
  Check,
  Eye,
  Sliders,
  Maximize2,
  Smartphone,
  CreditCard,
  Layout,
  Compass
} from 'lucide-react';

interface BrandPreset {
  id: string;
  niche: string;
  brandName: string;
  taglineBefore: string;
  taglineAfter: string;
  beforeDescription: string;
  afterDescription: string;
  colors: { name: string; hex: string; role: string }[];
  fontHeadline: string;
  fontBody: string;
  metrics: { label: string; value: string }[];
  feedSample: {
    headline: string;
    sub: string;
    badge: string;
  };
}

const BRAND_PRESETS: BrandPreset[] = [
  {
    id: 'saude',
    niche: 'Saúde & Longevidade Integrativa',
    brandName: 'Aurora Saúde Integrada',
    taglineBefore: 'Atendimento médico com qualidade e carinho para toda a família.',
    taglineAfter: 'A ciência da longevidade com a sensibilidade do cuidado sob medida.',
    beforeDescription: 'Comunicação genérica em azul hospitalar e fotos de banco de imagem. Baixa percepção de valor e guerra de preços por consulta.',
    afterDescription: 'Identidade visual sóbria e acolhedora em Verde Botânico e Ouro Nobre. Posicionamento premium focado em alta renda e prevenção contínua.',
    colors: [
      { name: 'Ouro Nobre', hex: '#F6C453', role: 'Acento Primário' },
      { name: 'Verde Botânico', hex: '#16382E', role: 'Base Institucional' },
      { name: 'Marfim Imperial', hex: '#F7F5F0', role: 'Superfície & Texto' },
      { name: 'Ciano Luz', hex: '#19D3F3', role: 'Contraste Digital' },
    ],
    fontHeadline: 'Syne Serif & Display',
    fontBody: 'Manrope Minimal',
    metrics: [
      { label: 'Ticket Médio', value: '+320%' },
      { label: 'Conversão no WhatsApp', value: '4.8x' },
      { label: 'Retenção Anual', value: '89%' },
    ],
    feedSample: {
      headline: 'O tempo não precisa desgastar sua vitalidade.',
      sub: 'Protocolos genômicos e acompanhamento de precisão.',
      badge: 'Longevidade Consciente',
    },
  },
  {
    id: 'gastronomia',
    niche: 'Alta Gastronomia & Café Autoral',
    brandName: 'Origens Café & Torrefação',
    taglineBefore: 'O melhor café da região com grãos selecionados e bolos frescos.',
    taglineAfter: 'Microlotes de altitude. O ritual sagrado entre a terra e a sua xícara.',
    beforeDescription: 'Cardápio em folha plastificada, posts com fotos tremidas de celular e logotipo feito em gerador automático gratuito.',
    afterDescription: 'Embalagens em papel kraft mineral com relevo seco, fotos cinematográficas com iluminação quente e narrativa de terroir sensorial.',
    colors: [
      { name: 'Âmbar Tostado', hex: '#E07A5F', role: 'Destaque Calor' },
      { name: 'Espresso Profundo', hex: '#1E1410', role: 'Fundo Nobre' },
      { name: 'Ocre Mineral', hex: '#FFD400', role: 'Selo de Origem' },
      { name: 'Algodão Cru', hex: '#EAE6DF', role: 'Tipografia' },
    ],
    fontHeadline: 'Playfair & Syne Hybrid',
    fontBody: 'Manrope Editorial',
    metrics: [
      { label: 'Venda de Microlotes', value: '+240%' },
      { label: 'Engajamento no Reels', value: '6.2x' },
      { label: 'Valor Percebido', value: 'R$ 85/pct' },
    ],
    feedSample: {
      headline: 'Altitude 1.350m. Notas de jasmim e cacau selvagem.',
      sub: 'Safra limitada numerada à mão pelo mestre de torra.',
      badge: 'Edição Especial',
    },
  },
  {
    id: 'juridico',
    niche: 'Boutique Jurídica & Private Wealth',
    brandName: 'Vanguarda Direito Estratégico',
    taglineBefore: 'Soluções jurídicas ágeis com ética, compromisso e responsabilidade.',
    taglineAfter: 'Blindagem de patrimônio e inteligência tributária para quem lidera o mercado.',
    beforeDescription: 'Símbolo da balança de Têmis repetido à exaustão, site cinza pesado e linguagem hermética que afasta empresários modernos.',
    afterDescription: 'Branding arquitetônico minimalista com monograma geométrico, monogramas em serigrafia UV e autoridade digital desmistificada.',
    colors: [
      { name: 'Azul Meia-Noite', hex: '#0B132B', role: 'Base Estrutural' },
      { name: 'Platina Escovada', hex: '#CDD7D6', role: 'Contraste Frio' },
      { name: 'Ouro Champanhe', hex: '#E5C07B', role: 'Assinatura' },
      { name: 'Preto Grafite', hex: '#070A17', role: 'Fundo' },
    ],
    fontHeadline: 'Syne Bold Geometric',
    fontBody: 'Manrope Pro Legibility',
    metrics: [
      { label: 'Fechamento de Contratos', value: '+180%' },
      { label: 'Autoridade no LinkedIn', value: '14.5k' },
      { label: 'Ciclo de Vendas', value: '-45 dias' },
    ],
    feedSample: {
      headline: 'A melhor defesa patrimonial é a que se antecipa ao risco.',
      sub: 'Planejamento sucessório para holdings familiares e fundadores.',
      badge: 'Private Advisory',
    },
  },
  {
    id: 'tech',
    niche: 'SaaS, IA & Plataformas Digitais',
    brandName: 'Kortex Cloud AI',
    taglineBefore: 'A ferramenta de inteligência artificial mais rápida do mercado.',
    taglineAfter: 'Orquestração autônoma de dados. Decisões estratégicas na velocidade da luz.',
    beforeDescription: 'Interface roxa clichê com robozinhos 3D genéricos e ilustrações vazias que não explicam a segurança do produto corporativo.',
    afterDescription: 'Design system com estética neo-brutalista refinada, tipografia técnica humanizada e comunicação focada em ROI mensurável.',
    colors: [
      { name: 'Ciano Pulso', hex: '#19D3F3', role: 'Energia Digital' },
      { name: 'Magenta Laser', hex: '#FF2E93', role: 'Acento de Ação' },
      { name: 'Vácuo Deep', hex: '#070A17', role: 'Fundo Primário' },
      { name: 'Luz Pura', hex: '#F3F1EA', role: 'Contraste' },
    ],
    fontHeadline: 'Syne Extended Display',
    fontBody: 'Manrope Clean Code',
    metrics: [
      { label: 'Conversão na Demo', value: '31.4%' },
      { label: 'Custo de Aquisição (CAC)', value: '-38%' },
      { label: 'NPS Corporativo', value: '88/100' },
    ],
    feedSample: {
      headline: 'Elimine 20 horas de reuniões operacionais por semana.',
      sub: 'Pipelines inteligentes que conectam seu CRM ao financeiro.',
      badge: 'Enterprise Architecture',
    },
  },
];

type AssetTab = 'cartao' | 'feed' | 'anuncio' | 'landing';

export const InteractiveLightStudio: React.FC = () => {
  const { navigate } = useLumen();
  const [selectedPresetId, setSelectedPresetId] = useState('saude');
  const [activeAsset, setActiveAsset] = useState<AssetTab>('feed');
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const currentPreset = BRAND_PRESETS.find((p) => p.id === selectedPresetId) || BRAND_PRESETS[0];

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="mt-14 w-full bg-[#080C1D] border border-[rgba(246,196,83,0.25)] rounded-2xl p-4 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_30px_rgba(246,196,83,0.06)] text-left relative overflow-hidden group">
      {/* Golden edge ambient highlight */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #F6C453 0%, rgba(246,196,83,0) 70%)' }}
      />
      
      {/* Studio Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[rgba(243,241,234,0.08)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#F6C453] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Laboratório Interativo // Mesa de Luz Criativa</span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F3F1EA] tracking-tight">
            Veja a transformação: da obscuridade genérica à presença magnética.
          </h3>
          <p className="text-xs sm:text-sm text-[#98A1BC] mt-1 max-w-2xl">
            Arraste o feixe de luz abaixo para comparar a percepção de uma marca sem direção artística versus o padrão Lumen com curadoria sênior.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('diagnostico')}
            className="px-4 py-2.5 rounded-lg bg-[#F6C453] hover:bg-[#dfaf43] text-[#070A17] font-bold text-xs transition-all flex items-center gap-1.5 shadow-[0_4px_16px_rgba(246,196,83,0.3)] hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diagnosticar Minha Marca</span>
          </button>
        </div>
      </div>

      {/* Preset Selector Segmented Control */}
      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <span className="text-[11px] font-mono text-[#98A1BC] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Sliders className="w-3 h-3 text-[#F6C453]" />
          Segmento:
        </span>
        {BRAND_PRESETS.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          return (
            <button
              key={preset.id}
              onClick={() => setSelectedPresetId(preset.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-[rgba(246,196,83,0.15)] text-[#F6C453] border-[#F6C453] shadow-[0_0_12px_rgba(246,196,83,0.15)]'
                  : 'bg-[#0B1024] text-[#98A1BC] border-[rgba(243,241,234,0.08)] hover:text-[#F3F1EA] hover:border-[rgba(243,241,234,0.2)]'
              }`}
            >
              <span>{preset.niche}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Light Beam Stage (Before & After Slider) */}
      <div className="mt-6 relative rounded-xl border border-[rgba(243,241,234,0.12)] bg-[#050711] overflow-hidden min-h-[380px] sm:min-h-[420px] select-none shadow-inner">
        
        {/* Layer 1: "Sem Luz / Antes" (Left side underneath) */}
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#121520] to-[#0A0D17] text-[#8C93A8]">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#6A728A] mb-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/60" />
                SEM LUZ // MARCA GENÉRICA (ANTES)
              </span>
              <span>TIPOGRAFIA PADRÃO</span>
            </div>

            <div className="max-w-md">
              <div className="inline-block px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-sans text-[#7D859B] mb-2">
                Logotipo feito em gerador grátis
              </div>
              <h4 className="font-sans text-2xl sm:text-3xl font-normal text-[#B5BAC9] tracking-normal">
                {currentPreset.brandName}
              </h4>
              <p className="mt-2 text-sm text-[#7D859B] italic font-serif">
                "{currentPreset.taglineBefore}"
              </p>
              <p className="mt-4 text-xs text-[#5D657B] leading-relaxed">
                {currentPreset.beforeDescription}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-4 text-xs text-[#5D657B]">
            <span>❌ Sem diferenciação de concorrência</span>
            <span>❌ Disputa por preço baixo</span>
            <span>❌ Comunicação inconsistente</span>
          </div>
        </div>

        {/* Layer 2: "Com Lumen / Depois" (Right side clipped by sliderPos) */}
        <div
          className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#090F24] via-[#0E1535] to-[#070A17] text-[#F3F1EA]"
          style={{
            clipPath: `inset(0 0 0 ${sliderPos}%)`,
          }}
        >
          {/* Subtle light aura inside the revealed side */}
          <div
            className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full opacity-30 blur-2xl"
            style={{
              background: `radial-gradient(circle, ${currentPreset.colors[0].hex} 0%, rgba(7,10,23,0) 70%)`,
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between text-xs font-mono text-[#F6C453] mb-4">
              <span className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                COM LUMEN // POSICIONAMENTO MAGNÉTICO
              </span>
              <span className="text-[#19D3F3]">{currentPreset.fontHeadline}</span>
            </div>

            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F6C453]/15 border border-[#F6C453]/40 text-[#F6C453] text-[10px] font-mono tracking-wider mb-3">
                <span>SELO DE CURADORIA SÊNIOR APROVADO</span>
              </div>
              
              <h4 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#F3F1EA] tracking-tight drop-shadow-md">
                {currentPreset.brandName}
              </h4>
              
              <p className="mt-2.5 text-sm sm:text-base text-[#F6C453] font-medium leading-snug">
                "{currentPreset.taglineAfter}"
              </p>
              
              <p className="mt-3 text-xs sm:text-sm text-[#98A1BC] leading-relaxed">
                {currentPreset.afterDescription}
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-[rgba(243,241,234,0.12)] flex flex-wrap items-center gap-6">
            {currentPreset.metrics.map((m, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="font-heading text-base sm:text-xl font-bold text-[#F6C453]">
                  {m.value}
                </span>
                <span className="text-[11px] text-[#98A1BC] font-mono">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Draggable Divider Handle (Feixe de Luz) */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-[#F6C453] cursor-ew-resize z-30 shadow-[0_0_20px_#F6C453]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#070A17] border-2 border-[#F6C453] flex items-center justify-center shadow-[0_0_15px_#F6C453] text-[#F6C453]">
            <Sliders className="w-3.5 h-3.5 rotate-90" />
          </div>

          {/* Floating position tag above handle */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full px-2 py-0.5 rounded bg-[#070A17]/95 border border-[#F6C453]/40 text-[9px] font-mono text-[#F6C453] whitespace-nowrap shadow-lg pointer-events-none hidden sm:block">
            {sliderPos >= 95
              ? '100% Sem Luz'
              : sliderPos <= 5
              ? '100% Com Lumen'
              : `Sem Luz ${sliderPos}% | ${100 - sliderPos}% Com Lumen`}
          </div>
        </div>

        {/* Full Stage Slider Range Input (Invisible overlay for drag/touch) */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
          aria-label="Controle de revelação do feixe de luz"
        />
      </div>

      {/* Quick Interactive Controls Under the Stage */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {/* Button: Ver 100% Sem Luz (sliderPos = 100 reveals Layer 1 Sem Luz completely) */}
          <button
            onClick={() => setSliderPos(100)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
              sliderPos >= 90
                ? 'bg-red-500/15 text-red-300 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.15)] font-bold'
                : 'bg-[#0B1024] hover:bg-[#121832] text-[#98A1BC] border-[rgba(243,241,234,0.08)]'
            }`}
            title="Recolher feixe de luz e ver 100% do estado anterior (Sem Luz)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span>Ver 100% Sem Luz</span>
          </button>

          {/* Button: Dividir 50/50 */}
          <button
            onClick={() => setSliderPos(50)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
              sliderPos >= 40 && sliderPos <= 60
                ? 'bg-[#F6C453]/20 text-[#F6C453] border-[#F6C453] shadow-[0_0_12px_rgba(246,196,83,0.25)] font-bold'
                : 'bg-[#0B1024] hover:bg-[#121832] text-[#98A1BC] border-[rgba(243,241,234,0.08)]'
            }`}
            title="Dividir a tela ao meio para comparação direta"
          >
            <span>Dividir 50/50</span>
          </button>

          {/* Button: Ver 100% Com Luz (sliderPos = 0 reveals Layer 2 Com Lumen completely) */}
          <button
            onClick={() => setSliderPos(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
              sliderPos <= 10
                ? 'bg-[#19D3F3]/20 text-[#19D3F3] border-[#19D3F3] shadow-[0_0_12px_rgba(25,211,243,0.25)] font-bold'
                : 'bg-[#0B1024] hover:bg-[#121832] text-[#98A1BC] border-[rgba(243,241,234,0.08)]'
            }`}
            title="Expandir feixe de luz e ver 100% da transformação Lumen"
          >
            <Sparkles className="w-3 h-3 text-[#19D3F3]" />
            <span>Ver 100% Com Luz</span>
          </button>
        </div>

        {/* Active Color Palette with 1-click Copy */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#98A1BC] hidden sm:inline">Paleta Exclusiva:</span>
          <div className="flex items-center gap-1.5">
            {currentPreset.colors.map((c, i) => (
              <button
                key={i}
                onClick={() => handleCopyColor(c.hex)}
                className="group relative flex items-center justify-center w-6 h-6 rounded-md border border-white/20 transition-transform hover:scale-110"
                style={{ backgroundColor: c.hex }}
                title={`${c.name}: ${c.hex} (${c.role}) - Clique para copiar`}
              >
                {copiedHex === c.hex ? (
                  <Check className="w-3 h-3 text-[#070A17] font-bold" />
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 text-[8px] font-mono text-black font-bold">
                    #
                  </span>
                )}
              </button>
            ))}
          </div>
          {copiedHex && (
            <span className="text-[11px] font-mono text-[#F6C453] animate-pulse">
              Copiado {copiedHex}!
            </span>
          )}
        </div>
      </div>

      {/* Asset Preview Cards (Mockup da Vida Real) */}
      <div className="mt-7 pt-6 border-t border-[rgba(243,241,234,0.08)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#98A1BC] uppercase tracking-wider">
            <Layout className="w-3.5 h-3.5 text-[#19D3F3]" />
            <span>Aplicação Real do Design System:</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveAsset('feed')}
              className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                activeAsset === 'feed'
                  ? 'bg-[#19D3F3]/20 text-[#19D3F3] font-bold'
                  : 'text-[#98A1BC] hover:text-[#F3F1EA]'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Feed & Redes</span>
            </button>
            <button
              onClick={() => setActiveAsset('cartao')}
              className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                activeAsset === 'cartao'
                  ? 'bg-[#F6C453]/20 text-[#F6C453] font-bold'
                  : 'text-[#98A1BC] hover:text-[#F3F1EA]'
              }`}
            >
              <CreditCard className="w-3 h-3" />
              <span>Cartão Hot-Stamp</span>
            </button>
            <button
              onClick={() => setActiveAsset('anuncio')}
              className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                activeAsset === 'anuncio'
                  ? 'bg-[#FF2E93]/20 text-[#FF2E93] font-bold'
                  : 'text-[#98A1BC] hover:text-[#F3F1EA]'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Campanha de Alta Conversão</span>
            </button>
          </div>
        </div>

        {/* Dynamic Asset Renderer */}
        <div className="p-5 rounded-xl bg-[#060914] border border-[rgba(243,241,234,0.08)]">
          {activeAsset === 'feed' && (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-full sm:w-60 h-60 rounded-xl bg-gradient-to-br from-[#0B1228] to-[#04060E] border border-[rgba(246,196,83,0.3)] p-5 flex flex-col justify-between shadow-lg relative overflow-hidden shrink-0">
                <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-[#F6C453]/15 blur-xl" />
                <div className="flex items-center justify-between text-[10px] font-mono text-[#F6C453]">
                  <span>{currentPreset.feedSample.badge}</span>
                  <span>01/03</span>
                </div>
                <div>
                  <h5 className="font-heading text-lg font-bold text-[#F3F1EA] leading-tight mb-2">
                    {currentPreset.feedSample.headline}
                  </h5>
                  <p className="text-xs text-[#98A1BC] leading-relaxed">
                    {currentPreset.feedSample.sub}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-[#98A1BC]">
                  <span className="font-semibold text-[#F3F1EA]">{currentPreset.brandName}</span>
                  <span className="text-[#F6C453]">Arrasta para ver →</span>
                </div>
              </div>

              <div className="flex-1 text-xs text-[#98A1BC] space-y-3">
                <div className="flex items-center gap-2 text-[#19D3F3] font-semibold text-sm">
                  <span>Feed com Direção de Arte de Alto Padrão</span>
                </div>
                <p className="leading-relaxed">
                  Sem posts genéricos do Canva com templates repetidos. Cada carrossel e reel é construído sob a identidade proprietária da sua empresa, gerando autoridade instantânea e compartilhamentos orgânicos.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => navigate('produto-detalhe', { slug: 'pack-artes-redes-sociais' })}
                    className="text-[#F6C453] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Contratar Pack de Artes para Redes</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeAsset === 'cartao' && (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-full sm:w-72 h-44 rounded-xl bg-[#090E20] border-2 border-[#F6C453]/40 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F6C453]/20 to-transparent" />
                <div className="flex items-center justify-between">
                  <div className="w-3 h-3 rounded-full bg-[#F6C453]" />
                  <span className="text-[9px] font-mono tracking-widest text-[#F6C453] uppercase">
                    Acabamento Hot-Stamping
                  </span>
                </div>
                <div>
                  <div className="font-heading text-xl font-bold text-[#F3F1EA] tracking-wide">
                    {currentPreset.brandName}
                  </div>
                  <div className="text-[11px] text-[#F6C453] font-medium mt-0.5">
                    {currentPreset.niche}
                  </div>
                </div>
                <div className="text-[10px] text-[#98A1BC] font-mono flex items-center justify-between border-t border-white/10 pt-2">
                  <span>Papel Algodão 600g</span>
                  <span>Borda Chanfrada</span>
                </div>
              </div>

              <div className="flex-1 text-xs text-[#98A1BC] space-y-3">
                <div className="flex items-center gap-2 text-[#F6C453] font-semibold text-sm">
                  <span>Presença Tátil & Identidade Corporativa</span>
                </div>
                <p className="leading-relaxed">
                  Arquivos prontos para gráfica fina com separação de canais CMYK, prova de cor calibrada e especificações de verniz localizado e relevo seco.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => navigate('produto-detalhe', { slug: 'identidade-visual' })}
                    className="text-[#F6C453] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Ver Identidade Visual & Branding</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeAsset === 'anuncio' && (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-full sm:w-64 p-4 rounded-xl bg-[#090D1C] border border-[#FF2E93]/40 flex flex-col justify-between shadow-xl shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-[#F6C453] text-[#070A17] font-bold text-xs flex items-center justify-center">
                    L
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#F3F1EA]">{currentPreset.brandName}</div>
                    <div className="text-[10px] text-[#98A1BC]">Patrocinado · Anúncio Oficial</div>
                  </div>
                </div>
                <div className="rounded-lg bg-black/40 p-3 border border-white/5 mb-3">
                  <div className="text-[11px] font-semibold text-[#F3F1EA] leading-snug">
                    {currentPreset.taglineAfter}
                  </div>
                  <div className="text-[10px] text-[#98A1BC] mt-1">
                    Agende sua sessão exclusiva com especialistas seniores.
                  </div>
                </div>
                <button className="w-full py-2 rounded bg-[#FF3B30] text-[#F3F1EA] font-bold text-xs flex items-center justify-center gap-1">
                  <span>Saiba Mais</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1 text-xs text-[#98A1BC] space-y-3">
                <div className="flex items-center gap-2 text-[#FF2E93] font-semibold text-sm">
                  <span>Campanha de Alta Conversão & Retorno Rápido</span>
                </div>
                <p className="leading-relaxed">
                  Design e copy calibrados psicologicamente para parar o scroll do feed nos primeiros 2 segundos e transformar visualizações em reuniões e vendas no WhatsApp.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => navigate('produto-detalhe', { slug: 'video-de-campanha' })}
                    className="text-[#F6C453] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Ver Vídeo de Campanha & Anúncios</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
