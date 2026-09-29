import React, { useState } from 'react';
import { useLumen } from '../context/LumenContext';
import { Order, OrderStatus, DeliverableItem } from '../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  RefreshCw,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

const statusBadgeConfig: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  aguardando_briefing: {
    label: 'Aguardando Briefing',
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    text: 'text-yellow-400',
    dot: 'bg-yellow-400',
  },
  em_producao: {
    label: 'Em Produção (IA + Curadoria)',
    bg: 'bg-cyan-500/10 border-cyan-500/30',
    text: 'text-[#19D3F3]',
    dot: 'bg-[#19D3F3]',
  },
  em_revisao: {
    label: 'Em Revisão por Especialista',
    bg: 'bg-purple-500/10 border-purple-500/30',
    text: 'text-purple-400',
    dot: 'bg-purple-400',
  },
  entregue: {
    label: 'Entregue (Aguardando Aceite)',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  aprovado: {
    label: 'Concluído e Aprovado',
    bg: 'bg-[#F6C453]/10 border-[#F6C453]/30',
    text: 'text-[#F6C453]',
    dot: 'bg-[#F6C453]',
  },
};

export const CustomerPortalView: React.FC = () => {
  const { orders, activeOrderId, approveOrderDelivery, requestAdjustment, navigate } =
    useLumen();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    activeOrderId || orders[0]?.id || ''
  );
  const [filter, setFilter] = useState<'todos' | 'em_andamento' | 'entregue'>('todos');
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [adjustmentFeedback, setAdjustmentFeedback] = useState('');
  const [previewDeliverable, setPreviewDeliverable] = useState<DeliverableItem | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (filter === 'todos') return true;
    if (filter === 'em_andamento') return o.status !== 'aprovado' && o.status !== 'entregue';
    if (filter === 'entregue') return o.status === 'entregue' || o.status === 'aprovado';
    return true;
  });

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || filteredOrders[0];

  const handleOpenAdjustment = () => {
    setAdjustmentFeedback('');
    setShowAdjustmentModal(true);
  };

  const handleSubmitAdjustment = () => {
    if (!currentOrder || !adjustmentFeedback.trim()) return;
    const ok = requestAdjustment(currentOrder.id, adjustmentFeedback.trim());
    if (ok) {
      setShowAdjustmentModal(false);
    }
  };

  const handleApprove = () => {
    if (!currentOrder) return;
    approveOrderDelivery(currentOrder.id);
  };

  const remainingRounds = currentOrder
    ? currentOrder.revisionRoundsTotal - currentOrder.revisionRoundsUsed
    : 0;

  return (
    <div className="py-10 md:py-16 bg-[#070A17] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#F6C453] mb-1">
              PAINEL DO CLIENTE // HISTÓRICO & ENTREGAS
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-[#F3F1EA] tracking-tight">
              Acompanhamento de Projetos
            </h1>
          </div>

          <button
            onClick={() => navigate('produtos')}
            className="bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md self-start md:self-auto min-h-[44px] flex items-center gap-1.5"
          >
            <span>Contratar novo serviço</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Orders Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Orders List */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Filter Pills */}
            <div className="flex items-center gap-2 p-1 bg-[#0C1226] border border-[rgba(243,241,234,0.1)] rounded-xl text-xs">
              <button
                onClick={() => setFilter('todos')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
                  filter === 'todos' ? 'bg-white/10 text-[#F3F1EA]' : 'text-[#98A1BC]'
                }`}
              >
                Todos ({orders.length})
              </button>
              <button
                onClick={() => setFilter('em_andamento')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
                  filter === 'em_andamento' ? 'bg-white/10 text-[#F3F1EA]' : 'text-[#98A1BC]'
                }`}
              >
                Em Produção
              </button>
              <button
                onClick={() => setFilter('entregue')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
                  filter === 'entregue' ? 'bg-white/10 text-[#F3F1EA]' : 'text-[#98A1BC]'
                }`}
              >
                Entregues
              </button>
            </div>

            {/* List */}
            <div className="space-y-3">
              {filteredOrders.map((ord) => {
                const isSelected = ord.id === currentOrder?.id;
                const badge = statusBadgeConfig[ord.status];
                return (
                  <button
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-[#0C1226] border-[#F6C453]/60 shadow-lg'
                        : 'bg-[#0C1226]/50 border-[rgba(243,241,234,0.08)] hover:border-[rgba(243,241,234,0.2)]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono text-[#98A1BC]">#{ord.id}</span>
                      <span className="text-[11px] text-[#98A1BC]">
                        {new Date(ord.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <h4 className="font-heading text-sm font-bold text-[#F3F1EA] mb-1 line-clamp-1">
                      {ord.productTitle}
                    </h4>

                    <div className="text-xs text-[#98A1BC] mb-3">
                      Nível {ord.tierName} • R$ {ord.price.toLocaleString('pt-BR')}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[rgba(243,241,234,0.06)]">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1.5 ${badge.bg} ${badge.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <span>{badge.label}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#98A1BC]" />
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Order Detail & Deliverables */}
          {currentOrder && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Order Status Card */}
              <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 sm:p-8">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[rgba(243,241,234,0.1)] gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-[#F6C453]">Pedido #{currentOrder.id}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          statusBadgeConfig[currentOrder.status].bg
                        } ${statusBadgeConfig[currentOrder.status].text}`}
                      >
                        {statusBadgeConfig[currentOrder.status].label}
                      </span>
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-[#F3F1EA]">
                      {currentOrder.productTitle}
                    </h2>
                    <p className="text-xs text-[#98A1BC]">
                      Contratado em {new Date(currentOrder.createdAt).toLocaleDateString('pt-BR')} por {currentOrder.customer.name}
                    </p>
                  </div>

                  {/* Actions for Delivered Orders */}
                  {currentOrder.status === 'entregue' && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleOpenAdjustment}
                        disabled={remainingRounds <= 0}
                        className="bg-white/5 hover:bg-white/10 text-[#F3F1EA] border border-white/10 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-30 flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#FF2E93]" />
                        <span>Pedir Ajuste ({remainingRounds} restante{remainingRounds === 1 ? '' : 's'})</span>
                      </button>

                      <button
                        onClick={handleApprove}
                        className="bg-[#F6C453] hover:bg-[#ffd875] text-[#070A17] px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Aprovar Entrega</span>
                      </button>
                    </div>
                  )}

                  {currentOrder.status === 'aguardando_briefing' && (
                    <button
                      onClick={() => navigate('briefing', { orderId: currentOrder.id })}
                      className="bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Iniciar Briefing com IA</span>
                    </button>
                  )}
                </div>

                {/* Status Timeline */}
                <div className="py-6 border-b border-[rgba(243,241,234,0.1)]">
                  <div className="text-xs font-mono uppercase text-[#98A1BC] tracking-wider mb-4">
                    Linha do Tempo de Execução & Curadoria
                  </div>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                    {currentOrder.timeline.map((event, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#F6C453] ring-4 ring-[#0C1226]" />
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#F3F1EA]">{event.title}</span>
                          <span className="text-[10px] font-mono text-[#98A1BC]">
                            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-[#98A1BC] mt-0.5">{event.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Briefing Summary Attached */}
                {currentOrder.briefing && (
                  <div className="pt-6">
                    <div className="text-xs font-mono uppercase text-[#98A1BC] tracking-wider mb-3">
                      Briefing Validado
                    </div>
                    <div className="bg-[#070A17] p-4 rounded-xl border border-[rgba(243,241,234,0.08)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-[#98A1BC]">Negócio:</span>
                        <div className="text-[#F3F1EA] font-semibold mt-0.5">{currentOrder.briefing.businessName}</div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono text-[#98A1BC]">Público:</span>
                        <div className="text-[#F3F1EA] mt-0.5 line-clamp-2">{currentOrder.briefing.targetAudience}</div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Deliverables Section */}
              <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#F3F1EA]">
                      Arquivos & Entregáveis Prontos
                    </h3>
                    <p className="text-xs text-[#98A1BC]">
                      Material final revisado por especialistas e pronto para aplicação imediata.
                    </p>
                  </div>

                  {currentOrder.deliverables && currentOrder.deliverables.length > 0 && (
                    <span className="text-xs font-mono bg-white/5 text-[#F6C453] px-2.5 py-1 rounded">
                      {currentOrder.deliverables.length} arquivo(s)
                    </span>
                  )}
                </div>

                {(!currentOrder.deliverables || currentOrder.deliverables.length === 0) ? (
                  <div className="text-center py-12 border border-dashed border-[rgba(243,241,234,0.15)] rounded-xl bg-[#070A17]/50">
                    <Clock className="w-8 h-8 text-[#98A1BC]/50 mx-auto mb-3" />
                    <h4 className="font-heading text-sm font-bold text-[#F3F1EA] mb-1">
                      Material em fase de produção e curadoria
                    </h4>
                    <p className="text-xs text-[#98A1BC] max-w-sm mx-auto">
                      Nossos especialistas estão refinando seus entregáveis. Assim que a revisão for assinada, os arquivos aparecerão aqui.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentOrder.deliverables.map((del) => (
                      <div
                        key={del.id}
                        className="bg-[#070A17] border border-[rgba(243,241,234,0.1)] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-3 rounded-lg bg-[#F6C453]/10 border border-[#F6C453]/30 text-[#F6C453] shrink-0 mt-0.5">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-heading text-sm font-bold text-[#F3F1EA]">
                                {del.title}
                              </h4>
                              {del.fileSize && (
                                <span className="text-[10px] font-mono text-[#98A1BC] bg-white/5 px-2 py-0.5 rounded">
                                  {del.fileSize}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#98A1BC] mt-1">{del.description}</p>
                            <div className="text-[11px] text-[#19D3F3] mt-2 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Curadoria assinada por: {del.approvedByCuratorName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {del.content && (
                            <button
                              onClick={() => setPreviewDeliverable(del)}
                              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#F3F1EA] border border-white/10 transition-colors flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Visualizar</span>
                            </button>
                          )}
                          <a
                            href={`data:text/plain;charset=utf-8,${encodeURIComponent(del.content || del.title)}`}
                            download={`${del.title.toLowerCase().replace(/\s+/g, '-')}.txt`}
                            className="px-3.5 py-2 rounded-lg bg-[#F6C453] hover:bg-[#ffd875] text-[#070A17] text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

      </div>

      {/* ADJUSTMENT REQUEST MODAL */}
      {showAdjustmentModal && currentOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.2)] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[rgba(243,241,234,0.1)] pb-4">
              <h3 className="font-heading text-lg font-bold text-[#F3F1EA] flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#FF2E93]" />
                <span>Solicitar Rodada de Ajuste</span>
              </h3>
              <span className="text-xs font-mono bg-white/5 text-[#FF2E93] px-2.5 py-1 rounded">
                Rodada {currentOrder.revisionRoundsUsed + 1} de {currentOrder.revisionRoundsTotal}
              </span>
            </div>

            <p className="text-xs text-[#98A1BC] leading-relaxed">
              Descreva detalhadamente o que você gostaria de modificar. O curador responsável analisará seus apontamentos e fará as intervenções necessárias.
            </p>

            <textarea
              rows={4}
              value={adjustmentFeedback}
              onChange={(e) => setAdjustmentFeedback(e.target.value)}
              placeholder="Ex.: Gostaria de ajustar o contraste das cores no slide 3 e refinar a chamada de ação final..."
              className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl p-4 text-xs text-[#F3F1EA] focus:border-[#F6C453] resize-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAdjustmentModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#98A1BC] hover:text-[#F3F1EA]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitAdjustment}
                disabled={!adjustmentFeedback.trim()}
                className="bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] px-5 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
              >
                Enviar solicitação de ajuste
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELIVERABLE TEXT PREVIEW MODAL */}
      {previewDeliverable && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0C1226] border border-[rgba(246,196,83,0.3)] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-[rgba(243,241,234,0.1)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#F6C453] uppercase">Visualizador de Entrega</span>
                <h3 className="font-heading text-lg font-bold text-[#F3F1EA]">
                  {previewDeliverable.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDeliverable(null)}
                className="text-[#98A1BC] hover:text-[#F3F1EA] text-sm font-bold p-2"
              >
                Fechar
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-[#F3F1EA] whitespace-pre-wrap leading-relaxed bg-[#070A17]">
              {previewDeliverable.content}
            </div>

            <div className="p-4 border-t border-[rgba(243,241,234,0.1)] flex items-center justify-between text-xs text-[#98A1BC]">
              <span>Curadoria: {previewDeliverable.approvedByCuratorName}</span>
              <button
                onClick={() => setPreviewDeliverable(null)}
                className="bg-[#F6C453] text-[#070A17] font-bold px-4 py-2 rounded-lg"
              >
                Concluir Leitura
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
