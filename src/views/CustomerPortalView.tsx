import React, { useState } from 'react';
import { useLumen } from '../context/LumenContext';
import { Order, OrderStatus, DeliverableItem, InteractionMessage, ClientProfile } from '../types';
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
  Receipt,
  User,
  Building,
  Mail,
  Phone,
  Send,
  Lock,
  ArrowRight,
  Check,
  FileCheck,
  Briefcase,
  Share2,
  LogOut,
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
  const {
    orders,
    activeOrderId,
    currentUser,
    currentUserEmail,
    setCurrentUserEmail,
    activeRole,
    setActiveRole,
    clients,
    getClientProfile,
    updateClientProfile,
    approveOrderDelivery,
    requestAdjustment,
    addOrderInteraction,
    navigate,
    logout,
  } = useLumen();

  const isCompanyStaff = activeRole === 'admin' || currentUser?.role === 'admin' || currentUserEmail.includes('juliano');

  // Active client profile
  const clientProfile = getClientProfile(currentUserEmail);

  // Tabs inside portal
  const [activeTab, setActiveTab] = useState<'projetos' | 'perfil' | 'interacoes' | 'financeiro'>('projetos');
  
  // Strictly isolate orders:
  // If activeRole is 'admin', user can see all orders for management.
  // If activeRole is 'client', user can ONLY see orders where customer.email matches their authenticated email!
  const displayOrders =
    activeRole === 'admin'
      ? orders
      : orders.filter((o) => o.customer.email.toLowerCase() === currentUserEmail.toLowerCase());

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    activeOrderId || displayOrders[0]?.id || ''
  );
  const [filter, setFilter] = useState<'todos' | 'em_andamento' | 'entregue'>('todos');
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [adjustmentFeedback, setAdjustmentFeedback] = useState('');
  const [previewDeliverable, setPreviewDeliverable] = useState<DeliverableItem | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<Order | null>(null);

  // Interactive message box
  const [messageInput, setMessageInput] = useState('');

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<ClientProfile>(clientProfile);

  // Sync profile form when currentUser changes
  React.useEffect(() => {
    setProfileForm(clientProfile);
  }, [currentUserEmail, clients]);

  const filteredOrders = displayOrders.filter((o) => {
    if (filter === 'todos') return true;
    if (filter === 'em_andamento') return o.status !== 'aprovado' && o.status !== 'entregue';
    if (filter === 'entregue') return o.status === 'entregue' || o.status === 'aprovado';
    return true;
  });

  const currentOrder = displayOrders.find((o) => o.id === selectedOrderId) || filteredOrders[0] || displayOrders[0];

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentOrder) return;
    addOrderInteraction(currentOrder.id, {
      text: messageInput.trim(),
      role: activeRole,
      authorName: activeRole === 'client' ? clientProfile.name : 'Equipe Lumen (Curadoria)',
    });
    setMessageInput('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateClientProfile(profileForm);
    setIsEditingProfile(false);
  };

  const remainingRounds = currentOrder
    ? currentOrder.revisionRoundsTotal - currentOrder.revisionRoundsUsed
    : 0;

  return (
    <div className="py-10 md:py-16 bg-[#070A17] min-h-screen text-[#F3F1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TOP STATUS BAR: SECURITY & IDENTITY CONTEXT */}
        <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-4 sm:p-6 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#19D3F3] to-[#FF2E93] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#070A17] rounded-full flex items-center justify-center font-heading font-bold text-lg text-[#F6C453]">
                  {clientProfile?.name ? clientProfile.name.charAt(0).toUpperCase() : 'C'}
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#070A17] rounded-full" title="Conexão Segura Ativa" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-base sm:text-lg text-[#F3F1EA]">
                  {clientProfile?.name || 'Cliente Lumen'}
                </h2>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verificado
                </span>
              </div>
              <p className="text-xs text-[#98A1BC] flex items-center gap-2 mt-0.5">
                <span>{clientProfile?.companyName || 'Empresa'}</span>
                <span>•</span>
                <span className="font-mono">{clientProfile?.document || 'Documento autenticado'}</span>
                <span>•</span>
                <span className="text-[#19D3F3]">{clientProfile?.segment}</span>
              </p>
            </div>
          </div>

          {/* Quick switcher to simulate both client and agency access */}
          <div className="flex flex-wrap items-center gap-2 bg-[#070A17] p-1.5 rounded-xl border border-[rgba(243,241,234,0.1)] self-start lg:self-auto text-xs">
            {isCompanyStaff && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
                <span className="text-[10px] font-mono text-[#F6C453] uppercase">Ver Perfil:</span>
                <select
                  value={currentUserEmail}
                  onChange={(e) => setCurrentUserEmail(e.target.value)}
                  className="bg-transparent text-xs text-[#F3F1EA] font-semibold focus:outline-none cursor-pointer"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.email} className="bg-[#0C1226] text-[#F3F1EA]">
                      {c.name} ({c.companyName})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => setActiveRole('client')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeRole === 'client'
                  ? 'bg-[#F6C453] text-[#070A17] font-bold shadow'
                  : 'text-[#98A1BC] hover:text-[#F3F1EA]'
              }`}
            >
              Visão do Cliente
            </button>
            <button
              onClick={() => setActiveRole('admin')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeRole === 'admin'
                  ? 'bg-[#19D3F3] text-[#070A17] font-bold shadow'
                  : 'text-[#98A1BC] hover:text-[#F3F1EA]'
              }`}
            >
              Visão Empresa / Agência
            </button>
            <button
              onClick={() => logout()}
              className="px-3 py-1.5 rounded-lg font-medium text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all flex items-center gap-1"
              title="Encerrar Sessão Segura"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* MAIN NAV TABS */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[rgba(243,241,234,0.12)] pb-4 mb-8">
          <button
            onClick={() => setActiveTab('projetos')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'projetos'
                ? 'bg-[#F3F1EA] text-[#070A17] shadow-lg'
                : 'text-[#98A1BC] hover:text-[#F3F1EA] hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Projetos & Entregas ({displayOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('interacoes')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'interacoes'
                ? 'bg-[#F3F1EA] text-[#070A17] shadow-lg'
                : 'text-[#98A1BC] hover:text-[#F3F1EA] hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Canal Direto de Interação</span>
            {currentOrder?.interactions && currentOrder.interactions.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#19D3F3]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('financeiro')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'financeiro'
                ? 'bg-[#F3F1EA] text-[#070A17] shadow-lg'
                : 'text-[#98A1BC] hover:text-[#F3F1EA] hover:bg-white/5'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Recibos & Contratos</span>
          </button>

          <button
            onClick={() => setActiveTab('perfil')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'perfil'
                ? 'bg-[#F3F1EA] text-[#070A17] shadow-lg'
                : 'text-[#98A1BC] hover:text-[#F3F1EA] hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Perfil da Empresa & Briefings</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => navigate('dashboard')}
              className="bg-[#19D3F3]/10 hover:bg-[#19D3F3]/20 text-[#19D3F3] border border-[#19D3F3]/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>Ver Dashboard Resumo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('produtos')}
              className="bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
            >
              <span>Contratar Solução</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PROJETOS E ENTREGAS                                               */}
        {/* ========================================================================= */}
        {activeTab === 'projetos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Orders List */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Filter Pills */}
              <div className="flex items-center gap-1 p-1 bg-[#0C1226] border border-[rgba(243,241,234,0.1)] rounded-xl text-xs">
                <button
                  onClick={() => setFilter('todos')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
                    filter === 'todos' ? 'bg-white/10 text-[#F3F1EA]' : 'text-[#98A1BC]'
                  }`}
                >
                  Todos ({displayOrders.length})
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
                  const cfg = statusBadgeConfig[ord.status];
                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrderId(ord.id)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-[#0C1226] border-[#F6C453] shadow-[0_0_20px_rgba(246,196,83,0.15)]'
                          : 'bg-[#0C1226]/50 border-[rgba(243,241,234,0.08)] hover:border-[rgba(243,241,234,0.2)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[11px] text-[#98A1BC]">{ord.id}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1.5 ${cfg.bg} ${cfg.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </div>
                      <div className="font-heading font-bold text-sm text-[#F3F1EA] mb-1">
                        {ord.productTitle}
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#98A1BC]">
                        <span>{ord.tierName}</span>
                        <span className="font-mono text-[#F3F1EA]">
                          R$ {ord.price.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredOrders.length === 0 && (
                  <div className="text-center p-8 border border-dashed border-white/10 rounded-2xl text-xs text-[#98A1BC]">
                    Nenhum projeto encontrado nesta categoria.
                  </div>
                )}
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
                        {currentOrder.contractNumber && (
                          <span className="text-[10px] font-mono text-[#98A1BC] border border-white/10 px-2 py-0.5 rounded">
                            {currentOrder.contractNumber}
                          </span>
                        )}
                      </div>
                      <h2 className="font-heading text-2xl font-bold text-[#F3F1EA]">
                        {currentOrder.productTitle}
                      </h2>
                      <p className="text-xs text-[#98A1BC] mt-0.5">
                        Contratado em {new Date(currentOrder.createdAt).toLocaleDateString('pt-BR')} por {currentOrder.customer.name}
                      </p>
                    </div>

                    {/* Actions for Delivered Orders */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setShowReceiptModal(currentOrder)}
                        className="bg-white/5 hover:bg-white/10 text-[#F3F1EA] border border-white/10 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5 text-[#19D3F3]" />
                        <span>Ver Recibo</span>
                      </button>

                      {currentOrder.status === 'entregue' && (
                        <>
                          <button
                            onClick={handleOpenAdjustment}
                            disabled={remainingRounds <= 0}
                            className="bg-white/5 hover:bg-white/10 text-[#F3F1EA] border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-30 flex items-center gap-1.5"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-[#FF2E93]" />
                            <span>Pedir Ajuste ({remainingRounds})</span>
                          </button>

                          <button
                            onClick={handleApprove}
                            className="bg-[#F6C453] hover:bg-[#ffd875] text-[#070A17] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Aprovar Entrega</span>
                          </button>
                        </>
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
                  </div>

                  {/* Status Timeline */}
                  <div className="py-6 border-b border-[rgba(243,241,234,0.1)]">
                    <div className="text-xs font-mono uppercase text-[#98A1BC] tracking-wider mb-4 flex items-center justify-between">
                      <span>Linha do Tempo de Execução & Curadoria</span>
                      <span className="text-[10px] text-[#F6C453]">Prazo estimado: {currentOrder.deliveryDays} dias úteis</span>
                    </div>
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                      {currentOrder.timeline.map((event, idx) => (
                        <div key={idx} className="relative">
                          <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#F6C453] ring-4 ring-[#0C1226]" />
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#F3F1EA]">{event.title}</span>
                            <span className="text-[10px] font-mono text-[#98A1BC]">
                              {new Date(event.timestamp).toLocaleDateString('pt-BR')} às{' '}
                              {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-[#98A1BC] mt-0.5">{event.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Briefing Summary Attached */}
                  {currentOrder.briefing ? (
                    <div className="pt-6 border-b border-[rgba(243,241,234,0.1)] pb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-mono uppercase text-[#98A1BC] tracking-wider">
                          Briefing Registrado & Validado
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                          Homologado para produção
                        </span>
                      </div>
                      <div className="bg-[#070A17] p-4 rounded-xl border border-[rgba(243,241,234,0.08)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-mono text-[#98A1BC]">Negócio / Marca:</span>
                          <div className="text-[#F3F1EA] font-semibold mt-0.5">{currentOrder.briefing.businessName}</div>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono text-[#98A1BC]">Segmento:</span>
                          <div className="text-[#F3F1EA] mt-0.5">{currentOrder.briefing.segment}</div>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[10px] uppercase font-mono text-[#98A1BC]">Público & Objetivo:</span>
                          <div className="text-[#F3F1EA] mt-0.5">{currentOrder.briefing.mainGoal}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 border-b border-[rgba(243,241,234,0.1)] flex items-center justify-between bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/20">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-yellow-300">Briefing Pendente de Envio</div>
                          <div className="text-[11px] text-[#98A1BC]">Responda ao questionário guiado de 4 perguntas para que a equipe inicie a criação.</div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('briefing', { orderId: currentOrder.id })}
                        className="bg-[#F6C453] text-[#070A17] font-bold text-xs px-3 py-1.5 rounded-lg shrink-0"
                      >
                        Responder Briefing
                      </button>
                    </div>
                  )}

                  {/* Deliverables Section */}
                  <div className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs font-mono uppercase text-[#F6C453] tracking-wider">
                          Entregáveis & Ativos de Campanha
                        </div>
                        <p className="text-xs text-[#98A1BC]">
                          Arquivos finais homologados e assinados digitalmente pela curadoria Lumen.
                        </p>
                      </div>
                      {currentOrder.deliverables && (
                        <span className="text-xs font-mono text-[#19D3F3] bg-[#19D3F3]/10 px-2 py-0.5 rounded">
                          {currentOrder.deliverables.length} arquivo(s)
                        </span>
                      )}
                    </div>

                    {(!currentOrder.deliverables || currentOrder.deliverables.length === 0) && (
                      <div className="p-8 rounded-xl border border-dashed border-white/10 text-center text-xs text-[#98A1BC] space-y-2">
                        <Clock className="w-6 h-6 mx-auto text-[#98A1BC]/50" />
                        <p>Os entregáveis estarão disponíveis aqui assim que a curadoria executiva aprovar os arquivos.</p>
                      </div>
                    )}

                    {currentOrder.deliverables && currentOrder.deliverables.length > 0 && (
                      <div className="space-y-3">
                        {currentOrder.deliverables.map((del) => (
                          <div
                            key={del.id}
                            className="bg-[#070A17] p-4 rounded-xl border border-[rgba(243,241,234,0.1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2.5 rounded-lg bg-[#F6C453]/10 text-[#F6C453] mt-0.5">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-heading font-bold text-sm text-[#F3F1EA]">
                                  {del.title}
                                </h4>
                                <p className="text-xs text-[#98A1BC] mt-0.5 line-clamp-2">
                                  {del.description}
                                </p>
                                <div className="flex items-center gap-3 text-[10px] font-mono text-[#98A1BC] mt-1.5">
                                  <span className="text-emerald-400">✓ Assinado por: {del.approvedByCuratorName}</span>
                                  {del.fileSize && <span>• {del.fileSize}</span>}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                              <button
                                onClick={() => setPreviewDeliverable(del)}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#F3F1EA] flex items-center gap-1.5 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Visualizar</span>
                              </button>
                              <a
                                href={`data:text/plain;charset=utf-8,${encodeURIComponent(del.content || del.description)}`}
                                download={`${del.title.replace(/\s+/g, '_')}.txt`}
                                className="px-3 py-1.5 rounded-lg bg-[#F6C453] text-[#070A17] hover:bg-[#ffd875] text-xs font-bold flex items-center gap-1.5 transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Baixar</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INTERAÇÕES E CANAL DIRETO COM A EQUIPE                             */}
        {/* ========================================================================= */}
        {activeTab === 'interacoes' && (
          <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[rgba(243,241,234,0.1)] gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#F6C453] tracking-widest">
                  MENSAGERIA & ALINHAMENTO DIRETO
                </span>
                <h3 className="font-heading text-xl font-bold text-[#F3F1EA]">
                  Comunicação do Projeto: {currentOrder.productTitle} (#{currentOrder.id})
                </h3>
                <p className="text-xs text-[#98A1BC] mt-0.5">
                  Converse diretamente com o curador responsável e o time executivo. Todo o histórico fica registrado para segurança mútua.
                </p>
              </div>

              <div className="text-xs bg-white/5 border border-white/10 p-2.5 rounded-xl font-mono text-[#98A1BC]">
                Atendimento: <span className="text-[#19D3F3] font-bold">Prioritário Lumen</span>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="py-6 space-y-4 min-h-[300px] max-h-[450px] overflow-y-auto pr-2">
              {(!currentOrder.interactions || currentOrder.interactions.length === 0) && (
                <div className="text-center py-12 text-xs text-[#98A1BC] space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-white/20" />
                  <p>Nenhuma mensagem registrada ainda. Inicie o diálogo com o time abaixo.</p>
                </div>
              )}

              {currentOrder.interactions?.map((msg) => {
                const isClient = msg.senderRole === 'client';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-[#98A1BC]">
                      <span className="font-bold text-[#F3F1EA]">{msg.senderName}</span>
                      <span>•</span>
                      <span>
                        {new Date(msg.timestamp).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-bold ${
                          isClient
                            ? 'bg-[#F6C453]/20 text-[#F6C453]'
                            : 'bg-[#19D3F3]/20 text-[#19D3F3]'
                        }`}
                      >
                        {msg.senderRole}
                      </span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-xs max-w-lg leading-relaxed shadow ${
                        isClient
                          ? 'bg-[#F6C453] text-[#070A17] font-medium rounded-tr-none'
                          : 'bg-[#070A17] text-[#F3F1EA] border border-[rgba(243,241,234,0.12)] rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Send message form */}
            <form onSubmit={handleSendMessage} className="pt-4 border-t border-[rgba(243,241,234,0.1)] flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={
                  activeRole === 'client'
                    ? 'Escreva para o curador da Lumen sobre o projeto...'
                    : 'Escreva como agência/empresa para responder o cliente...'
                }
                className="flex-1 bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-3 text-xs text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453]"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] px-5 py-3 rounded-xl text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Enviar</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: RECIBOS E CONTRATOS                                               */}
        {/* ========================================================================= */}
        {activeTab === 'financeiro' && (
          <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#F6C453] tracking-widest">
                TRANSPARÊNCIA FISCAL & FORMALIZAÇÃO
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#F3F1EA]">
                Recibos de Pagamento e Contratos de Prestação de Serviços
              </h3>
              <p className="text-xs text-[#98A1BC] mt-0.5">
                Todos os pagamentos processados pela Lumen possuem registro de autenticidade, recibo com discriminação de valores e vigência contratual.
              </p>
            </div>

            <div className="space-y-4">
              {displayOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#070A17] border border-[rgba(243,241,234,0.1)] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#F6C453]">Recibo #{ord.payment.txId}</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                        {ord.payment.status === 'approved' ? 'PAGO / CONFIRMADO' : 'PENDENTE'}
                      </span>
                    </div>
                    <div className="font-heading font-bold text-sm text-[#F3F1EA]">
                      {ord.productTitle} — {ord.tierName}
                    </div>
                    <div className="text-xs text-[#98A1BC] flex items-center gap-3">
                      <span>Valor: <strong className="text-[#F3F1EA]">R$ {ord.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></span>
                      <span>•</span>
                      <span>Método: {ord.payment.method === 'pix' ? 'Pix Instantâneo' : 'Cartão de Crédito'}</span>
                      <span>•</span>
                      <span>Data: {new Date(ord.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowReceiptModal(ord)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#F3F1EA] text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5 text-[#F6C453]" />
                      <span>Emitir Comprovante</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PERFIL DA EMPRESA E CLIENTE                                       */}
        {/* ========================================================================= */}
        {activeTab === 'perfil' && (
          <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[rgba(243,241,234,0.1)] gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#F6C453] tracking-widest">
                  CADASTRO EMPRESARIAL & GOVERNANÇA
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#F3F1EA]">
                  Perfil do Cliente & Dados da Marca
                </h3>
                <p className="text-xs text-[#98A1BC] mt-0.5">
                  Estas informações orientam todas as inteligências de briefing e a curadoria criativa dos seus entregáveis.
                </p>
              </div>

              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="bg-white/5 hover:bg-white/10 text-[#F3F1EA] border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto transition-all"
                >
                  Editar Dados Cadastrais
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="text-xs text-[#98A1BC] hover:text-[#F3F1EA] underline"
                >
                  Cancelar Edição
                </button>
              )}
            </div>

            {/* Profile Content View / Edit Form */}
            {!isEditingProfile ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="bg-[#070A17] p-4 rounded-xl border border-[rgba(243,241,234,0.08)] space-y-1">
                  <div className="text-[10px] font-mono text-[#98A1BC] uppercase">Responsável Legal / Titular:</div>
                  <div className="font-heading font-bold text-sm text-[#F3F1EA]">{clientProfile.name}</div>
                  <div className="text-[#98A1BC] font-mono">{clientProfile.email}</div>
                  <div className="text-[#98A1BC] font-mono">{clientProfile.phone}</div>
                </div>

                <div className="bg-[#070A17] p-4 rounded-xl border border-[rgba(243,241,234,0.08)] space-y-1">
                  <div className="text-[10px] font-mono text-[#98A1BC] uppercase">Empresa / Razão Social:</div>
                  <div className="font-heading font-bold text-sm text-[#F3F1EA]">{clientProfile.companyName}</div>
                  <div className="text-[#98A1BC] font-mono">CNPJ/CPF: {clientProfile.document}</div>
                  <div className="text-[#19D3F3]">{clientProfile.segment}</div>
                </div>

                <div className="bg-[#070A17] p-4 rounded-xl border border-[rgba(243,241,234,0.08)] space-y-1">
                  <div className="text-[10px] font-mono text-[#98A1BC] uppercase">Localização & Presença Online:</div>
                  <div className="text-[#F3F1EA]">{clientProfile.city || 'São Paulo - SP'}</div>
                  <div className="text-[#98A1BC]">{clientProfile.instagram || '@suamarca'}</div>
                  <div className="text-[#19D3F3]">{clientProfile.website || 'Sem site cadastrado'}</div>
                </div>

                <div className="bg-[#070A17] p-4 rounded-xl border border-[rgba(243,241,234,0.08)] space-y-1">
                  <div className="text-[10px] font-mono text-[#98A1BC] uppercase">Gestor de Conta Lumen:</div>
                  <div className="font-heading font-bold text-sm text-[#F6C453]">{clientProfile.accountManager || 'Renato Cunha (Diretor Estratégico)'}</div>
                  <div className="text-[11px] text-[#98A1BC]">Canal prioritário dedicado para SLA de 24h</div>
                </div>

                <div className="sm:col-span-2 bg-[#070A17] p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="text-[10px] font-mono text-[#F6C453] uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Notas Estratégicas da Curadoria (Acesso Compartilhado com Empresa):
                  </div>
                  <p className="text-xs text-[#98A1BC] leading-relaxed">
                    {clientProfile.notesFromTeam || 'Cliente com posicionamento de alto valor. Diretrizes de design minimalista, alta autoridade e foco em retorno sobre investimento.'}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#98A1BC] mb-1.5">
                      Nome do Titular
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl p-3 text-xs text-[#F3F1EA]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#98A1BC] mb-1.5">
                      Empresa / Marca
                    </label>
                    <input
                      type="text"
                      value={profileForm.companyName}
                      onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                      className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl p-3 text-xs text-[#F3F1EA]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#98A1BC] mb-1.5">
                      Segmento de Atuação
                    </label>
                    <input
                      type="text"
                      value={profileForm.segment}
                      onChange={(e) => setProfileForm({ ...profileForm, segment: e.target.value })}
                      className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl p-3 text-xs text-[#F3F1EA]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#98A1BC] mb-1.5">
                      Telefone / WhatsApp Comercial
                    </label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl p-3 text-xs text-[#F3F1EA]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#98A1BC] mb-1.5">
                      Cidade / Região
                    </label>
                    <input
                      type="text"
                      value={profileForm.city || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl p-3 text-xs text-[#F3F1EA]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#98A1BC] mb-1.5">
                      Instagram da Marca
                    </label>
                    <input
                      type="text"
                      value={profileForm.instagram || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })}
                      className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl p-3 text-xs text-[#F3F1EA]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(243,241,234,0.1)]">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#98A1BC] hover:text-[#F3F1EA]"
                  >
                    Descartar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#F6C453] text-[#070A17] font-bold text-xs px-6 py-2.5 rounded-xl shadow"
                  >
                    Salvar Perfil Atualizado
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: RECIBO FORMAL E COMPROVANTE FISCAL                               */}
      {/* ========================================================================= */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0C1226] border border-[#F6C453]/40 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#F6C453]">COMPROVANTE DE CONTRATAÇÃO</span>
                <h3 className="font-heading text-lg font-bold text-[#F3F1EA]">
                  Recibo Oficial Lumen #{showReceiptModal.payment.txId}
                </h3>
              </div>
              <button
                onClick={() => setShowReceiptModal(null)}
                className="text-[#98A1BC] hover:text-[#F3F1EA] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#070A17] p-5 rounded-xl border border-white/10 font-mono text-xs space-y-3 leading-relaxed text-[#F3F1EA]">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#98A1BC]">CONTRATO:</span>
                <span className="font-bold text-[#F6C453]">{showReceiptModal.contractNumber || 'CTR-2026-PADRAO'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#98A1BC]">SERVIÇO:</span>
                <span className="font-bold">{showReceiptModal.productTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#98A1BC]">PLANO/TIER:</span>
                <span>{showReceiptModal.tierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#98A1BC]">CLIENTE:</span>
                <span>{showReceiptModal.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#98A1BC]">DOCUMENTO:</span>
                <span>{showReceiptModal.customer.document}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#98A1BC]">DATA:</span>
                <span>{new Date(showReceiptModal.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold">
                <span className="text-[#F6C453]">TOTAL PAGO:</span>
                <span className="text-emerald-400">R$ {showReceiptModal.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#98A1BC] text-center">
              Este comprovante certifica a contratação e ativa o termo de sigilo (NDA) e direitos autorais integrais transferidos ao cliente após a conclusão.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#F3F1EA]"
              >
                Imprimir / Salvar PDF
              </button>
              <button
                onClick={() => setShowReceiptModal(null)}
                className="bg-[#F6C453] text-[#070A17] font-bold text-xs px-5 py-2 rounded-xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADJUSTMENT REQUEST                                               */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* MODAL 3: DELIVERABLE PREVIEW                                              */}
      {/* ========================================================================= */}
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
