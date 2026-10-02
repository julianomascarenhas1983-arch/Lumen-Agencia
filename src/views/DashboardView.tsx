import React, { useState } from 'react';
import { useLumen } from '../context/LumenContext';
import { Order, OrderStatus, DeliverableItem, InteractionMessage } from '../types';
import { ProjectProgress } from '../components/ProjectProgress';
import {
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  Download,
  Eye,
  Send,
  Sparkles,
  User,
  DollarSign,
  Briefcase,
  ChevronRight,
  Activity,
  FileCheck,
  Receipt,
  LogOut,
  Building,
  Users,
  SlidersHorizontal,
  Lock,
  Check,
} from 'lucide-react';

const statusStepConfig: Record<
  OrderStatus,
  { label: string; stepNumber: number; percent: number; color: string; badgeBg: string }
> = {
  aguardando_briefing: {
    label: 'Aguardando Briefing',
    stepNumber: 1,
    percent: 25,
    color: '#FFD400',
    badgeBg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  },
  em_producao: {
    label: 'Produção Criativa & IA',
    stepNumber: 2,
    percent: 50,
    color: '#19D3F3',
    badgeBg: 'bg-cyan-500/10 text-[#19D3F3] border-cyan-500/30',
  },
  em_revisao: {
    label: 'Curadoria de Especialistas',
    stepNumber: 3,
    percent: 75,
    color: '#FF2E93',
    badgeBg: 'bg-pink-500/10 text-[#FF2E93] border-pink-500/30',
  },
  entregue: {
    label: 'Material Entregue',
    stepNumber: 4,
    percent: 90,
    color: '#34D399',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  aprovado: {
    label: 'Finalizado & Homologado',
    stepNumber: 4,
    percent: 100,
    color: '#F6C453',
    badgeBg: 'bg-[#F6C453]/10 text-[#F6C453] border-[#F6C453]/30',
  },
};

export const DashboardView: React.FC = () => {
  const {
    orders,
    clients,
    currentUser,
    currentUserEmail,
    setCurrentUserEmail,
    getClientProfile,
    activeRole,
    setActiveRole,
    addOrderInteraction,
    navigate,
    logout,
  } = useLumen();

  // If role is admin or master account (Juliano), allow company integration switcher
  const isCompanyTeam = activeRole === 'admin' || currentUser?.role === 'admin' || currentUserEmail.includes('juliano');

  const clientProfile = getClientProfile(currentUserEmail);

  // Filter orders strictly:
  // If in company team mode without specific client filter, can see all.
  // If in client view or specific client selected, see only that client's orders!
  const displayOrders =
    activeRole === 'admin'
      ? orders
      : orders.filter((o) => o.customer.email.toLowerCase() === currentUserEmail.toLowerCase());

  // Selected quick order for interaction feed
  const [selectedFeedOrderId, setSelectedFeedOrderId] = useState<string>(
    displayOrders[0]?.id || ''
  );
  const [quickMessageText, setQuickMessageText] = useState('');

  // Calculate high-level stats
  const totalInvested = displayOrders.reduce((sum, o) => sum + (o.payment?.amount || o.price), 0);
  const activeOrders = displayOrders.filter((o) => o.status !== 'aprovado');
  const deliveredOrders = displayOrders.filter((o) => o.status === 'entregue' || o.status === 'aprovado');
  
  // Total deliverables across all client orders
  const allDeliverables: { orderTitle: string; orderId: string; item: DeliverableItem }[] = [];
  displayOrders.forEach((o) => {
    o.deliverables?.forEach((del) => {
      allDeliverables.push({ orderTitle: o.productTitle, orderId: o.id, item: del });
    });
  });

  // Collect all interactions flattened for a unified recent interactions feed
  const allInteractions: {
    orderId: string;
    orderTitle: string;
    msg: InteractionMessage;
  }[] = [];

  displayOrders.forEach((o) => {
    o.interactions?.forEach((msg) => {
      allInteractions.push({
        orderId: o.id,
        orderTitle: o.productTitle,
        msg,
      });
    });
  });

  // Sort interactions newest first
  allInteractions.sort(
    (a, b) => new Date(b.msg.timestamp).getTime() - new Date(a.msg.timestamp).getTime()
  );

  const selectedFeedOrder = displayOrders.find((o) => o.id === selectedFeedOrderId) || displayOrders[0];

  const handleSendQuickMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessageText.trim() || !selectedFeedOrder) return;

    addOrderInteraction(selectedFeedOrder.id, {
      text: quickMessageText.trim(),
      role: activeRole,
      authorName: activeRole === 'client' ? clientProfile.name : 'Curadoria Lumen',
    });
    setQuickMessageText('');
  };

  return (
    <div className="py-10 md:py-16 bg-[#070A17] min-h-screen text-[#F3F1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* 0. COMPANY MASTER INTEGRATION BAR (ACESSO DA EMPRESA INTEGRADO A TODOS OS CLIENTES) */}
        {isCompanyTeam && (
          <div className="bg-[#0C1226] border border-[#19D3F3]/40 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#19D3F3]/15 text-[#19D3F3] border border-[#19D3F3]/30 shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-[#F3F1EA]">
                    Acesso Integrado da Empresa (Visão Master Lumen)
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-[#19D3F3]/15 text-[#19D3F3] border border-[#19D3F3]/30 px-2 py-0.5 rounded-full font-bold">
                    Integração Ativa
                  </span>
                </div>
                <p className="text-xs text-[#98A1BC] mt-0.5">
                  Você está com credencial executiva. Selecione qualquer cliente abaixo para auditar suas compras, contratos e interações em tempo real.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Client Selector Dropdown for Agency */}
              <div className="flex items-center gap-2 bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-3 py-1.5 text-xs">
                <Users className="w-3.5 h-3.5 text-[#F6C453]" />
                <span className="text-[#98A1BC] font-mono text-[11px] hidden sm:inline">Cliente:</span>
                <select
                  value={currentUserEmail}
                  onChange={(e) => {
                    setCurrentUserEmail(e.target.value);
                  }}
                  className="bg-transparent text-[#F3F1EA] font-semibold focus:outline-none cursor-pointer text-xs"
                >
                  {clients.map((cli) => {
                    const clientOrderTotal = orders.filter(
                      (o) => o.customer.email.toLowerCase() === cli.email.toLowerCase()
                    ).length;
                    return (
                      <option key={cli.id} value={cli.email} className="bg-[#0C1226] text-[#F3F1EA]">
                        {cli.name} ({cli.companyName}) — {clientOrderTotal} compras
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Toggle to Admin Panel */}
              <button
                onClick={() => navigate('admin')}
                className="px-3.5 py-2 rounded-xl bg-[#F6C453] hover:bg-[#ffd875] text-[#070A17] text-xs font-bold transition-all shadow flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Painel CRM & Catálogo</span>
              </button>
            </div>
          </div>
        )}

        {/* 1. HERO EXECUTIVE SUMMARY BAR */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0C1226] via-[#0E1733] to-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Subtle CMYK Glow accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#19D3F3]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#FF2E93]/10 rounded-full blur-3xl pointer-events-none -mb-20" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6C453]/10 border border-[#F6C453]/30 text-[#F6C453] text-xs font-mono font-semibold">
                <Activity className="w-3.5 h-3.5 animate-pulse text-[#F6C453]" />
                PAINEL DE CONTROLE // VISÃO GERAL EXECUTIVA
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#F3F1EA] tracking-tight">
                Olá, {clientProfile?.name.split(' ')[0] || 'Cliente'}
              </h1>
              <p className="text-sm text-[#98A1BC] max-w-2xl">
                Acompanhe em tempo real a esteira de produção dos seus produtos contratados, status de entregas da curadoria e o diálogo direto com o time da Lumen.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('conta')}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold border border-white/15 text-[#F3F1EA] transition-all flex items-center gap-2"
              >
                <User className="w-4 h-4 text-[#F6C453]" />
                <span>Portal Detalhado & Recibos</span>
              </button>

              <button
                onClick={() => navigate('produtos')}
                className="bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_4px_16px_rgba(255,59,48,0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
              >
                <span>Contratar nova solução</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => logout()}
                className="px-3.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold border border-red-500/20 text-red-400 transition-all flex items-center gap-1.5"
                title="Encerrar Sessão Segura"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[rgba(243,241,234,0.1)]">
            <div className="bg-[#070A17]/60 backdrop-blur-sm p-4 rounded-2xl border border-[rgba(243,241,234,0.08)]">
              <div className="flex items-center justify-between text-[#98A1BC] text-xs font-mono mb-1">
                <span>CONTRATADOS</span>
                <Layers className="w-4 h-4 text-[#19D3F3]" />
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-[#F3F1EA]">
                {displayOrders.length}
              </div>
              <span className="text-[11px] text-[#98A1BC] mt-0.5 block">Soluções estratégicas</span>
            </div>

            <div className="bg-[#070A17]/60 backdrop-blur-sm p-4 rounded-2xl border border-[rgba(243,241,234,0.08)]">
              <div className="flex items-center justify-between text-[#98A1BC] text-xs font-mono mb-1">
                <span>EM PRODUÇÃO</span>
                <Clock className="w-4 h-4 text-[#FFD400]" />
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-[#FFD400]">
                {activeOrders.length}
              </div>
              <span className="text-[11px] text-[#98A1BC] mt-0.5 block">Na esteira de criação</span>
            </div>

            <div className="bg-[#070A17]/60 backdrop-blur-sm p-4 rounded-2xl border border-[rgba(243,241,234,0.08)]">
              <div className="flex items-center justify-between text-[#98A1BC] text-xs font-mono mb-1">
                <span>ENTREGÁVEIS</span>
                <FileCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-emerald-400">
                {allDeliverables.length}
              </div>
              <span className="text-[11px] text-[#98A1BC] mt-0.5 block">Arquivos homologados</span>
            </div>

            <div className="bg-[#070A17]/60 backdrop-blur-sm p-4 rounded-2xl border border-[rgba(243,241,234,0.08)]">
              <div className="flex items-center justify-between text-[#98A1BC] text-xs font-mono mb-1">
                <span>TOTAL INVESTIDO</span>
                <Receipt className="w-4 h-4 text-[#F6C453]" />
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-[#F6C453]">
                R$ {totalInvested.toLocaleString('pt-BR')}
              </div>
              <span className="text-[11px] text-[#98A1BC] mt-0.5 block">Comprovantes emitidos</span>
            </div>
          </div>
        </div>

        {/* PROJECT PROGRESS VISUALIZATION (RECHARTS) */}
        {displayOrders.length > 0 && (
          <ProjectProgress
            orders={displayOrders}
            onSelectOrder={(orderId) => navigate('conta', { orderId })}
          />
        )}

        {/* 2. MAIN SPLIT: PRODUTOS CONTRATADOS & STATUS (LEFT) + FEED DE INTERAÇÕES (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: PRODUTOS CONTRATADOS & STATUS DE ENTREGAS */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#F6C453] tracking-widest block mb-0.5">
                  STATUS EM TEMPO REAL
                </span>
                <h2 className="font-heading text-xl font-bold text-[#F3F1EA]">
                  Produtos Contratados & Prazos
                </h2>
              </div>
              <span className="text-xs text-[#98A1BC] font-mono">
                {displayOrders.length} pedido(s)
              </span>
            </div>

            <div className="space-y-4">
              {displayOrders.map((ord) => {
                const step = statusStepConfig[ord.status];
                return (
                  <div
                    key={ord.id}
                    className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 hover:border-[rgba(243,241,234,0.25)] transition-all shadow-xl space-y-5"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(243,241,234,0.08)]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-[#F6C453]">#{ord.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${step.badgeBg}`}>
                            {step.label}
                          </span>
                          {ord.contractNumber && (
                            <span className="text-[10px] font-mono text-[#98A1BC] border border-white/10 px-2 py-0.5 rounded hidden sm:inline-block">
                              {ord.contractNumber}
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading text-lg font-bold text-[#F3F1EA]">
                          {ord.productTitle}
                        </h3>
                        <p className="text-xs text-[#98A1BC]">
                          Plano: <span className="text-[#F3F1EA] font-semibold">{ord.tierName}</span> • Prazo: <strong className="text-[#19D3F3]">{ord.deliveryDays} dias úteis</strong>
                        </p>
                      </div>

                      <div className="text-right flex sm:flex-col justify-between items-center sm:items-end gap-1">
                        <span className="font-mono text-sm font-bold text-[#F6C453]">
                          R$ {ord.price.toLocaleString('pt-BR')}
                        </span>
                        <button
                          onClick={() => navigate('conta', { orderId: ord.id })}
                          className="text-xs text-[#19D3F3] hover:underline flex items-center gap-1 font-medium"
                        >
                          <span>Ver no Portal</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & Milestone Tracker */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#98A1BC] font-mono text-[11px]">Progresso da Esteira:</span>
                        <span className="font-mono font-bold text-[#19D3F3]">{step.percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#070A17] rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${step.percent}%`,
                            backgroundColor: step.color,
                            boxShadow: `0 0 10px ${step.color}66`,
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-4 text-[10px] font-mono text-[#98A1BC] pt-1">
                        <span className={step.stepNumber >= 1 ? 'text-[#F3F1EA] font-bold' : 'text-[#98A1BC]/40'}>
                          1. Briefing
                        </span>
                        <span className={`text-center ${step.stepNumber >= 2 ? 'text-[#19D3F3] font-bold' : 'text-[#98A1BC]/40'}`}>
                          2. Produção
                        </span>
                        <span className={`text-center ${step.stepNumber >= 3 ? 'text-[#FF2E93] font-bold' : 'text-[#98A1BC]/40'}`}>
                          3. Curadoria
                        </span>
                        <span className={`text-right ${step.stepNumber >= 4 ? 'text-emerald-400 font-bold' : 'text-[#98A1BC]/40'}`}>
                          4. Entrega
                        </span>
                      </div>
                    </div>

                    {/* Latest Timeline Event Notification */}
                    {ord.timeline && ord.timeline.length > 0 && (
                      <div className="bg-[#070A17] p-3 rounded-xl border border-[rgba(243,241,234,0.06)] flex items-start gap-2.5 text-xs">
                        <div className="p-1 rounded-md bg-[#F6C453]/10 text-[#F6C453] mt-0.5 shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <strong className="text-[#F3F1EA] truncate">
                              {ord.timeline[ord.timeline.length - 1].title}
                            </strong>
                            <span className="text-[10px] font-mono text-[#98A1BC] shrink-0 ml-2">
                              {new Date(ord.timeline[ord.timeline.length - 1].timestamp).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#98A1BC] mt-0.5 line-clamp-1">
                            {ord.timeline[ord.timeline.length - 1].description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Entregáveis rápidos se houver */}
                    {ord.deliverables && ord.deliverables.length > 0 && (
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono text-[#98A1BC]">Arquivos disponíveis:</span>
                        {ord.deliverables.map((del) => (
                          <a
                            key={del.id}
                            href={`data:text/plain;charset=utf-8,${encodeURIComponent(del.content || del.description)}`}
                            download={`${del.title.replace(/\s+/g, '_')}.txt`}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">{del.title}</span>
                          </a>
                        ))}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: FEED DE INTERAÇÕES RECENTES & MENSAGERIA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#19D3F3] tracking-widest block mb-0.5">
                  FEED COLABORATIVO
                </span>
                <h2 className="font-heading text-xl font-bold text-[#F3F1EA]">
                  Interações Recentes
                </h2>
              </div>
              <span className="text-xs text-[#98A1BC] font-mono">
                {allInteractions.length} mensagem(ns)
              </span>
            </div>

            {/* Interaction Feed Box */}
            <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 shadow-xl space-y-5">
              
              {/* Order selector for writing new message */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#98A1BC] mb-1.5">
                  Canal do Projeto Ativo:
                </label>
                <select
                  value={selectedFeedOrderId}
                  onChange={(e) => setSelectedFeedOrderId(e.target.value)}
                  className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-3 py-2 text-xs text-[#F3F1EA] focus:border-[#19D3F3]"
                >
                  {displayOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      #{o.id} — {o.productTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Timeline of Messages */}
              <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
                {allInteractions.length === 0 && (
                  <div className="text-center py-10 text-xs text-[#98A1BC] space-y-2">
                    <MessageSquare className="w-8 h-8 mx-auto text-white/20" />
                    <p>Nenhuma mensagem trocada ainda.</p>
                  </div>
                )}

                {allInteractions.map(({ orderId, orderTitle, msg }) => {
                  const isClient = msg.senderRole === 'client';
                  return (
                    <div
                      key={msg.id}
                      className="p-3.5 rounded-xl bg-[#070A17] border border-[rgba(243,241,234,0.08)] space-y-1.5 transition-all hover:border-[rgba(243,241,234,0.18)]"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isClient ? 'bg-[#F6C453]' : 'bg-[#19D3F3]'
                            }`}
                          />
                          <strong className={isClient ? 'text-[#F6C453]' : 'text-[#19D3F3]'}>
                            {msg.senderName}
                          </strong>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 bg-white/5 rounded text-[#98A1BC] font-mono">
                            {msg.senderRole}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#98A1BC]">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-xs text-[#F3F1EA] leading-relaxed">
                        {msg.text}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] font-mono text-[#98A1BC]">
                        <span>Projeto: #{orderId}</span>
                        <span className="text-[#19D3F3] truncate max-w-[140px]">{orderTitle}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick reply bar */}
              <form onSubmit={handleSendQuickMessage} className="pt-2 border-t border-[rgba(243,241,234,0.1)] flex gap-2">
                <input
                  type="text"
                  value={quickMessageText}
                  onChange={(e) => setQuickMessageText(e.target.value)}
                  placeholder={`Enviar mensagem sobre #${selectedFeedOrder?.id || 'pedido'}...`}
                  className="flex-1 bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2.5 text-xs text-[#F3F1EA] placeholder-[#98A1BC]/50 focus:border-[#F6C453]"
                />
                <button
                  type="submit"
                  disabled={!quickMessageText.trim()}
                  className="bg-[#F6C453] hover:bg-[#ffd875] text-[#070A17] px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar</span>
                </button>
              </form>

            </div>

            {/* Support and SLA commitment card */}
            <div className="bg-[#0C1226]/60 border border-[rgba(243,241,234,0.08)] rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#19D3F3]/10 text-[#19D3F3] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <h4 className="font-heading font-bold text-[#F3F1EA] text-sm">
                  Garantia de Curadoria & SLA
                </h4>
                <p className="text-[#98A1BC] mt-0.5 leading-relaxed">
                  Todas as mensagens no feed são atendidas pelo Diretor de Estratégia responsável pela sua conta em até 24 horas úteis.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
