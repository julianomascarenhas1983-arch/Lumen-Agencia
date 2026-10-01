import React, { useState } from 'react';
import { useLumen } from '../context/LumenContext';
import { OrderStatus, DeliverableItem } from '../types';
import { TierLevel } from '../data/catalog';
import {
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Plus,
  RefreshCw,
  Edit,
  Save,
  RotateCcw,
  Sparkles,
  FileCheck,
  Users,
  MessageSquare,
  Send,
  Building,
  Mail,
  Phone,
  Receipt,
  UserCheck,
  LayoutDashboard,
} from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const {
    orders,
    products,
    clients,
    setCurrentUserEmail,
    setActiveRole,
    addOrderInteraction,
    updateClientProfile,
    updateOrderStatus,
    addDeliverable,
    updateTierPrice,
    updateTierDays,
    resetCatalog,
    navigate,
  } = useLumen();

  const [activeTab, setActiveTab] = useState<'fila' | 'clientes' | 'catalogo'>('fila');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'todos'>('todos');
  const [adminReplyText, setAdminReplyText] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  
  // Deliverable modal state
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [attachData, setAttachData] = useState({
    title: '',
    description: '',
    content: '',
    curatorName: 'Renato Cunha (Diretor Criativo Lumen)',
  });

  // Calculate Metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment.amount || o.price), 0);
  const inReviewCount = orders.filter(
    (o) => o.status === 'em_producao' || o.status === 'em_revisao'
  ).length;
  const avgDeliveryDays = Math.round(
    orders.reduce((sum, o) => sum + o.deliveryDays, 0) / (totalOrders || 1)
  );

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'todos') return true;
    return o.status === statusFilter;
  });

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || filteredOrders[0];

  const handleApproveAndDeliver = (orderId: string) => {
    // Generate draft deliverable if none
    const deliverable: DeliverableItem = {
      id: `del-${Date.now()}`,
      title: `${selectedOrder.productTitle} - Versão Final Homologada`,
      type: 'pdf',
      description: 'Material validado pelo curador responsável, pronto para aplicação comercial.',
      fileSize: '3.2 MB',
      approvedByCuratorName: 'Ana Beatriz Mello (Curadora Sênior Lumen)',
      content: `ENTREGÁVEL FINAL HOMOLOGADO // LUMEN
Projeto: ${selectedOrder.productTitle} (${selectedOrder.tierName})
Cliente: ${selectedOrder.customer.name}
Data de Homologação: ${new Date().toLocaleDateString('pt-BR')}

1. AVALIAÇÃO DE CONFORMIDADE
O material foi auditado conforme as diretrizes do briefing aprovado em ${new Date(selectedOrder.createdAt).toLocaleDateString('pt-BR')}.

2. ENTREGÁVEIS INCLUSOS
- Arquivos mestres e vetoriais prontos para veiculação
- Guia de aplicação e boas práticas para evitar perda de qualidade
- Resolução de todas as observações solicitadas

Curadoria executiva realizada por Ana Beatriz Mello.`,
    };

    addDeliverable(orderId, deliverable);
  };

  const handleSendToAdjustment = (orderId: string) => {
    updateOrderStatus(
      orderId,
      'em_producao',
      'Curador solicitou refinamento interno da redação publicitária e contraste cromático antes da entrega ao cliente.'
    );
  };

  const handleSaveAttachedDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !attachData.title.trim()) return;

    const newDeliverable: DeliverableItem = {
      id: `del-manual-${Date.now()}`,
      title: attachData.title.trim(),
      type: 'pdf',
      description: attachData.description.trim() || 'Arquivo inserido manualmente pelo curador.',
      fileSize: '2.5 MB',
      approvedByCuratorName: attachData.curatorName,
      content: attachData.content.trim() || 'Conteúdo executivo anexado diretamente no painel interno.',
    };

    addDeliverable(selectedOrder.id, newDeliverable);
    setShowAttachModal(false);
    setAttachData({
      title: '',
      description: '',
      content: '',
      curatorName: 'Renato Cunha (Diretor Criativo Lumen)',
    });
  };

  return (
    <div className="py-10 md:py-16 bg-[#070A17] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F6C453]/10 border border-[#F6C453]/30 text-[#F6C453] text-[11px] font-mono mb-2">
              ACESSO RESTRITO // CURADORIA & GOVERNANÇA
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-[#F3F1EA] tracking-tight">
              Painel Interno Lumen
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('fila')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'fila'
                  ? 'bg-[#F6C453] text-[#070A17] border-[#F6C453]'
                  : 'bg-[#0C1226] text-[#98A1BC] border-[rgba(243,241,234,0.1)] hover:text-[#F3F1EA]'
              }`}
            >
              Fila de Produção
            </button>
            <button
              onClick={() => setActiveTab('clientes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                activeTab === 'clientes'
                  ? 'bg-[#19D3F3] text-[#070A17] border-[#19D3F3]'
                  : 'bg-[#0C1226] text-[#98A1BC] border-[rgba(243,241,234,0.1)] hover:text-[#F3F1EA]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Clientes & Perfis</span>
            </button>
            <button
              onClick={() => setActiveTab('catalogo')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'catalogo'
                  ? 'bg-[#F6C453] text-[#070A17] border-[#F6C453]'
                  : 'bg-[#0C1226] text-[#98A1BC] border-[rgba(243,241,234,0.1)] hover:text-[#F3F1EA]'
              }`}
            >
              Gestão de Catálogo & Preços
            </button>
          </div>
        </div>

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.1)] rounded-xl p-5">
            <span className="text-[11px] font-mono text-[#98A1BC] uppercase block mb-1">
              Total de Pedidos
            </span>
            <div className="font-heading text-2xl sm:text-3xl font-bold text-[#F3F1EA]">
              {totalOrders}
            </div>
            <span className="text-[10px] text-[#19D3F3] mt-1 block">Rastreamento contínuo</span>
          </div>

          <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.1)] rounded-xl p-5">
            <span className="text-[11px] font-mono text-[#98A1BC] uppercase block mb-1">
              Receita Total Contratada
            </span>
            <div className="font-heading text-2xl sm:text-3xl font-bold text-[#F6C453]">
              R$ {totalRevenue.toLocaleString('pt-BR')}
            </div>
            <span className="text-[10px] text-[#98A1BC] mt-1 block">Pix & Cartão integrados</span>
          </div>

          <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.1)] rounded-xl p-5">
            <span className="text-[11px] font-mono text-[#98A1BC] uppercase block mb-1">
              Em Produção / Revisão
            </span>
            <div className="font-heading text-2xl sm:text-3xl font-bold text-[#FF2E93]">
              {inReviewCount}
            </div>
            <span className="text-[10px] text-[#98A1BC] mt-1 block">Necessitam auditoria</span>
          </div>

          <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.1)] rounded-xl p-5">
            <span className="text-[11px] font-mono text-[#98A1BC] uppercase block mb-1">
              Prazo Médio Contratual
            </span>
            <div className="font-heading text-2xl sm:text-3xl font-bold text-[#F3F1EA]">
              {avgDeliveryDays} dias
            </div>
            <span className="text-[10px] text-green-400 mt-1 block">100% de SLA atendido</span>
          </div>
        </div>

        {/* TAB 1: FILA DE PEDIDOS */}
        {activeTab === 'fila' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Orders Filter & List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
                {(['todos', 'em_producao', 'em_revisao', 'entregue'] as (OrderStatus | 'todos')[]).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium text-[11px] border transition-colors ${
                        statusFilter === st
                          ? 'bg-white/10 text-[#F3F1EA] border-white/20'
                          : 'text-[#98A1BC] border-transparent hover:border-white/10'
                      }`}
                    >
                      {st === 'todos' ? 'Todos' : st.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>

              <div className="space-y-3">
                {filteredOrders.map((ord) => {
                  const isSelected = ord.id === selectedOrder?.id;
                  return (
                    <button
                      key={ord.id}
                      onClick={() => setSelectedOrderId(ord.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-[#0C1226] border-[#F6C453] shadow-md'
                          : 'bg-[#0C1226]/50 border-[rgba(243,241,234,0.08)] hover:border-[rgba(243,241,234,0.2)]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-mono text-[#F6C453]">#{ord.id}</span>
                        <span className="text-[10px] uppercase font-mono text-[#98A1BC]">
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-heading text-sm font-bold text-[#F3F1EA] line-clamp-1 mb-1">
                        {ord.productTitle}
                      </h4>
                      <div className="text-xs text-[#98A1BC]">
                        {ord.customer.name} • R$ {ord.price.toLocaleString('pt-BR')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order Review Detail Box */}
            {selectedOrder && (
              <div className="lg:col-span-8 bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 sm:p-8 space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(243,241,234,0.1)]">
                  <div>
                    <span className="text-xs font-mono text-[#98A1BC]">
                      Pedido #{selectedOrder.id} • Contratado em {new Date(selectedOrder.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <h2 className="font-heading text-2xl font-bold text-[#F3F1EA]">
                      {selectedOrder.productTitle} ({selectedOrder.tierName})
                    </h2>
                    <p className="text-xs text-[#98A1BC] mt-0.5">
                      Cliente: <strong>{selectedOrder.customer.name}</strong> • {selectedOrder.customer.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#98A1BC] block">Valor Liquidado</span>
                    <span className="font-heading text-2xl font-bold text-[#F6C453]">
                      R$ {selectedOrder.price.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* CURATOR ACTION BAR */}
                <div className="p-4 rounded-xl bg-[#070A17] border border-[rgba(246,196,83,0.3)] flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs">
                    <span className="font-bold text-[#F3F1EA] block">Ações de Curadoria Obrigatória:</span>
                    <span className="text-[11px] text-[#98A1BC]">
                      Status atual: <strong className="text-[#F6C453]">{selectedOrder.status}</strong>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleSendToAdjustment(selectedOrder.id)}
                      className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#FF2E93] border border-[#FF2E93]/30 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Devolver para Ajuste Interno</span>
                    </button>

                    <button
                      onClick={() => setShowAttachModal(true)}
                      className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#19D3F3] border border-[#19D3F3]/30 transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Anexar Arquivo Manual</span>
                    </button>

                    <button
                      onClick={() => handleApproveAndDeliver(selectedOrder.id)}
                      className="px-4 py-2 rounded-lg bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Aprovar e Entregar ao Cliente</span>
                    </button>
                  </div>
                </div>

                {/* Briefing Data */}
                <div>
                  <h4 className="font-heading text-sm font-bold text-[#F3F1EA] uppercase tracking-wider mb-3">
                    Briefing Auditado
                  </h4>

                  {selectedOrder.briefing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="bg-[#070A17] p-4 rounded-xl border border-[rgba(243,241,234,0.08)]">
                        <span className="font-mono text-[10px] text-[#98A1BC] uppercase">Negócio / Marca:</span>
                        <div className="text-[#F3F1EA] font-semibold mt-1">{selectedOrder.briefing.businessName}</div>
                      </div>

                      <div className="bg-[#070A17] p-4 rounded-xl border border-[rgba(243,241,234,0.08)]">
                        <span className="font-mono text-[10px] text-[#98A1BC] uppercase">Público Prioritário:</span>
                        <div className="text-[#F3F1EA] mt-1">{selectedOrder.briefing.targetAudience}</div>
                      </div>

                      <div className="bg-[#070A17] p-4 rounded-xl border border-[rgba(243,241,234,0.08)]">
                        <span className="font-mono text-[10px] text-[#98A1BC] uppercase">Tom de Voz:</span>
                        <div className="text-[#F3F1EA] mt-1">{selectedOrder.briefing.toneOfVoice || 'Não informado'}</div>
                      </div>

                      <div className="bg-[#070A17] p-4 rounded-xl border border-[rgba(243,241,234,0.08)]">
                        <span className="font-mono text-[10px] text-[#98A1BC] uppercase">Referências:</span>
                        <div className="text-[#F3F1EA] mt-1">{selectedOrder.briefing.referencesText || 'Não informado'}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#070A17] text-xs text-[#98A1BC]">
                      Aguardando preenchimento do briefing pelo cliente.
                    </div>
                  )}
                </div>

                {/* Current Deliverables */}
                <div>
                  <h4 className="font-heading text-sm font-bold text-[#F3F1EA] uppercase tracking-wider mb-3">
                    Entregáveis Atuais ({selectedOrder.deliverables?.length || 0})
                  </h4>

                  {selectedOrder.deliverables && selectedOrder.deliverables.length > 0 ? (
                    <div className="space-y-3">
                      {selectedOrder.deliverables.map((del) => (
                        <div
                          key={del.id}
                          className="bg-[#070A17] p-4 rounded-xl border border-[rgba(243,241,234,0.08)] flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-[#F3F1EA] block">{del.title}</span>
                            <span className="text-[11px] text-[#98A1BC]">{del.description}</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#19D3F3]">
                            Assinado por: {del.approvedByCuratorName}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#070A17] text-xs text-[#98A1BC]">
                      Nenhum arquivo entregue ainda. Clique em "Aprovar e Entregar" ou "Anexar Arquivo Manual".
                    </div>
                  )}
                </div>

                {/* Direct Interactions / Alignment Chat with Client */}
                <div className="pt-6 border-t border-[rgba(243,241,234,0.1)]">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-heading text-sm font-bold text-[#F3F1EA] uppercase tracking-wider flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#19D3F3]" />
                      <span>Canal Direto de Interação com {selectedOrder.customer.name}</span>
                    </h4>
                    <span className="text-[10px] font-mono text-[#98A1BC]">
                      {selectedOrder.interactions?.length || 0} mensagem(ns)
                    </span>
                  </div>

                  <div className="bg-[#070A17] p-4 rounded-xl border border-[rgba(243,241,234,0.08)] space-y-3 max-h-60 overflow-y-auto">
                    {(!selectedOrder.interactions || selectedOrder.interactions.length === 0) && (
                      <p className="text-xs text-[#98A1BC] italic">Nenhuma mensagem trocada ainda para este pedido.</p>
                    )}
                    {selectedOrder.interactions?.map((msg) => (
                      <div key={msg.id} className="text-xs space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-[#98A1BC]">
                          <strong className={msg.senderRole === 'client' ? 'text-[#F6C453]' : 'text-[#19D3F3]'}>
                            {msg.senderName}
                          </strong>
                          <span>({msg.senderRole})</span>
                          <span>• {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="bg-[#0C1226] p-2.5 rounded-lg text-[#F3F1EA] border border-white/5">
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!adminReplyText.trim()) return;
                      addOrderInteraction(selectedOrder.id, {
                        text: adminReplyText.trim(),
                        role: 'admin',
                        authorName: 'Renato Cunha (Diretoria Lumen)',
                      });
                      setAdminReplyText('');
                    }}
                    className="flex gap-2 mt-3"
                  >
                    <input
                      type="text"
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      placeholder="Responder ao cliente ou deixar nota estratégica no projeto..."
                      className="flex-1 bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2 text-xs text-[#F3F1EA] focus:border-[#F6C453]"
                    />
                    <button
                      type="submit"
                      disabled={!adminReplyText.trim()}
                      className="bg-[#19D3F3] text-[#070A17] px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Responder</span>
                    </button>
                  </form>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 2: CLIENTES & PERFIS (CRM INTERNO DA AGÊNCIA) */}
        {activeTab === 'clientes' && (
          <div className="space-y-6">
            <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[rgba(243,241,234,0.1)] gap-4">
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#19D3F3] tracking-widest mb-1">
                    GOVERNANÇA & RELACIONAMENTO COM CONTAS
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-[#F3F1EA]">
                    Perfis dos Clientes & Vínculo Empresarial
                  </h3>
                  <p className="text-xs text-[#98A1BC] mt-0.5">
                    Consulte os dados cadastrais, histórico de pedidos, notas internas da equipe e acesse diretamente a visão de qualquer cliente.
                  </p>
                </div>

                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Buscar por cliente, empresa ou CNPJ..."
                    className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2 text-xs text-[#F3F1EA] focus:border-[#19D3F3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
                {/* Clients list */}
                <div className="lg:col-span-4 space-y-3">
                  {clients
                    .filter((c) =>
                      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
                      c.companyName.toLowerCase().includes(clientSearch.toLowerCase()) ||
                      c.document.includes(clientSearch)
                    )
                    .map((cli) => {
                      const isSelected = cli.id === selectedClientId;
                      const orderCount = orders.filter((o) => o.customer.email.toLowerCase() === cli.email.toLowerCase()).length;
                      return (
                        <div
                          key={cli.id}
                          onClick={() => setSelectedClientId(cli.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#070A17] border-[#19D3F3] shadow-[0_0_15px_rgba(25,211,243,0.15)]'
                              : 'bg-[#070A17]/40 border-[rgba(243,241,234,0.08)] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-heading font-bold text-sm text-[#F3F1EA]">{cli.name}</span>
                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-[#98A1BC] font-mono">
                              {orderCount} projeto(s)
                            </span>
                          </div>
                          <p className="text-xs text-[#19D3F3] font-medium">{cli.companyName}</p>
                          <p className="text-[11px] text-[#98A1BC] mt-0.5">{cli.email}</p>
                        </div>
                      );
                    })}
                </div>

                {/* Selected Client Dossier */}
                {(() => {
                  const selCli = clients.find((c) => c.id === selectedClientId) || clients[0];
                  if (!selCli) return null;
                  const cliOrders = orders.filter((o) => o.customer.email.toLowerCase() === selCli.email.toLowerCase());
                  const totalSpent = cliOrders.reduce((sum, o) => sum + (o.payment.amount || o.price), 0);

                  return (
                    <div className="lg:col-span-8 bg-[#070A17] border border-[rgba(243,241,234,0.1)] rounded-2xl p-6 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading text-xl font-bold text-[#F3F1EA]">{selCli.name}</h4>
                            <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                              Ativo
                            </span>
                          </div>
                          <p className="text-xs text-[#98A1BC] mt-0.5">
                            {selCli.companyName} • {selCli.segment} • {selCli.city || 'São Paulo - SP'}
                          </p>
                        </div>

                        {/* Button to log in / view as this client */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => {
                              setCurrentUserEmail(selCli.email);
                              setActiveRole('client');
                              navigate('dashboard');
                            }}
                            className="bg-[#19D3F3] hover:bg-[#15b7d3] text-[#070A17] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
                            title="Abrir Dashboard Visual com compras e status deste cliente"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            <span>Dashboard do Cliente</span>
                          </button>
                          <button
                            onClick={() => {
                              setCurrentUserEmail(selCli.email);
                              setActiveRole('client');
                              navigate('conta');
                            }}
                            className="bg-white/10 hover:bg-white/20 text-[#F3F1EA] border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                            title="Abrir Portal Completo com recibos fiscais deste cliente"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Portal & Recibos</span>
                          </button>
                        </div>
                      </div>

                      {/* Financial and Account Manager summary */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                        <div className="bg-[#0C1226] p-3.5 rounded-xl border border-white/5">
                          <span className="text-[10px] uppercase font-mono text-[#98A1BC] block">LTV Contratado</span>
                          <span className="font-bold text-sm text-[#F6C453]">R$ {totalSpent.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="bg-[#0C1226] p-3.5 rounded-xl border border-white/5">
                          <span className="text-[10px] uppercase font-mono text-[#98A1BC] block">Total Pedidos</span>
                          <span className="font-bold text-sm text-[#F3F1EA]">{cliOrders.length}</span>
                        </div>
                        <div className="bg-[#0C1226] p-3.5 rounded-xl border border-white/5">
                          <span className="text-[10px] uppercase font-mono text-[#98A1BC] block">CNPJ / CPF</span>
                          <span className="font-bold text-xs text-[#F3F1EA] font-mono">{selCli.document}</span>
                        </div>
                        <div className="bg-[#0C1226] p-3.5 rounded-xl border border-white/5">
                          <span className="text-[10px] uppercase font-mono text-[#98A1BC] block">Gestor da Conta</span>
                          <span className="font-bold text-xs text-[#19D3F3]">{selCli.accountManager || 'Renato Cunha'}</span>
                        </div>
                      </div>

                      {/* Internal Notes from Agency */}
                      <div className="bg-[#0C1226] p-4 rounded-xl border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#F6C453] uppercase font-mono flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            Anotações Privadas da Equipe (Notas Internas de Vínculo):
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={selCli.notesFromTeam || ''}
                          onChange={(e) => updateClientProfile({ ...selCli, notesFromTeam: e.target.value })}
                          placeholder="Adicione orientações de atendimento, preferências do cliente, prazos especiais ou observações..."
                          className="w-full bg-[#070A17] border border-white/10 rounded-xl p-3 text-xs text-[#F3F1EA] focus:border-[#F6C453]"
                        />
                        <span className="text-[10px] text-[#98A1BC] block">
                          As notas são salvas automaticamente e ficam visíveis apenas para usuários internos da Lumen.
                        </span>
                      </div>

                      {/* Client Orders History */}
                      <div>
                        <h5 className="font-heading text-xs uppercase font-bold text-[#98A1BC] tracking-wider mb-3">
                          Projetos e Contratos deste Cliente
                        </h5>
                        <div className="space-y-2">
                          {cliOrders.map((co) => (
                            <div
                              key={co.id}
                              className="bg-[#0C1226] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-bold text-[#F3F1EA] block">{co.productTitle} ({co.tierName})</span>
                                <span className="text-[10px] text-[#98A1BC] font-mono">
                                  #{co.id} • {co.contractNumber || 'Sem contrato'} • Status: {co.status}
                                </span>
                              </div>
                              <span className="font-bold text-[#F6C453]">R$ {co.price.toLocaleString('pt-BR')}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  );
                })()}
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: GESTÃO DO CATÁLOGO DE PRODUTOS */}
        {activeTab === 'catalogo' && (
          <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(243,241,234,0.1)]">
              <div>
                <h3 className="font-heading text-xl font-bold text-[#F3F1EA]">
                  Gestão Centralizada de Preços e Níveis do Catálogo
                </h3>
                <p className="text-xs text-[#98A1BC] mt-1">
                  Qualquer valor editado nesta tabela é imediatamente propagado para a Home, a Vitrine, a Página de Produto e o Checkout.
                </p>
              </div>

              <button
                onClick={resetCatalog}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#98A1BC] hover:text-[#F3F1EA] border border-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Valores Padrão</span>
              </button>
            </div>

            <div className="space-y-8">
              {products.map((product) => (
                <div
                  key={product.slug}
                  className="bg-[#070A17] border border-[rgba(243,241,234,0.08)] rounded-xl p-6 space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#F6C453] uppercase">
                        {product.pillar.toUpperCase()}
                      </span>
                      <h4 className="font-heading text-lg font-bold text-[#F3F1EA]">
                        {product.title}
                      </h4>
                      <p className="text-xs text-[#98A1BC] mt-0.5">{product.shortDescription}</p>
                    </div>

                    <button
                      onClick={() => navigate('produto-detalhe', { slug: product.slug, tier: 'pro' })}
                      className="text-xs font-semibold text-[#F6C453] hover:underline"
                    >
                      Ver página pública
                    </button>
                  </div>

                  {/* Tier Edit Rows */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[rgba(243,241,234,0.06)]">
                    {(['essencial', 'pro', 'premium'] as TierLevel[]).map((level) => {
                      const t = product.tiers[level];
                      return (
                        <div
                          key={level}
                          className="bg-[#0C1226] border border-[rgba(243,241,234,0.1)] rounded-xl p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#F3F1EA] uppercase">{t.name}</span>
                            <span className="text-[10px] font-mono text-[#98A1BC]">Nível {level}</span>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-[#98A1BC] mb-1">
                              Preço em BRL (R$):
                            </label>
                            <input
                              type="number"
                              value={t.price}
                              onChange={(e) =>
                                updateTierPrice(product.slug, level, Number(e.target.value))
                              }
                              className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-lg px-3 py-1.5 text-xs text-[#F3F1EA] font-bold focus:border-[#F6C453]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-[#98A1BC] mb-1">
                              Prazo de Entrega (Dias Úteis):
                            </label>
                            <input
                              type="number"
                              value={t.deliveryDays}
                              onChange={(e) =>
                                updateTierDays(product.slug, level, Number(e.target.value))
                              }
                              className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-lg px-3 py-1.5 text-xs text-[#F3F1EA] focus:border-[#F6C453]"
                            />
                          </div>

                          <div className="text-[10px] text-[#98A1BC] pt-1">
                            {t.revisionsCount} rodadas de ajuste • {t.deliverables.length} entregáveis
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* ATTACH DELIVERABLE MODAL */}
      {showAttachModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveAttachedDeliverable}
            className="bg-[#0C1226] border border-[rgba(243,241,234,0.2)] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[rgba(243,241,234,0.1)] pb-3">
              <h3 className="font-heading text-lg font-bold text-[#F3F1EA]">
                Anexar Entregável ao Pedido #{selectedOrder.id}
              </h3>
              <button
                type="button"
                onClick={() => setShowAttachModal(false)}
                className="text-xs text-[#98A1BC] hover:text-[#F3F1EA]"
              >
                Fechar
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1">
                Título do Entregável *
              </label>
              <input
                type="text"
                required
                value={attachData.title}
                onChange={(e) => setAttachData({ ...attachData, title: e.target.value })}
                placeholder="Ex.: Pack de Artes Finalizadas (12 Peças)"
                className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2 text-xs text-[#F3F1EA] focus:border-[#F6C453]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1">
                Descrição Curta
              </label>
              <input
                type="text"
                value={attachData.description}
                onChange={(e) => setAttachData({ ...attachData, description: e.target.value })}
                placeholder="Ex.: Arquivos em 1080x1350 com variações para Stories."
                className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2 text-xs text-[#F3F1EA] focus:border-[#F6C453]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1">
                Nome do Curador Responsável
              </label>
              <input
                type="text"
                value={attachData.curatorName}
                onChange={(e) => setAttachData({ ...attachData, curatorName: e.target.value })}
                className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2 text-xs text-[#F3F1EA] focus:border-[#F6C453]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1">
                Conteúdo / Link / Texto do Entregável
              </label>
              <textarea
                rows={4}
                value={attachData.content}
                onChange={(e) => setAttachData({ ...attachData, content: e.target.value })}
                placeholder="Insira notas do entregável, links para arquivos Figma/Drive ou texto final..."
                className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl p-3 text-xs text-[#F3F1EA] focus:border-[#F6C453]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAttachModal(false)}
                className="px-4 py-2 text-xs text-[#98A1BC] hover:text-[#F3F1EA]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#F6C453] hover:bg-[#ffd875] text-[#070A17] px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                Salvar e Disponibilizar
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
