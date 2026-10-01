import React, { useState, useEffect, useRef } from 'react';
import { useLumen } from '../context/LumenContext';
import { generateLocalBriefingResponse } from '../data/localFallback';
import {
  Sparkles,
  Send,
  CheckCircle2,
  FileText,
  User,
  Bot,
  ArrowRight,
  Loader2,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export const BriefingView: React.FC = () => {
  const { orders, activeOrderId, getOrder, saveOrderBriefing, navigate } = useLumen();
  
  // Find order or default to the most recent one
  const order = getOrder(activeOrderId || '') || orders[0];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Live briefing summary state
  const [summary, setSummary] = useState({
    businessName: order?.customer.name || '',
    segment: '',
    targetAudience: '',
    mainGoal: '',
    toneOfVoice: '',
    referencesText: '',
    extraNotes: '',
  });

  // Initialize conversation
  useEffect(() => {
    if (!order) return;

    if (order.briefing?.confirmedAt) {
      // Already filled
      setIsComplete(true);
      setSummary({
        businessName: order.briefing.businessName || '',
        segment: order.briefing.segment || '',
        targetAudience: order.briefing.targetAudience || '',
        mainGoal: order.briefing.mainGoal || '',
        toneOfVoice: order.briefing.toneOfVoice || '',
        referencesText: order.briefing.referencesText || '',
        extraNotes: order.briefing.extraNotes || '',
      });
      return;
    }

    const initialGreeting = `Olá, ${order.customer.name.split(' ')[0]}! Eu sou a IA de Briefing da Lumen. Parabéns pela contratação de **${order.productTitle} (${order.tierName})**!\n\nVou guiar você com 4 perguntas rápidas para que nosso time de especialistas receba os dados estratégicos com máxima precisão.\n\nPara começar: qual é o **nome oficial da sua marca ou empresa**, e em uma frase, qual o principal serviço ou produto que você oferece?`;

    setMessages([
      {
        role: 'assistant',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [order?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping || !order) return;

    const userText = inputText.trim();
    setInputText('');

    const newMessages: ChatMessage[] = [
      ...messages,
      {
        role: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];

    setMessages(newMessages);
    setIsTyping(true);

    try {
      const nextCount = questionCount + 1;
      setQuestionCount(nextCount);

      const response = await fetch('/api/briefing/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: order.productTitle,
          tierName: order.tierName,
          history: newMessages,
          userMessage: userText,
          questionCount: nextCount,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.assistantMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      if (data.isComplete && data.summary) {
        setIsComplete(true);
        setSummary((prev) => ({
          ...prev,
          ...data.summary,
        }));
      } else {
        // Incrementally fill summary fields based on count
        if (nextCount === 2) {
          setSummary((prev) => ({ ...prev, businessName: userText.slice(0, 80) }));
        } else if (nextCount === 3) {
          setSummary((prev) => ({ ...prev, targetAudience: userText }));
        } else if (nextCount === 4) {
          setSummary((prev) => ({ ...prev, toneOfVoice: userText }));
        }
      }
    } catch (err) {
      console.warn('API /api/briefing/chat offline ou ambiente estático, usando assistente local:', err);
      const localData = generateLocalBriefingResponse(userText, questionCount + 1, order.productTitle, newMessages);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: localData.assistantMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      if (localData.isComplete && localData.summary) {
        setIsComplete(true);
        setSummary((prev) => ({ ...prev, ...localData.summary }));
      } else {
        if (questionCount + 1 === 2) {
          setSummary((prev) => ({ ...prev, businessName: userText.slice(0, 80) }));
        } else if (questionCount + 1 === 3) {
          setSummary((prev) => ({ ...prev, targetAudience: userText }));
        } else if (questionCount + 1 === 4) {
          setSummary((prev) => ({ ...prev, toneOfVoice: userText }));
        }
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleConfirmBriefing = () => {
    if (!order) return;

    saveOrderBriefing(order.id, {
      ...summary,
      chatTranscript: messages,
    });

    navigate('conta', { orderId: order.id });
  };

  if (!order) {
    return (
      <div className="py-20 text-center text-[#98A1BC]">
        <p>Nenhum pedido ativo encontrado para preenchimento de briefing.</p>
        <button onClick={() => navigate('produtos')} className="mt-4 text-[#F6C453] underline">
          Voltar para produtos
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-14 bg-[#070A17] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Info Banner */}
        <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.1)] rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#F6C453] uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Pedido #{order.id} // Pagamento Aprovado</span>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#F3F1EA]">
              Briefing Estratégico: {order.productTitle}
            </h1>
            <p className="text-xs text-[#98A1BC] mt-0.5">
              Nível: {order.tierName} • Prazo: {order.deliveryDays} dias úteis após validação
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/5 text-[#98A1BC] border border-white/10">
              Etapa: Conversa com IA
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interactive Chat */}
          <div className="lg:col-span-7 flex flex-col h-[650px] bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-[rgba(243,241,234,0.1)] bg-[#070A17] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#F6C453]/15 border border-[#F6C453]/40 flex items-center justify-center text-[#F6C453]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-heading text-sm font-bold text-[#F3F1EA] block">
                    Lumen Briefing Assistant
                  </span>
                  <span className="text-[11px] text-[#19D3F3] block">
                    Conectado ao Gemini 3.8
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono text-[#98A1BC]">
                Pergunta {Math.min(questionCount, 4)}/4
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, index) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      isAssistant ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {isAssistant && (
                      <div className="w-7 h-7 rounded-full bg-[#F6C453]/10 border border-[#F6C453]/30 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-3.5 h-3.5 text-[#F6C453]" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                        isAssistant
                          ? 'bg-[#070A17] border border-[rgba(243,241,234,0.12)] text-[#F3F1EA]'
                          : 'bg-[#FF3B30] text-[#F3F1EA]'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      <div
                        className={`text-[10px] mt-1 text-right ${
                          isAssistant ? 'text-[#98A1BC]/60' : 'text-white/70'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>

                    {!isAssistant && (
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
                        <User className="w-3.5 h-3.5 text-[#F3F1EA]" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#F6C453]/10 border border-[#F6C453]/30 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-[#F6C453]" />
                  </div>
                  <div className="bg-[#070A17] border border-[rgba(243,241,234,0.1)] px-4 py-2.5 rounded-2xl text-xs text-[#98A1BC] flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F6C453]" />
                    <span>Lumen Assistant está formulando o resumo...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-[rgba(243,241,234,0.1)] bg-[#070A17] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Digite sua resposta e pressione Enter..."
                disabled={isTyping}
                className="flex-1 bg-[#0C1226] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453] transition-colors min-h-[44px]"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="bg-[#F6C453] hover:bg-[#ffd875] text-[#070A17] px-4 py-3 rounded-xl transition-all disabled:opacity-40 min-h-[44px] flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* Right Column: Structured Briefing Summary & Confirmation */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#0C1226] border border-[rgba(246,196,83,0.3)] rounded-2xl p-6 sm:p-8 shadow-xl">
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-xs text-[#F6C453] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Resumo do Briefing Estruturado</span>
                </div>
                {isComplete && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-300 px-2 py-0.5 rounded">
                    Sintetizado
                  </span>
                )}
              </div>

              <p className="text-xs text-[#98A1BC] mb-6">
                Conforme você responde no chat, os pontos-chave são organizados para a mesa de criação dos nossos especialistas.
              </p>

              {/* Fields */}
              <div className="space-y-4 text-xs">
                <div className="bg-[#070A17] p-3 rounded-xl border border-[rgba(243,241,234,0.08)]">
                  <span className="text-[#98A1BC] block text-[10px] uppercase font-mono">
                    Marca / Negócio:
                  </span>
                  <input
                    type="text"
                    value={summary.businessName}
                    onChange={(e) => setSummary({ ...summary, businessName: e.target.value })}
                    placeholder="Nome da marca..."
                    className="w-full bg-transparent text-[#F3F1EA] font-semibold mt-1 focus:outline-none"
                  />
                </div>

                <div className="bg-[#070A17] p-3 rounded-xl border border-[rgba(243,241,234,0.08)]">
                  <span className="text-[#98A1BC] block text-[10px] uppercase font-mono">
                    Público-Alvo Prioritário:
                  </span>
                  <textarea
                    rows={2}
                    value={summary.targetAudience}
                    onChange={(e) => setSummary({ ...summary, targetAudience: e.target.value })}
                    placeholder="Quem é o cliente ideal..."
                    className="w-full bg-transparent text-[#F3F1EA] text-xs mt-1 focus:outline-none resize-none"
                  />
                </div>

                <div className="bg-[#070A17] p-3 rounded-xl border border-[rgba(243,241,234,0.08)]">
                  <span className="text-[#98A1BC] block text-[10px] uppercase font-mono">
                    Tom de Voz & Estética Visual:
                  </span>
                  <input
                    type="text"
                    value={summary.toneOfVoice}
                    onChange={(e) => setSummary({ ...summary, toneOfVoice: e.target.value })}
                    placeholder="Ex.: Minimalista, sóbrio, arrojado..."
                    className="w-full bg-transparent text-[#F3F1EA] text-xs mt-1 focus:outline-none"
                  />
                </div>

                <div className="bg-[#070A17] p-3 rounded-xl border border-[rgba(243,241,234,0.08)]">
                  <span className="text-[#98A1BC] block text-[10px] uppercase font-mono">
                    Referências / Marcas Admiradas:
                  </span>
                  <input
                    type="text"
                    value={summary.referencesText}
                    onChange={(e) => setSummary({ ...summary, referencesText: e.target.value })}
                    placeholder="Ex.: Apple, Nubank, Dieter Rams..."
                    className="w-full bg-transparent text-[#F3F1EA] text-xs mt-1 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-[rgba(243,241,234,0.1)] space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#98A1BC]">
                <ShieldCheck className="w-4 h-4 text-[#19D3F3]" />
                <span>Após confirmar, o status avança para <strong>"Em produção"</strong>.</span>
              </div>

              {/* Primary Action Button (Red token --r: #FF3B30) */}
              <button
                onClick={handleConfirmBriefing}
                className="w-full bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] py-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-[0_6px_24px_rgba(255,59,48,0.4)] hover:scale-[1.01] active:scale-[0.99] min-h-[48px] flex items-center justify-center gap-2"
              >
                <span>Confirmar e Enviar para Produção</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
