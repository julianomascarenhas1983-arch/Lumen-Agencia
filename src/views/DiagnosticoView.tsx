import React, { useState, useEffect } from 'react';
import { useLumen } from '../context/LumenContext';
import { DiagnosticoFormData, DiagnosticoResult, TierLevel } from '../types';
import { createWhatsAppPlanUrl, LUMEN_WHATSAPP_DISPLAY } from '../utils/whatsapp';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Loader2,
  Mail,
  Zap,
  MessageCircle,
  Clock,
  RotateCcw,
  Check,
} from 'lucide-react';

export const DiagnosticoView: React.FC = () => {
  const { navigate, getProduct } = useLumen();

  // Wizard Step: 1 | 2 | 3
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState<DiagnosticoFormData>(() => {
    try {
      const saved = localStorage.getItem('lumen_diagnosis_draft');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      // Passo 1: O negócio
      businessName: '',
      segment: '',
      whatItDoes: '',
      targetAudience: '',

      // Passo 2: Situação atual
      currentChannels: ['Instagram', 'WhatsApp Comercial'],
      postingFrequency: 'Às vezes (toda semana)',
      monthlyInvestment: 'Até R$ 500',
      priceRange: 'R$ 100 a R$ 500',

      // Passo 3: O objetivo e a dor
      mainGoal: 'Aumentar a atração de clientes qualificados e vendas',
      mainDifficulty: '',
      city: '',
      contactEmail: '',
      lgpdConsent: true,
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticoResult | null>(() => {
    try {
      const saved = localStorage.getItem('lumen_latest_diagnosis');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.result || null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [stepError, setStepError] = useState('');
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    message: string;
    canRetryAt?: string;
    existing?: DiagnosticoResult;
  } | null>(null);

  // Auto-save form draft
  useEffect(() => {
    try {
      localStorage.setItem('lumen_diagnosis_draft', JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData]);

  const channelOptions = [
    'Instagram',
    'WhatsApp Comercial',
    'LinkedIn',
    'Site ou Landing Page',
    'Google Ads / Busca',
    'Indicação boca a boca',
    'TikTok / Reels',
    'Eventos ou Ponto Físico',
  ];

  const postingFrequencyOptions = [
    'Não publico/anuncio',
    'Raramente (1x por mês ou menos)',
    'Às vezes (toda semana)',
    'Regularmente (quase todo dia)',
  ];

  const monthlyInvestmentOptions = [
    'Nada',
    'Até R$ 500',
    'De R$ 500 a R$ 2.000',
    'Acima de R$ 2.000',
  ];

  const priceRangeOptions = [
    'Até R$ 100',
    'R$ 100 a R$ 500',
    'R$ 500 a R$ 2.000',
    'Acima de R$ 2.000',
  ];

  const mainGoalOptions = [
    'Aumentar a atração de clientes qualificados e vendas',
    'Criar ou reformular a identidade visual da marca',
    'Profissionalizar e ter constância nas redes sociais',
    'Lançar um novo produto, serviço ou consultório',
    'Ter um plano de ação claro para não desperdiçar verba',
    'Melhorar a percepção de valor e cobrar preços mais altos',
  ];

  const handleToggleChannel = (channel: string) => {
    setFormData((prev) => {
      const exists = prev.currentChannels.includes(channel);
      return {
        ...prev,
        currentChannels: exists
          ? prev.currentChannels.filter((c) => c !== channel)
          : [...prev.currentChannels, channel],
      };
    });
  };

  const handleNextStep = () => {
    setStepError('');
    if (currentStep === 1) {
      if (!formData.businessName.trim()) {
        setStepError('Por favor, informe o nome do seu negócio ou marca.');
        return;
      }
      if (!formData.segment.trim()) {
        setStepError('Por favor, informe o segmento de atuação.');
        return;
      }
      if (!formData.whatItDoes.trim()) {
        setStepError('Por favor, descreva em uma frase o que o seu negócio vende ou faz.');
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else if (currentStep === 2) {
      if (!formData.postingFrequency) {
        setStepError('Por favor, selecione com que frequência você publica ou anuncia.');
        return;
      }
      if (!formData.monthlyInvestment) {
        setStepError('Por favor, selecione a faixa de investimento mensal.');
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setStepError('');
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepError('');
    setRateLimitInfo(null);

    // Validation for Step 3
    if (!formData.mainGoal) {
      setStepError('Por favor, selecione o objetivo prioritário.');
      return;
    }
    if (!formData.mainDifficulty.trim()) {
      setStepError('Por favor, conte qual é a sua maior dificuldade com marketing hoje.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.contactEmail.trim() || !emailRegex.test(formData.contactEmail.trim())) {
      setStepError('Por favor, informe um endereço de e-mail profissional válido.');
      return;
    }
    if (!formData.lgpdConsent) {
      setStepError('É necessário aceitar os termos de consentimento para processar a análise.');
      return;
    }

    setIsLoading(true);

    try {
      const CLOUD_RUN_API_URL = 'https://ais-pre-z23o7xy76vjl2musnlzj6c-648649066867.us-east1.run.app/api/diagnostico';
      
      let res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // If static host returns 404 (e.g. Netlify before proxy update), seamlessly fallback to Cloud Run backend
      if (res.status === 404) {
        res = await fetch(CLOUD_RUN_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();

      if (res.status === 429) {
        // Rate limit reached (1 diagnosis per email every 24h)
        setRateLimitInfo({
          message: data.message || 'Limite diário de 1 diagnóstico atingido para este e-mail.',
          canRetryAt: data.canRetryAt,
          existing: data.existingDiagnosis,
        });
        if (data.existingDiagnosis) {
          setResult(data.existingDiagnosis);
          localStorage.setItem(
            'lumen_latest_diagnosis',
            JSON.stringify({ formData, result: data.existingDiagnosis })
          );
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (!res.ok || data.error) {
        throw new Error(data.message || 'Falha ao processar o diagnóstico com a IA.');
      }

      setResult(data);
      // Persist to local storage for future reference/briefing
      try {
        localStorage.setItem(
          'lumen_latest_diagnosis',
          JSON.stringify({ formData, result: data })
        );
      } catch {
        // ignore
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Diagnosis generation failed:', err);
      setStepError(
        'Não foi possível gerar a análise com a inteligência artificial neste momento. Por favor, tente novamente em instantes.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for status badge based on overall score
  const getStatusBadge = (score: number) => {
    if (score < 40) {
      return {
        label: 'Crítico',
        colorClass: 'bg-[#FF3B30]/15 text-[#FF3B30] border-[#FF3B30]/30',
        description: 'Presença em estágio embrionário, requer alicerce estratégico urgente.',
      };
    }
    if (score < 60) {
      return {
        label: 'Em construção',
        colorClass: 'bg-[#FFD400]/15 text-[#FFD400] border-[#FFD400]/30',
        description: 'Ações pontuais em andamento, necessita de método e consistência visual.',
      };
    }
    if (score < 80) {
      return {
        label: 'No caminho certo',
        colorClass: 'bg-[#19D3F3]/15 text-[#19D3F3] border-[#19D3F3]/30',
        description: 'Bons fundamentos estabelecidos, pronto para acelerar diferenciação e autoridade.',
      };
    }
    return {
      label: 'Avançado',
      colorClass: 'bg-[#25D366]/15 text-[#25D366] border-[#25D366]/30',
      description: 'Maturidade de marketing elevada, pronto para escala e campanhas agressivas.',
    };
  };

  return (
    <div className="py-12 md:py-20 bg-[#070A17] min-h-screen text-[#F3F1EA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header (No 60s promise, clear and authoritative) */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6C453]/10 border border-[#F6C453]/30 text-[#F6C453] text-xs font-mono tracking-wider mb-4 shadow-[0_0_20px_rgba(246,196,83,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DIAGNÓSTICO ESTRATÉGICO // AUDITORIA POR IA</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F3F1EA] tracking-tight mb-4">
            Auditoria estratégica do seu marketing com IA.
          </h1>
          <p className="text-sm sm:text-base text-[#98A1BC] max-w-2xl mx-auto leading-relaxed">
            Compartilhe a realidade do seu negócio e nossa inteligência artificial analisará maturidade, gargalos nos 4 pilares CMYK e oportunidades reais de crescimento.
          </p>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="bg-[#0C1226] border border-[#F6C453]/40 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-2xl animate-fade-in">
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-[#19D3F3]/20 border-t-[#19D3F3] rounded-full animate-spin" />
              <div className="absolute inset-2 border-4 border-[#FF2E93]/20 border-r-[#FF2E93] rounded-full animate-spin [animation-direction:reverse]" />
              <div className="w-5 h-5 bg-[#F6C453] rounded-full shadow-[0_0_20px_#F6C453]" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#F3F1EA] mb-2">
              Cruzando dados com inteligência artificial...
            </h3>
            <p className="text-xs text-[#98A1BC] leading-relaxed max-w-sm mx-auto">
              O modelo Gemini está ponderando sua concorrência, canais ativos, investimento e dores relatadas para <strong className="text-[#F3F1EA]">{formData.businessName}</strong>.
            </p>
          </div>
        )}

        {/* WIZARD FORM (3 PASSOS) */}
        {!isLoading && !result && (
          <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.14)] rounded-2xl p-6 sm:p-10 shadow-2xl">
            
            {/* Step Progress Bar with Brand Colors */}
            <div className="mb-10 pb-6 border-b border-[rgba(243,241,234,0.1)]">
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <span className="text-[#F6C453] font-bold uppercase tracking-wider">
                  Passo {currentStep} de 3 —{' '}
                  {currentStep === 1 && 'O Negócio'}
                  {currentStep === 2 && 'Situação Atual'}
                  {currentStep === 3 && 'O Objetivo e a Dor'}
                </span>
                <span className="text-[#98A1BC]">
                  {Math.round((currentStep / 3) * 100)}% concluído
                </span>
              </div>

              {/* Multi-step colored progress line */}
              <div className="w-full h-2 bg-[#070A17] rounded-full overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    currentStep === 1
                      ? 'w-1/3 bg-[#19D3F3]'
                      : currentStep === 2
                      ? 'w-2/3 bg-gradient-to-r from-[#19D3F3] to-[#FF2E93]'
                      : 'w-full bg-gradient-to-r from-[#19D3F3] via-[#FF2E93] to-[#F6C453]'
                  }`}
                />
              </div>

              {/* Step Title Navigation Indicators */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-[11px] text-[#98A1BC]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={`text-left transition-colors font-medium ${
                    currentStep === 1 ? 'text-[#19D3F3] font-bold' : 'hover:text-[#F3F1EA]'
                  }`}
                >
                  1. O negócio
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (formData.businessName && formData.segment && formData.whatItDoes) {
                      setCurrentStep(2);
                    }
                  }}
                  className={`text-center transition-colors font-medium ${
                    currentStep === 2 ? 'text-[#FF2E93] font-bold' : 'hover:text-[#F3F1EA]'
                  }`}
                >
                  2. Situação atual
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (formData.businessName && formData.segment && formData.whatItDoes && formData.postingFrequency && formData.monthlyInvestment) {
                      setCurrentStep(3);
                    }
                  }}
                  className={`text-right transition-colors font-medium ${
                    currentStep === 3 ? 'text-[#F6C453] font-bold' : 'hover:text-[#F3F1EA]'
                  }`}
                >
                  3. Objetivo & dor
                </button>
              </div>
            </div>

            {/* Error Message */}
            {stepError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                <span>{stepError}</span>
              </div>
            )}

            {/* Rate limit message if any */}
            {rateLimitInfo && (
              <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3 animate-fade-in">
                <Clock className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">{rateLimitInfo.message}</p>
                  {rateLimitInfo.existing && (
                    <button
                      type="button"
                      onClick={() => setResult(rateLimitInfo.existing || null)}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#F6C453] hover:underline"
                    >
                      <span>Visualizar diagnóstico anterior gerado</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* PASSO 1: O NEGÓCIO */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#F3F1EA] mb-2">
                        Nome do Negócio ou Marca <span className="text-[#FF3B30]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="Ex.: Aurora Saúde Integrada"
                        className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#19D3F3] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#F3F1EA] mb-2">
                        Segmento de Atuação <span className="text-[#FF3B30]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.segment}
                        onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                        placeholder="Ex.: Clínica de Estética, Advocacia, SaaS, E-commerce"
                        className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#19D3F3] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F3F1EA] mb-2">
                      O que o seu negócio vende ou faz, em uma frase? <span className="text-[#FF3B30]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.whatItDoes}
                      onChange={(e) => setFormData({ ...formData, whatItDoes: e.target.value })}
                      placeholder="Ex.: Clínica de estética especializada em procedimentos faciais sem cirurgia"
                      className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#19D3F3] transition-colors"
                    />
                    <p className="text-[11px] text-[#98A1BC] mt-1.5">
                      Seja direto: esse dado ajuda a IA a entender a essência da sua oferta.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F3F1EA] mb-2">
                      Para quem você vende? (Público-alvo) <span className="text-xs text-[#98A1BC] font-normal lowercase">(opcional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      placeholder="Ex.: Mulheres de 30 a 50 anos, classe B, da região metropolitana"
                      className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#19D3F3] transition-colors"
                    />
                  </div>

                  {/* Step 1 Actions */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-[#19D3F3] hover:bg-[#15b5d1] text-[#070A17] px-8 py-3.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-[0_4px_20px_rgba(25,211,243,0.3)] hover:scale-[1.02] flex items-center gap-2 min-h-[46px]"
                    >
                      <span>Avançar para Situação Atual</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* PASSO 2: SITUAÇÃO ATUAL */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F3F1EA] mb-3">
                      Canais onde seu negócio já tem presença:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {channelOptions.map((channel) => {
                        const isChecked = formData.currentChannels.includes(channel);
                        return (
                          <button
                            type="button"
                            key={channel}
                            onClick={() => handleToggleChannel(channel)}
                            className={`p-3 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between ${
                              isChecked
                                ? 'bg-[#FF2E93]/15 border-[#FF2E93] text-[#F3F1EA]'
                                : 'bg-[#070A17] border-[rgba(243,241,234,0.1)] text-[#98A1BC] hover:border-[rgba(243,241,234,0.25)]'
                            }`}
                          >
                            <span className="line-clamp-1">{channel}</span>
                            {isChecked && <Check className="w-3.5 h-3.5 text-[#FF2E93] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Frequência de postagem */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F3F1EA] mb-3">
                      Com que frequência você publica ou anuncia hoje? <span className="text-[#FF3B30]">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {postingFrequencyOptions.map((freq) => {
                        const isSelected = formData.postingFrequency === freq;
                        return (
                          <button
                            type="button"
                            key={freq}
                            onClick={() => setFormData({ ...formData, postingFrequency: freq })}
                            className={`p-3.5 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#FF2E93]/15 border-[#FF2E93] text-[#F3F1EA]'
                                : 'bg-[#070A17] border-[rgba(243,241,234,0.1)] text-[#98A1BC] hover:border-[rgba(243,241,234,0.25)]'
                            }`}
                          >
                            <span>{freq}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#FF2E93]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Investimento mensal */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F3F1EA] mb-3">
                      Quanto investe em marketing hoje por mês? <span className="text-[#FF3B30]">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {monthlyInvestmentOptions.map((inv) => {
                        const isSelected = formData.monthlyInvestment === inv;
                        return (
                          <button
                            type="button"
                            key={inv}
                            onClick={() => setFormData({ ...formData, monthlyInvestment: inv })}
                            className={`p-3 rounded-xl border text-xs font-medium text-center transition-all ${
                              isSelected
                                ? 'bg-[#FF2E93]/15 border-[#FF2E93] text-[#F3F1EA] font-bold'
                                : 'bg-[#070A17] border-[rgba(243,241,234,0.1)] text-[#98A1BC] hover:border-[rgba(243,241,234,0.25)]'
                            }`}
                          >
                            <span>{inv}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Faixa de preço */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F3F1EA] mb-3">
                      Qual a faixa de preço do que você vende? <span className="text-xs text-[#98A1BC] font-normal lowercase">(opcional)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {priceRangeOptions.map((pr) => {
                        const isSelected = formData.priceRange === pr;
                        return (
                          <button
                            type="button"
                            key={pr}
                            onClick={() => setFormData({ ...formData, priceRange: pr })}
                            className={`p-3 rounded-xl border text-xs font-medium text-center transition-all ${
                              isSelected
                                ? 'bg-[#FF2E93]/15 border-[#FF2E93] text-[#F3F1EA] font-bold'
                                : 'bg-[#070A17] border-[rgba(243,241,234,0.1)] text-[#98A1BC] hover:border-[rgba(243,241,234,0.25)]'
                            }`}
                          >
                            <span>{pr}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2 Navigation */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="bg-white/5 hover:bg-white/10 text-[#98A1BC] hover:text-[#F3F1EA] px-5 py-3 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 min-h-[46px]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-[#FF2E93] hover:bg-[#e02680] text-[#F3F1EA] px-8 py-3.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-[0_4px_20px_rgba(255,46,147,0.3)] hover:scale-[1.02] flex items-center gap-2 min-h-[46px]"
                    >
                      <span>Avançar para Objetivo e Dor</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* PASSO 3: O OBJETIVO E A DOR */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F3F1EA] mb-2">
                      Qual o objetivo prioritário neste momento? <span className="text-[#FF3B30]">*</span>
                    </label>
                    <select
                      value={formData.mainGoal}
                      onChange={(e) => setFormData({ ...formData, mainGoal: e.target.value })}
                      className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-3 text-sm text-[#F3F1EA] focus:border-[#F6C453] transition-colors"
                    >
                      {mainGoalOptions.map((goal) => (
                        <option key={goal} value={goal}>
                          {goal}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F3F1EA] mb-2">
                      Qual é a sua maior dificuldade com marketing hoje? <span className="text-[#FF3B30]">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.mainDifficulty}
                      onChange={(e) => setFormData({ ...formData, mainDifficulty: e.target.value })}
                      placeholder="Ex.: Tenho poucos clientes novos, não sei se o que faço funciona, a concorrência está forte..."
                      className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl p-3.5 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] transition-colors resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#F3F1EA] mb-2">
                        Cidade e Estado (Região) <span className="text-xs text-[#98A1BC] font-normal lowercase">(opcional)</span>
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
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#F3F1EA] mb-2">
                        Seu E-mail Profissional <span className="text-[#FF3B30]">*</span>
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

                  {/* LGPD Consent Checkbox */}
                  <div className="pt-2 border-t border-[rgba(243,241,234,0.08)]">
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

                  {/* Step 3 Navigation / Submit */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="bg-white/5 hover:bg-white/10 text-[#98A1BC] hover:text-[#F3F1EA] px-5 py-3 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 min-h-[48px]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all shadow-[0_6px_24px_rgba(255,59,48,0.4)] hover:scale-[1.02] active:scale-[0.98] min-h-[48px] flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-[#F6C453]" />
                      <span>Gerar Diagnóstico Gratuito</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        )}

        {/* TELA DE RESULTADO AUDITADO PELO GEMINI */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Top Overview Card */}
            <div className="bg-[#0C1226] border border-[rgba(246,196,83,0.3)] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                  <div className="font-mono text-xs uppercase text-[#F6C453] tracking-widest mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#19D3F3] animate-pulse" />
                    <span>DIAGNÓSTICO ESTRATÉGICO // {result.businessName}</span>
                  </div>

                  <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#F3F1EA] mb-3">
                    Maturidade Geral: {result.notaGeral}/100
                  </h2>

                  {/* Status Word & Description */}
                  {(() => {
                    const status = getStatusBadge(result.notaGeral);
                    return (
                      <div className="mb-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${status.colorClass}`}
                        >
                          <span>Status:</span>
                          <span>{status.label}</span>
                        </span>
                        <p className="text-xs text-[#98A1BC] mt-2 leading-relaxed">
                          {status.description}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Slogan in Syne font highlight */}
                  <div className="mt-4 p-4 rounded-xl bg-[#070A17] border border-[#F6C453]/30 relative">
                    <span className="text-[10px] font-mono text-[#F6C453] uppercase tracking-wider block mb-1">
                      Slogan Estratégico Proposto
                    </span>
                    <div className="font-heading font-extrabold text-xl sm:text-2xl text-[#F6C453] tracking-tight leading-snug">
                      "{result.sloganSugerido}"
                    </div>
                  </div>
                </div>

                {/* Score Dial */}
                <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
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
                      strokeDashoffset={2 * Math.PI * 40 * (1 - result.notaGeral / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="font-heading text-4xl font-extrabold text-[#F3F1EA]">
                      {result.notaGeral}
                    </span>
                    <span className="block text-[11px] uppercase font-mono text-[#98A1BC]">pontos</span>
                  </div>
                </div>
              </div>

              {/* 4 CMYK Pillar Subscores in Horizontal Bars */}
              <div className="mt-8 pt-8 border-t border-[rgba(243,241,234,0.1)]">
                <div className="text-xs font-mono uppercase text-[#98A1BC] tracking-wider mb-4">
                  Notas de Maturidade nos 4 Pilares Lumen (CMYK):
                </div>

                <div className="space-y-4">
                  {/* Ciano: Estratégico */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono text-[#19D3F3] font-bold uppercase tracking-wider">
                        C // Pilar Estratégico (Posicionamento & Mercado)
                      </span>
                      <span className="font-bold text-[#F3F1EA] font-mono">
                        {result.notasPorPilar.estrategico}/100
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#070A17] rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-[#19D3F3] rounded-full transition-all duration-1000 shadow-[0_0_12px_#19D3F3]"
                        style={{ width: `${result.notasPorPilar.estrategico}%` }}
                      />
                    </div>
                  </div>

                  {/* Magenta: Digital */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono text-[#FF2E93] font-bold uppercase tracking-wider">
                        M // Pilar Digital (Canais, Tráfego & Presença)
                      </span>
                      <span className="font-bold text-[#F3F1EA] font-mono">
                        {result.notasPorPilar.digital}/100
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#070A17] rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-[#FF2E93] rounded-full transition-all duration-1000 shadow-[0_0_12px_#FF2E93]"
                        style={{ width: `${result.notasPorPilar.digital}%` }}
                      />
                    </div>
                  </div>

                  {/* Amarelo: Publicidade */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono text-[#FFD400] font-bold uppercase tracking-wider">
                        Y // Pilar Publicidade (Impacto Visual & Criatividade)
                      </span>
                      <span className="font-bold text-[#F3F1EA] font-mono">
                        {result.notasPorPilar.publicidade}/100
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#070A17] rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-[#FFD400] rounded-full transition-all duration-1000 shadow-[0_0_12px_#FFD400]"
                        style={{ width: `${result.notasPorPilar.publicidade}%` }}
                      />
                    </div>
                  </div>

                  {/* Marfim / Dourado: Comunicação */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono text-[#F3F1EA] font-bold uppercase tracking-wider">
                        K // Pilar Comunicação (Narrativa, Tom de Voz & Autoridade)
                      </span>
                      <span className="font-bold text-[#F3F1EA] font-mono">
                        {result.notasPorPilar.comunicacao}/100
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#070A17] rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-[#F3F1EA] rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(243,241,234,0.8)]"
                        style={{ width: `${result.notasPorPilar.comunicacao}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Opportunities in 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pontos Fortes */}
              <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 sm:p-8">
                <h3 className="font-heading text-lg font-bold text-[#F3F1EA] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#19D3F3]" />
                  <span>Pontos Fortes Identificados:</span>
                </h3>
                <ul className="space-y-3">
                  {result.pontosFortes.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#F3F1EA]">
                      <span className="font-mono text-[#19D3F3] font-bold shrink-0 mt-0.5">
                        0{idx + 1}.
                      </span>
                      <span className="leading-relaxed">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Oportunidades Imediatas */}
              <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 sm:p-8">
                <h3 className="font-heading text-lg font-bold text-[#F3F1EA] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#FF2E93]" />
                  <span>Oportunidades Imediatas de Mercado:</span>
                </h3>
                <ul className="space-y-3">
                  {result.oportunidades.map((opp, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#F3F1EA]">
                      <span className="font-mono text-[#FF2E93] font-bold shrink-0 mt-0.5">
                        0{idx + 1}.
                      </span>
                      <span className="leading-relaxed">{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Product Card */}
            {(() => {
              const matchedProduct = getProduct(result.produtoRecomendado) || getProduct('diagnostico-plano-estrategico');
              const tierData = matchedProduct?.tiers.pro || {
                name: 'Pro',
                price: 1950,
                deliveryDays: 5,
                revisionsCount: 2,
              };

              const whatsAppPlanUrl = createWhatsAppPlanUrl({
                productTitle: matchedProduct?.title || 'Solução Estratégica Lumen',
                tierName: tierData.name,
                price: tierData.price,
                deliveryDays: tierData.deliveryDays,
                revisionsCount: tierData.revisionsCount,
                isRecurring: matchedProduct?.slug === 'lumen-continuo',
              });

              return (
                <div className="bg-[#0C1226] border border-[#F6C453]/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-[#F6C453]" />
                    <span className="font-heading text-xs uppercase tracking-wider text-[#F6C453] font-bold">
                      Solução Recomendada no Catálogo da Lumen
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                      <h4 className="font-heading text-2xl font-bold text-[#F3F1EA] mb-2">
                        {matchedProduct?.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#98A1BC] leading-relaxed mb-4">
                        <strong className="text-[#F3F1EA]">Por que este produto:</strong> {result.motivoRecomendacao}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#98A1BC]">
                        <span>Preço tabelado: <strong className="text-[#F3F1EA]">R$ {tierData.price.toLocaleString('pt-BR')}</strong></span>
                        <span>•</span>
                        <span>Prazo: <strong className="text-[#F3F1EA]">{tierData.deliveryDays} dias úteis</strong></span>
                        <span>•</span>
                        <span>Curadoria sênior inclusa</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                      <button
                        onClick={() => navigate('produto-detalhe', { slug: matchedProduct?.slug, tier: 'pro' })}
                        className="bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <span>Ver este produto</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={whatsAppPlanUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-[#20ba5a] text-[#070A17] px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <MessageCircle className="w-4 h-4 fill-[#070A17]" />
                        <span>Contratar no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Bottom Actions and Discrete AI Notice */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-[#070A17] border border-[rgba(243,241,234,0.1)] gap-4 text-xs text-[#98A1BC]">
              <span className="text-[11px] text-[#98A1BC]/80">
                Diagnóstico gerado por inteligência artificial com base nas informações fornecidas.
              </span>

              <button
                onClick={() => {
                  setResult(null);
                  setCurrentStep(1);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F3F1EA] hover:text-[#F6C453] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refazer diagnóstico com outros dados</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
