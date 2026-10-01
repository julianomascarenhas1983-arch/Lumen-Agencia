import React, { useState } from 'react';
import { useLumen } from '../context/LumenContext';
import { DiagnosticoResult, TierLevel } from '../types';
import { generateLocalDiagnostico } from '../data/localFallback';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Shield,
  Loader2,
  Share2,
  Mail,
  Zap,
} from 'lucide-react';

export const DiagnosticoView: React.FC = () => {
  const { navigate, getProduct } = useLumen();

  const [formData, setFormData] = useState({
    businessName: '',
    segment: '',
    city: '',
    mainGoal: 'Aumentar a atração de clientes qualificados e visibilidade',
    currentChannels: ['Instagram', 'WhatsApp Comercial'] as string[],
    contactEmail: '',
    lgpdConsent: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticoResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const channelOptions = [
    'Instagram',
    'LinkedIn',
    'Site ou Landing Page',
    'Google Ads / Busca',
    'WhatsApp Comercial',
    'Indicação boca a boca',
  ];

  const handleToggleChannel = (channel: string) => {
    setFormData((prev) => {
      const exists = prev.currentChannels.includes(channel);
      if (exists) {
        return {
          ...prev,
          currentChannels: prev.currentChannels.filter((c) => c !== channel),
        };
      } else {
        return {
          ...prev,
          currentChannels: [...prev.currentChannels, channel],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.segment || !formData.contactEmail) {
      setErrorMessage('Por favor, preencha os campos obrigatórios (*).');
      return;
    }

    if (!formData.lgpdConsent) {
      setErrorMessage('É necessário aceitar os termos de consentimento para processar o diagnóstico.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Falha ao processar diagnóstico no servidor.');
      }

      const data: DiagnosticoResult = await res.json();
      setResult(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.warn('API /api/diagnostico offline ou ambiente estático, usando gerador local inteligente:', err);
      // Fallback local instantâneo para HostGator e hospedagens estáticas
      const localData = generateLocalDiagnostico(formData);
      setResult(localData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-20 bg-[#070A17] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6C453]/10 border border-[#F6C453]/30 text-[#F6C453] text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            DIAGNÓSTICO EM 60 SEGUNDOS // MOTOR GEMINI
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F3F1EA] tracking-tight mb-4">
            Descubra o nível real de maturidade do seu marketing.
          </h1>
          <p className="text-sm sm:text-base text-[#98A1BC] max-w-2xl mx-auto">
            Informações objetivas sobre o seu negócio avaliadas sob a ótica dos 4 pilares CMYK da Lumen. Receba notas, oportunidades latentes e plano de ação imediato.
          </p>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="bg-[#0C1226] border border-[#F6C453]/40 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-2xl">
            <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-[#19D3F3]/20 border-t-[#19D3F3] rounded-full animate-spin" />
              <div className="absolute inset-2 border-4 border-[#FF2E93]/20 border-r-[#FF2E93] rounded-full animate-spin [animation-direction:reverse]" />
              <div className="w-4 h-4 bg-[#F6C453] rounded-full shadow-[0_0_15px_#F6C453]" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#F3F1EA] mb-2">
              Cruzando dados e auditando canais...
            </h3>
            <p className="text-xs text-[#98A1BC]">
              Nossa inteligência artificial está ponderando concorrência, maturidade digital e diferenciais competitivos para {formData.businessName}.
            </p>
          </div>
        )}

        {/* FORM VIEW */}
        {!isLoading && !result && (
          <form
            onSubmit={handleSubmit}
            className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8"
          >
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#F3F1EA] mb-2">
                  Nome do Negócio ou Marca *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Ex.: Aurora Saúde Integrada"
                  className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#F3F1EA] mb-2">
                  Segmento de Atuação *
                </label>
                <input
                  type="text"
                  required
                  value={formData.segment}
                  onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                  placeholder="Ex.: Clínica Médica, Advocacia, Loja de Roupas, SaaS"
                  className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#F3F1EA] mb-2">
                  Cidade e Estado (Região)
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Ex.: São Paulo / SP"
                  className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#F3F1EA] mb-2">
                  Seu E-mail Profissional * (para envio do relatório)
                </label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="contato@empresa.com.br"
                  className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#F3F1EA] mb-2">
                Qual o seu objetivo prioritário neste momento?
              </label>
              <select
                value={formData.mainGoal}
                onChange={(e) => setFormData({ ...formData, mainGoal: e.target.value })}
                className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-3 text-sm text-[#F3F1EA] focus:border-[#F6C453] transition-colors"
              >
                <option value="Aumentar a atração de clientes qualificados e vendas">
                  Aumentar a atração de clientes qualificados e vendas
                </option>
                <option value="Criar ou reformular a identidade visual da marca">
                  Criar ou reformular a identidade visual da marca
                </option>
                <option value="Profissionalizar e ter constância nas redes sociais">
                  Profissionalizar e ter constância nas redes sociais
                </option>
                <option value="Lançar um novo produto, serviço ou consultório">
                  Lançar um novo produto, serviço ou consultório
                </option>
                <option value="Ter um plano de ação claro para não desperdiçar verba">
                  Ter um plano de ação claro para não desperdiçar verba
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#F3F1EA] mb-3">
                Canais onde o seu negócio já tem alguma presença:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {channelOptions.map((channel) => {
                  const isChecked = formData.currentChannels.includes(channel);
                  return (
                    <button
                      type="button"
                      key={channel}
                      onClick={() => handleToggleChannel(channel)}
                      className={`p-3 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#F6C453]/10 border-[#F6C453] text-[#F3F1EA]'
                          : 'bg-[#070A17] border-[rgba(243,241,234,0.1)] text-[#98A1BC] hover:border-[rgba(243,241,234,0.25)]'
                      }`}
                    >
                      <span>{channel}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-[#F6C453]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LGPD Consent Checkbox */}
            <div className="pt-4 border-t border-[rgba(243,241,234,0.08)]">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-[#98A1BC]">
                <input
                  type="checkbox"
                  checked={formData.lgpdConsent}
                  onChange={(e) => setFormData({ ...formData, lgpdConsent: e.target.checked })}
                  className="mt-0.5 rounded border-[rgba(243,241,234,0.2)] bg-[#070A17] text-[#FF3B30] focus:ring-[#F6C453]"
                />
                <span>
                  Autorizo a Lumen a processar os dados fornecidos para gerar este diagnóstico e enviar recomendações estratégicas por e-mail, em total conformidade com a LGPD (Lei 13.709/2018). Posso revogar este consentimento a qualquer momento.
                </span>
              </label>
            </div>

            {/* Primary Action Button (Red token --r: #FF3B30) */}
            <button
              type="submit"
              className="w-full bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] py-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-[0_6px_24px_rgba(255,59,48,0.35)] hover:scale-[1.01] active:scale-[0.99] min-h-[48px] flex items-center justify-center gap-2"
            >
              <span>Gerar Diagnóstico Grátis em 60s</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* RESULT VIEW */}
        {result && (
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* Top Overview Card */}
            <div className="bg-[#0C1226] border border-[rgba(246,196,83,0.3)] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <div className="font-mono text-xs uppercase text-[#F6C453] tracking-widest mb-1">
                    RESULTADO AUDITADO // {result.businessName}
                  </div>
                  <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#F3F1EA] mb-3">
                    Nota Geral de Maturidade: {result.overallScore}/100
                  </h2>
                  <div className="p-3 bg-[#070A17] rounded-xl border border-white/5 inline-block text-sm text-[#F6C453] font-semibold italic">
                    "{result.suggestedSlogan}"
                  </div>
                </div>

                {/* Score Dial */}
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(243,241,234,0.1)"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#F6C453"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - result.overallScore / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="font-heading text-3xl font-extrabold text-[#F3F1EA]">
                      {result.overallScore}
                    </span>
                    <span className="block text-[10px] uppercase font-mono text-[#98A1BC]">pts</span>
                  </div>
                </div>
              </div>

              {/* 4 CMYK Pillar Subscores */}
              <div className="mt-8 pt-8 border-t border-[rgba(243,241,234,0.1)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Ciano: Estratégia */}
                <div className="bg-[#070A17] p-4 rounded-xl border border-[#19D3F3]/20">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-[#19D3F3] uppercase">C // Estratégia</span>
                    <span className="font-bold text-[#F3F1EA]">{result.subscores.estrategia}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#19D3F3] rounded-full transition-all duration-1000"
                      style={{ width: `${result.subscores.estrategia}%` }}
                    />
                  </div>
                </div>

                {/* Magenta: Digital */}
                <div className="bg-[#070A17] p-4 rounded-xl border border-[#FF2E93]/20">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-[#FF2E93] uppercase">M // Digital</span>
                    <span className="font-bold text-[#F3F1EA]">{result.subscores.digital}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FF2E93] rounded-full transition-all duration-1000"
                      style={{ width: `${result.subscores.digital}%` }}
                    />
                  </div>
                </div>

                {/* Amarelo: Publicidade */}
                <div className="bg-[#070A17] p-4 rounded-xl border border-[#FFD400]/20">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-[#FFD400] uppercase">Y // Publicidade</span>
                    <span className="font-bold text-[#F3F1EA]">{result.subscores.publicidade}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FFD400] rounded-full transition-all duration-1000"
                      style={{ width: `${result.subscores.publicidade}%` }}
                    />
                  </div>
                </div>

                {/* Dourado/Marfim: Comunicação */}
                <div className="bg-[#070A17] p-4 rounded-xl border border-[#F6C453]/20">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-[#F6C453] uppercase">K // Comunicação</span>
                    <span className="font-bold text-[#F3F1EA]">{result.subscores.comunicacao}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F6C453] rounded-full transition-all duration-1000"
                      style={{ width: `${result.subscores.comunicacao}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Opportunities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pontos Fortes */}
              <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.1)] rounded-2xl p-6 sm:p-8">
                <h3 className="font-heading text-lg font-bold text-[#F3F1EA] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#19D3F3]" />
                  <span>3 Pontos Fortes Identificados:</span>
                </h3>
                <ul className="space-y-3">
                  {result.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#F3F1EA]">
                      <span className="font-mono text-[#19D3F3] font-bold">0{idx + 1}.</span>
                      <span className="leading-relaxed">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Oportunidades */}
              <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.1)] rounded-2xl p-6 sm:p-8">
                <h3 className="font-heading text-lg font-bold text-[#F3F1EA] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#FF2E93]" />
                  <span>3 Oportunidades Imediatas:</span>
                </h3>
                <ul className="space-y-3">
                  {result.opportunities.map((opp, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#F3F1EA]">
                      <span className="font-mono text-[#FF2E93] font-bold">0{idx + 1}.</span>
                      <span className="leading-relaxed">{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Products */}
            <div className="bg-[#0C1226] border border-[rgba(246,196,83,0.3)] rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-[#F6C453]" />
                <h3 className="font-heading text-sm uppercase tracking-wider text-[#F6C453] font-bold">
                  Soluções Recomendadas no Catálogo Lumen
                </h3>
              </div>
              <p className="text-xs text-[#98A1BC] mb-6">
                Com base no seu perfil, estes são os produtos que oferecem o retorno mais rápido sobre o investimento:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.recommendedProducts.map((rec) => {
                  const productObj = getProduct(rec.slug);
                  const tierLevel: TierLevel = (rec.tier === 'essencial' || rec.tier === 'premium') ? rec.tier : 'pro';
                  const tierPrice = productObj?.tiers[tierLevel]?.price || 990;

                  return (
                    <div
                      key={rec.slug}
                      className="bg-[#070A17] border border-[rgba(243,241,234,0.1)] rounded-xl p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-[#F6C453]">
                            Nível {tierLevel.toUpperCase()}
                          </span>
                          <span className="text-sm font-bold text-[#F3F1EA]">
                            R$ {tierPrice.toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <h4 className="font-heading text-base font-bold text-[#F3F1EA] mb-2">
                          {rec.title}
                        </h4>
                        <p className="text-xs text-[#98A1BC] leading-relaxed mb-4">
                          {rec.reason}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          navigate('checkout', {
                            slug: rec.slug,
                            tier: tierLevel,
                          })
                        }
                        className="w-full bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <span>Contratar este produto</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Email notice & Repeat CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-[#070A17] border border-[rgba(243,241,234,0.1)] gap-4 text-xs text-[#98A1BC]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F6C453]" />
                <span>Uma cópia executiva deste diagnóstico foi registrada para {formData.contactEmail}.</span>
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-[#F3F1EA] hover:text-[#F6C453] underline underline-offset-4"
              >
                Fazer novo diagnóstico
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
