import React, { useState, useEffect } from 'react';
import { useLumen } from '../context/LumenContext';
import { DiagnosticoFormData, MiniBriefingSubmission } from '../types';
import {
  LUMEN_COMPANY_EMAIL,
  generateBriefingProtocol,
  formatBriefingSummaryText,
  createMailtoUrl,
  createWhatsAppBriefingUrl,
  submitBriefingEmail,
} from '../utils/briefingEmail';
import { LUMEN_WHATSAPP_DISPLAY } from '../utils/whatsapp';
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
  Send,
  MessageCircle,
  Clock,
  Printer,
  FileText,
  Copy,
  Check,
  Building2,
  Target,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

export const DiagnosticoView: React.FC = () => {
  const { navigate } = useLumen();

  // Wizard Step: 1 | 2 | 3
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState<DiagnosticoFormData>(() => {
    try {
      const saved = localStorage.getItem('lumen_briefing_draft');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      // Passo 1: O negócio
      businessName: '',
      contactName: '',
      segment: '',
      whatItDoes: '',
      targetAudience: '',
      city: '',

      // Passo 2: Situação atual
      currentChannels: ['Instagram', 'WhatsApp Comercial'],
      postingFrequency: 'Às vezes (toda semana)',
      monthlyInvestment: 'De R$ 500 a R$ 2.000',
      priceRange: 'R$ 100 a R$ 500',

      // Passo 3: O objetivo e a dor
      mainGoal: 'Aumentar a atração de clientes qualificados e vendas',
      mainDifficulty: '',
      urgency: 'Imediato (próximos 15 a 30 dias)',
      contactEmail: '',
      contactPhone: '',
      lgpdConsent: true,
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<MiniBriefingSubmission | null>(() => {
    try {
      const saved = localStorage.getItem('lumen_latest_briefing_submission');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [stepError, setStepError] = useState('');
  const [copiedProtocol, setCopiedProtocol] = useState(false);
  const [needsActivation, setNeedsActivation] = useState(false);

  // Auto-save form draft
  useEffect(() => {
    try {
      localStorage.setItem('lumen_briefing_draft', JSON.stringify(formData));
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
    'Ponto Físico / Loja',
    'E-commerce / Loja Virtual',
  ];

  const postingFrequencyOptions = [
    'Não publico ou anuncio atualmente',
    'Raramente (1 a 2 vezes por mês)',
    'Às vezes (toda semana)',
    'Frequentemente (quase todo dia)',
    'Anúncios pagos ativos e contínuos',
  ];

  const investmentOptions = [
    'Ainda não invisto em marketing',
    'Até R$ 500 / mês',
    'De R$ 500 a R$ 2.000 / mês',
    'De R$ 2.000 a R$ 5.000 / mês',
    'Acima de R$ 5.000 / mês',
  ];

  const priceRangeOptions = [
    'Abaixo de R$ 50 (Ticket baixo/varejo)',
    'R$ 50 a R$ 200 (Ticket médio popular)',
    'R$ 200 a R$ 1.000 (Ticket médio padrão)',
    'R$ 1.000 a R$ 5.000 (Ticket alto/serviços)',
    'Acima de R$ 5.000 (High ticket / Consultoria / B2B)',
  ];

  const mainGoalOptions = [
    'Aumentar a atração de clientes qualificados e vendas',
    'Construir autoridade de marca e posicionamento premium',
    'Criar ou reformular identidade visual e presença digital',
    'Estruturar uma landing page de alta conversão',
    'Delegar a produção de criativos e anúncios para especialistas',
    'Escalar o negócio com campanhas de anúncios em vídeo',
  ];

  const urgencyOptions = [
    'Imediato (próximos 15 a 30 dias)',
    'Médio prazo (próximos 60 dias)',
    'Planejamento para o próximo trimestre',
  ];

  const toggleChannel = (channel: string) => {
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
        setStepError('Descreva em uma frase o que o seu negócio vende ou faz.');
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else if (currentStep === 2) {
      if (!formData.postingFrequency) {
        setStepError('Selecione a frequência atual de postagem/anúncios.');
        return;
      }
      if (!formData.monthlyInvestment) {
        setStepError('Selecione a faixa atual de investimento mensal.');
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setStepError('');
    if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(1);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepError('');

    if (!formData.mainGoal) {
      setStepError('Selecione o objetivo prioritário do seu negócio.');
      return;
    }
    if (!formData.mainDifficulty.trim()) {
      setStepError('Descreva resumidamente a sua principal dificuldade com marketing hoje.');
      return;
    }
    if (!formData.contactEmail.trim() || !formData.contactEmail.includes('@')) {
      setStepError('Informe um e-mail válido para receber a confirmação e o retorno da análise.');
      return;
    }
    if (!formData.lgpdConsent) {
      setStepError('É necessário autorizar o processamento dos dados para envio do mini-briefing.');
      return;
    }

    setIsLoading(true);

    try {
      const protocol = generateBriefingProtocol();

      // Submit email to company and client
      const res = await submitBriefingEmail(formData, protocol);
      if (res.needsActivation) {
        setNeedsActivation(true);
      }

      const submission: MiniBriefingSubmission = {
        protocol,
        submittedAt: new Date().toISOString(),
        formData,
        targetCompanyEmail: LUMEN_COMPANY_EMAIL,
        clientEmail: formData.contactEmail.trim(),
      };

      setSubmissionSuccess(submission);
      localStorage.setItem('lumen_latest_briefing_submission', JSON.stringify(submission));

      // Clear draft
      localStorage.removeItem('lumen_briefing_draft');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Submission error:', err);
      setStepError('Ocorreu uma falha ao enviar. Por favor, tente novamente ou envie diretamente pelo WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyProtocol = (protocol: string) => {
    navigator.clipboard.writeText(protocol);
    setCopiedProtocol(true);
    setTimeout(() => setCopiedProtocol(false), 2500);
  };

  const handleResetForm = () => {
    setSubmissionSuccess(null);
    localStorage.removeItem('lumen_latest_briefing_submission');
    setCurrentStep(1);
    setFormData({
      businessName: '',
      contactName: '',
      segment: '',
      whatItDoes: '',
      targetAudience: '',
      city: '',
      currentChannels: ['Instagram', 'WhatsApp Comercial'],
      postingFrequency: 'Às vezes (toda semana)',
      monthlyInvestment: 'De R$ 500 a R$ 2.000',
      priceRange: 'R$ 100 a R$ 500',
      mainGoal: 'Aumentar a atração de clientes qualificados e vendas',
      mainDifficulty: '',
      urgency: 'Imediato (próximos 15 a 30 dias)',
      contactEmail: '',
      contactPhone: '',
      lgpdConsent: true,
    });
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div className="py-12 md:py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TELA DE SUCESSO / CONFIRMAÇÃO DO MINI-BRIEFING */}
        {submissionSuccess ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Header de Confirmação */}
            <div className="bg-[#0C1226]/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] pointer-events-none" />
              
              <div className="inline-flex p-4 rounded-full bg-emerald-500/20 text-emerald-400 mb-4 border border-emerald-500/30">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#F3F1EA] tracking-tight">
                Mini-Briefing Estratégico Enviado!
              </h2>

              <p className="text-[#98A1BC] max-w-xl mx-auto mt-2 text-sm sm:text-base leading-relaxed">
                Suas informações foram registradas com sucesso e encaminhadas diretamente para a diretoria da <strong className="text-[#F3F1EA]">Lumen Agência Virtual</strong>.
              </p>

              {/* Protocolo Box */}
              <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 bg-[#070A17] border border-white/10 px-5 py-3 rounded-2xl">
                <span className="text-xs uppercase tracking-wider text-[#98A1BC] font-mono">Protocolo de Atendimento:</span>
                <span className="font-mono font-bold text-base sm:text-lg text-[#F6C453]">{submissionSuccess.protocol}</span>
                <button
                  onClick={() => handleCopyProtocol(submissionSuccess.protocol)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-[#98A1BC] hover:text-[#F3F1EA] transition-all flex items-center gap-1 text-xs"
                  title="Copiar protocolo"
                >
                  {copiedProtocol ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedProtocol ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              {/* Notificação dos e-mails */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-[#070A17]/60 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#F3F1EA] block">Encaminhado para a Empresa:</span>
                    <span className="text-xs text-[#19D3F3] font-mono block mt-0.5">{LUMEN_COMPANY_EMAIL}</span>
                    <span className="text-[11px] text-[#98A1BC] block mt-1">Nossa diretoria estratégica já foi notificada.</span>
                  </div>
                </div>

                <div className="bg-[#070A17]/60 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#F3F1EA] block">Cópia do Solicitante:</span>
                    <span className="text-xs text-emerald-400 font-mono block mt-0.5">{submissionSuccess.clientEmail}</span>
                    <span className="text-[11px] text-[#98A1BC] block mt-1">Você receberá o retorno da análise em até 24h úteis.</span>
                  </div>
                </div>
              </div>

              {/* Alerta de Ativação Inicial FormSubmit se pendente */}
              {needsActivation && (
                <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs text-left flex items-start gap-3 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block text-amber-300 font-semibold">Ativação inicial do formulário pendente:</strong>
                    <span className="text-[#F3F1EA]/80 leading-relaxed block">
                      O serviço FormSubmit enviou um e-mail de ativação inicial para <strong>{LUMEN_COMPANY_EMAIL}</strong>. Basta abrir esse e-mail e clicar em <strong>"Activate Form"</strong> (é necessário apenas uma única vez) para que todos os envios automáticos caiam diretamente na sua caixa de entrada.
                    </span>
                  </div>
                </div>
              )}

              {/* Ações Imediatas */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={createWhatsAppBriefingUrl(submissionSuccess.formData, submissionSuccess.protocol)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-400 text-[#070A17] font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Acelerar Atendimento via WhatsApp</span>
                </a>

                <a
                  href={createMailtoUrl(submissionSuccess.formData, submissionSuccess.protocol)}
                  className="bg-white/10 hover:bg-white/20 text-[#F3F1EA] border border-white/20 font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir no meu E-mail (Gmail/Outlook)</span>
                </a>

                <button
                  onClick={() => window.print()}
                  className="bg-white/5 hover:bg-white/10 text-[#98A1BC] hover:text-[#F3F1EA] border border-white/10 px-4 py-3 rounded-xl transition-all flex items-center gap-2 text-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Salvar PDF</span>
                </button>
              </div>
            </div>

            {/* Resumo do Mini-Briefing Enviado */}
            <div className="bg-[#0C1226]/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#F6C453]" />
                  <h3 className="font-heading text-lg font-bold text-[#F3F1EA]">Resumo do Mini-Briefing Registrado</h3>
                </div>
                <span className="text-xs text-[#98A1BC] font-mono">
                  {new Date(submissionSuccess.submittedAt).toLocaleDateString('pt-BR')} às {new Date(submissionSuccess.submittedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="bg-[#070A17]/60 border border-white/5 p-4 rounded-2xl space-y-2">
                  <span className="text-xs uppercase tracking-wider text-[#F6C453] font-semibold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Identidade do Negócio
                  </span>
                  <p><strong className="text-[#98A1BC]">Empresa:</strong> <span className="text-[#F3F1EA]">{submissionSuccess.formData.businessName}</span></p>
                  {submissionSuccess.formData.contactName && (
                    <p><strong className="text-[#98A1BC]">Responsável:</strong> <span className="text-[#F3F1EA]">{submissionSuccess.formData.contactName}</span></p>
                  )}
                  <p><strong className="text-[#98A1BC]">Segmento:</strong> <span className="text-[#F3F1EA]">{submissionSuccess.formData.segment}</span></p>
                  <p><strong className="text-[#98A1BC]">O que faz:</strong> <span className="text-[#F3F1EA]">{submissionSuccess.formData.whatItDoes}</span></p>
                  {submissionSuccess.formData.targetAudience && (
                    <p><strong className="text-[#98A1BC]">Público-alvo:</strong> <span className="text-[#F3F1EA]">{submissionSuccess.formData.targetAudience}</span></p>
                  )}
                  {submissionSuccess.formData.city && (
                    <p><strong className="text-[#98A1BC]">Região:</strong> <span className="text-[#F3F1EA]">{submissionSuccess.formData.city}</span></p>
                  )}
                </div>

                <div className="bg-[#070A17]/60 border border-white/5 p-4 rounded-2xl space-y-2">
                  <span className="text-xs uppercase tracking-wider text-[#19D3F3] font-semibold flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5" /> Operação & Presença
                  </span>
                  <p><strong className="text-[#98A1BC]">Canais ativos:</strong> <span className="text-[#F3F1EA]">{submissionSuccess.formData.currentChannels.join(', ') || 'Nenhum'}</span></p>
                  <p><strong className="text-[#98A1BC]">Frequência:</strong> <span className="text-[#F3F1EA]">{submissionSuccess.formData.postingFrequency}</span></p>
                  <p><strong className="text-[#98A1BC]">Investimento:</strong> <span className="text-[#F3F1EA]">{submissionSuccess.formData.monthlyInvestment}</span></p>
                  {submissionSuccess.formData.priceRange && (
                    <p><strong className="text-[#98A1BC]">Ticket Médio:</strong> <span className="text-[#F3F1EA]">{submissionSuccess.formData.priceRange}</span></p>
                  )}
                </div>

                <div className="bg-[#070A17]/60 border border-white/5 p-4 rounded-2xl space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" /> Objetivos & Gargalos
                  </span>
                  <p><strong className="text-[#98A1BC]">Objetivo Prioritário:</strong> <span className="text-[#F3F1EA]">{submissionSuccess.formData.mainGoal}</span></p>
                  <p><strong className="text-[#98A1BC]">Maior Dificuldade Relatada:</strong> <span className="text-[#F3F1EA]">{submissionSuccess.formData.mainDifficulty}</span></p>
                  {submissionSuccess.formData.urgency && (
                    <p><strong className="text-[#98A1BC]">Urgência:</strong> <span className="text-[#F3F1EA]">{submissionSuccess.formData.urgency}</span></p>
                  )}
                </div>
              </div>

              {/* Reset button */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs text-[#98A1BC]">Deseja enviar outro diagnóstico ou alterar os dados?</span>
                <button
                  onClick={handleResetForm}
                  className="text-xs text-[#F6C453] hover:underline font-semibold"
                >
                  Novo Mini-Briefing
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO DO MINI-BRIEFING */
          <div className="space-y-8">
            {/* Header Informativo */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#19D3F3]/10 border border-[#19D3F3]/30 text-[#19D3F3] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Diagnóstico & Mini-Briefing Estratégico</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#F3F1EA] tracking-tight">
                Diagnóstico Estratégico do Seu Negócio
              </h1>
              <p className="text-[#98A1BC] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Preencha o mini-briefing abaixo. Nossa equipe de diretores e estrategistas analisará o perfil da sua empresa e encaminhará um direcionamento completo diretamente para o seu e-mail.
              </p>

              {/* Selos de Confiança */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-[#98A1BC]">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>100% Confidencial (LGPD)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#19D3F3]" />
                  <span>Encaminhado para: <strong className="text-[#F3F1EA]">{LUMEN_COMPANY_EMAIL}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#F6C453]" />
                  <span>Retorno executivo em até 24h úteis</span>
                </span>
              </div>
            </div>

            {/* Wizard Card */}
            <div className="bg-[#0C1226]/80 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#F6C453]/5 blur-[100px] pointer-events-none" />

              {/* Progress Tracker */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#F6C453] uppercase tracking-wider">
                    Passo {currentStep} de 3 — {currentStep === 1 ? 'O Negócio' : currentStep === 2 ? 'Operação Atual' : 'Objetivo & Envio'}
                  </span>
                  <span className="text-xs font-mono text-[#98A1BC]">
                    {currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%'} concluído
                  </span>
                </div>
                <div className="w-full bg-[#070A17] h-2 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-[#19D3F3] to-[#F6C453] transition-all duration-500 rounded-full"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#98A1BC] mt-2 font-medium">
                  <span className={currentStep >= 1 ? 'text-[#F6C453]' : ''}>1. O negócio</span>
                  <span className={currentStep >= 2 ? 'text-[#F6C453]' : ''}>2. Situação atual</span>
                  <span className={currentStep >= 3 ? 'text-[#F6C453]' : ''}>3. Objetivo & Contato</span>
                </div>
              </div>

              {/* Error Banner */}
              {stepError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span className="flex-1">{stepError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* PASSO 1: O NEGÓCIO */}
                {currentStep === 1 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#F3F1EA] mb-2">
                        Nome do Negócio ou Marca <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="Ex.: Aurora Saúde, Studio Nobre, Barbearia 83..."
                        className="w-full bg-[#070A17] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] focus:ring-1 focus:ring-[#F6C453] transition-all"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#F3F1EA] mb-2">
                          Seu Nome ou Cargo <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.contactName || ''}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                          placeholder="Ex.: Dra. Camila (Sócia-fundadora)"
                          className="w-full bg-[#070A17] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] focus:ring-1 focus:ring-[#F6C453] transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#F3F1EA] mb-2">
                          Segmento de Atuação <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.segment}
                          onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                          placeholder="Ex.: Clínica Médica, Varejo de Alimentos, Consultoria..."
                          className="w-full bg-[#070A17] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] focus:ring-1 focus:ring-[#F6C453] transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#F3F1EA] mb-2">
                        O que o seu negócio vende ou faz, em uma frase? <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.whatItDoes}
                        onChange={(e) => setFormData({ ...formData, whatItDoes: e.target.value })}
                        placeholder="Ex.: Consultas integrativas e tratamentos preventivos para longevidade saudável"
                        className="w-full bg-[#070A17] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] focus:ring-1 focus:ring-[#F6C453] transition-all"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#F3F1EA] mb-2">
                          Para quem você vende? (Público-alvo) <span className="text-[#98A1BC] text-[10px] font-normal">(opcional)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.targetAudience || ''}
                          onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                          placeholder="Ex.: Mulheres de 35 a 60 anos, empresários classe A/B..."
                          className="w-full bg-[#070A17] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] focus:ring-1 focus:ring-[#F6C453] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#F3F1EA] mb-2">
                          Cidade e Estado / Região <span className="text-[#98A1BC] text-[10px] font-normal">(opcional)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.city || ''}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Ex.: Camaçari / BA, São Paulo / SP..."
                          className="w-full bg-[#070A17] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] focus:ring-1 focus:ring-[#F6C453] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PASSO 2: SITUAÇÃO ATUAL */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#F3F1EA] mb-2">
                        Canais onde já tem presença ou atua hoje
                      </label>
                      <p className="text-xs text-[#98A1BC] mb-3">Selecione todos os canais que sua empresa utiliza:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {channelOptions.map((channel) => {
                          const isSelected = formData.currentChannels.includes(channel);
                          return (
                            <button
                              key={channel}
                              type="button"
                              onClick={() => toggleChannel(channel)}
                              className={`p-3 rounded-xl border text-xs font-medium transition-all text-left flex items-center justify-between ${
                                isSelected
                                  ? 'bg-[#19D3F3]/10 border-[#19D3F3] text-[#F3F1EA] shadow-[0_0_12px_rgba(25,211,243,0.15)]'
                                  : 'bg-[#070A17] border-white/10 text-[#98A1BC] hover:border-white/20'
                              }`}
                            >
                              <span>{channel}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#19D3F3] shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#F3F1EA] mb-2">
                        Com que frequência você publica ou anuncia hoje? <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={formData.postingFrequency}
                        onChange={(e) => setFormData({ ...formData, postingFrequency: e.target.value })}
                        className="w-full bg-[#070A17] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F3F1EA] focus:border-[#F6C453] focus:ring-1 focus:ring-[#F6C453] transition-all"
                      >
                        {postingFrequencyOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#0C1226] text-[#F3F1EA]">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#F3F1EA] mb-2">
                          Quanto investe em marketing hoje por mês? <span className="text-rose-400">*</span>
                        </label>
                        <select
                          value={formData.monthlyInvestment}
                          onChange={(e) => setFormData({ ...formData, monthlyInvestment: e.target.value })}
                          className="w-full bg-[#070A17] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F3F1EA] focus:border-[#F6C453] focus:ring-1 focus:ring-[#F6C453] transition-all"
                        >
                          {investmentOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#0C1226] text-[#F3F1EA]">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#F3F1EA] mb-2">
                          Faixa de preço / Ticket médio do produto/serviço
                        </label>
                        <select
                          value={formData.priceRange}
                          onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                          className="w-full bg-[#070A17] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F3F1EA] focus:border-[#F6C453] focus:ring-1 focus:ring-[#F6C453] transition-all"
                        >
                          {priceRangeOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#0C1226] text-[#F3F1EA]">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* PASSO 3: O OBJETIVO E O CONTATO */}
                {currentStep === 3 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#F3F1EA] mb-2">
                        Qual o objetivo prioritário neste momento? <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={formData.mainGoal}
                        onChange={(e) => setFormData({ ...formData, mainGoal: e.target.value })}
                        className="w-full bg-[#070A17] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F3F1EA] focus:border-[#F6C453] focus:ring-1 focus:ring-[#F6C453] transition-all"
                      >
                        {mainGoalOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#0C1226] text-[#F3F1EA]">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#F3F1EA] mb-2">
                        Qual é a sua maior dificuldade ou gargalo com marketing hoje? <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={formData.mainDifficulty}
                        onChange={(e) => setFormData({ ...formData, mainDifficulty: e.target.value })}
                        placeholder="Ex.: Levar clientes para minha loja, contatos desqualificados no WhatsApp, falta de constância nos posts..."
                        className="w-full bg-[#070A17] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] focus:ring-1 focus:ring-[#F6C453] transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#F3F1EA] mb-2">
                        Prazo ou urgência para implementação
                      </label>
                      <select
                        value={formData.urgency || urgencyOptions[0]}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        className="w-full bg-[#070A17] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F3F1EA] focus:border-[#F6C453] focus:ring-1 focus:ring-[#F6C453] transition-all"
                      >
                        {urgencyOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#0C1226] text-[#F3F1EA]">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#F3F1EA] mb-2">
                          Seu E-mail Profissional <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                          placeholder="seuemail@empresa.com.br"
                          className="w-full bg-[#070A17] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] focus:ring-1 focus:ring-[#F6C453] transition-all"
                          required
                        />
                        <span className="text-[10px] text-[#98A1BC] mt-1 block">
                          Você receberá a cópia com o protocolo e retorno da análise.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#F3F1EA] mb-2">
                          WhatsApp / Telefone para Contato <span className="text-[#98A1BC] text-[10px] font-normal">(recomendado)</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.contactPhone || ''}
                          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                          placeholder="(71) 99999-9999"
                          className="w-full bg-[#070A17] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] focus:ring-1 focus:ring-[#F6C453] transition-all"
                        />
                        <span className="text-[10px] text-[#98A1BC] mt-1 block">
                          Para contato ágil da diretoria estratégica.
                        </span>
                      </div>
                    </div>

                    {/* LGPD Consent */}
                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.lgpdConsent}
                          onChange={(e) => setFormData({ ...formData, lgpdConsent: e.target.checked })}
                          className="mt-0.5 w-4 h-4 rounded border-white/20 bg-[#070A17] text-[#19D3F3] focus:ring-[#19D3F3]"
                        />
                        <span className="text-xs text-[#98A1BC] leading-relaxed">
                          Autorizo a Lumen a processar as informações para gerar este mini-briefing, encaminhar a cópia para meu e-mail e enviar recomendações estratégicas exclusivas (em total conformidade com a LGPD Lei 13.709/2018).
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Form Controls / Navigation */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={isLoading}
                      className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[#F3F1EA] font-semibold text-xs transition-all flex items-center gap-2 border border-white/10"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-7 py-3.5 rounded-xl bg-[#F6C453] hover:bg-[#e5b542] text-[#070A17] font-bold text-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(246,196,83,0.3)] ml-auto"
                    >
                      <span>Avançar</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#19D3F3] via-emerald-400 to-[#F6C453] hover:opacity-95 text-[#070A17] font-heading font-black text-sm tracking-wide transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(25,211,243,0.4)] ml-auto disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Enviando Mini-Briefing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Enviar Mini-Briefing Estratégico</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
