import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { Order, OrderStatus } from '../types';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';

interface ProjectProgressProps {
  orders: Order[];
  onSelectOrder?: (orderId: string) => void;
  className?: string;
}

const statusWeight: Record<OrderStatus, { percent: number; label: string; color: string; badge: string }> = {
  aguardando_briefing: {
    percent: 25,
    label: 'Briefing',
    color: '#FFD400',
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  },
  em_producao: {
    percent: 50,
    label: 'Produção IA',
    color: '#19D3F3',
    badge: 'bg-cyan-500/10 text-[#19D3F3] border-cyan-500/30',
  },
  em_revisao: {
    percent: 75,
    label: 'Curadoria',
    color: '#FF2E93',
    badge: 'bg-pink-500/10 text-[#FF2E93] border-pink-500/30',
  },
  entregue: {
    percent: 90,
    label: 'Entregue',
    color: '#34D399',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  aprovado: {
    percent: 100,
    label: 'Homologado',
    color: '#F6C453',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
};

export const ProjectProgress: React.FC<ProjectProgressProps> = ({
  orders,
  onSelectOrder,
  className = '',
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedBarId, setSelectedBarId] = useState<string | null>(null);

  // Compute stats and timeline chart items
  const chartData = orders
    .filter((ord) => {
      if (filterMode === 'active') return ord.status !== 'entregue' && ord.status !== 'aprovado';
      if (filterMode === 'completed') return ord.status === 'entregue' || ord.status === 'aprovado';
      return true;
    })
    .map((ord) => {
      const info = statusWeight[ord.status] || {
        percent: 10,
        label: 'Iniciado',
        color: '#98A1BC',
        badge: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
      };

      // Elapsed & estimated days calculation
      const createdDate = new Date(ord.createdAt);
      const now = new Date();
      const diffMs = Math.max(0, now.getTime() - createdDate.getTime());
      const elapsedDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
      const totalSlaDays = ord.deliveryDays || 5;
      const daysRemaining = Math.max(0, totalSlaDays - elapsedDays);
      const isOverdue = elapsedDays > totalSlaDays && ord.status !== 'entregue' && ord.status !== 'aprovado';

      // Truncate campaign name nicely for chart axis
      const shortName =
        ord.productTitle.length > 22 ? `${ord.productTitle.slice(0, 20)}...` : ord.productTitle;

      return {
        id: ord.id,
        fullName: ord.productTitle,
        shortName,
        tierName: ord.tierName,
        status: ord.status,
        statusLabel: info.label,
        progress: info.percent,
        color: info.color,
        deliveryDays: totalSlaDays,
        elapsedDays,
        daysRemaining: ord.status === 'aprovado' || ord.status === 'entregue' ? 0 : daysRemaining,
        isOverdue,
        price: ord.price,
        createdAt: ord.createdAt,
        rawOrder: ord,
      };
    });

  // Calculate average completion
  const averageProgress =
    chartData.length > 0
      ? Math.round(chartData.reduce((acc, curr) => acc + curr.progress, 0) / chartData.length)
      : 0;

  const totalActive = orders.filter((o) => o.status !== 'entregue' && o.status !== 'aprovado').length;
  const totalCompleted = orders.filter((o) => o.status === 'entregue' || o.status === 'aprovado').length;

  const activeFocusCampaign =
    chartData.find((d) => d.id === selectedBarId) || chartData[0];

  return (
    <div
      className={`bg-gradient-to-b from-[#0C1226] to-[#080D1D] border border-[rgba(243,241,234,0.12)] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* Background visual accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#19D3F3]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF2E93]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header with Title and Mode Toggles */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[rgba(243,241,234,0.08)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#19D3F3]/10 border border-[#19D3F3]/30 text-[#19D3F3] text-xs font-mono font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            CRONOGRAMA & TIMELINE DE ENTREGAS
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#F3F1EA] tracking-tight">
            Progresso dos Projetos & Campanhas
          </h2>
          <p className="text-xs text-[#98A1BC] mt-0.5">
            Visualize em tempo real o avanço percentual e prazos de cada esteira contratada.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 bg-[#070A17] p-1 rounded-xl border border-white/10 self-start md:self-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterMode === 'all'
                ? 'bg-white/15 text-[#F3F1EA] font-bold shadow'
                : 'text-[#98A1BC] hover:text-[#F3F1EA]'
            }`}
          >
            Todos ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('active')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterMode === 'active'
                ? 'bg-[#19D3F3] text-[#070A17] font-bold shadow'
                : 'text-[#98A1BC] hover:text-[#F3F1EA]'
            }`}
          >
            Em Andamento ({totalActive})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('completed')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterMode === 'completed'
                ? 'bg-emerald-500 text-[#070A17] font-bold shadow'
                : 'text-[#98A1BC] hover:text-[#F3F1EA]'
            }`}
          >
            Finalizados ({totalCompleted})
          </button>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#98A1BC]">
          Nenhuma campanha encontrada para este filtro.
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Main Chart Visualization (Recharts) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#98A1BC]">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#98A1BC]">
                Avanço por Campanha (% da Esteira)
              </span>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD400]" /> Briefing
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#19D3F3]" /> IA
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E93]" /> Curadoria
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Entrega
                </span>
              </div>
            </div>

            {/* Recharts Container */}
            <div className="h-64 sm:h-72 w-full bg-[#070A17]/80 rounded-2xl p-4 border border-[rgba(243,241,234,0.06)]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(243,241,234,0.05)" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: '#98A1BC', fontSize: 10, fontFamily: 'monospace' }}
                    tickFormatter={(val) => `${val}%`}
                    axisLine={{ stroke: 'rgba(243,241,234,0.1)' }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortName"
                    tick={{ fill: '#F3F1EA', fontSize: 11, fontWeight: 500 }}
                    width={130}
                    axisLine={{ stroke: 'rgba(243,241,234,0.1)' }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(243,241,234,0.03)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#0C1226] border border-[#19D3F3]/40 rounded-xl p-3.5 shadow-2xl text-xs space-y-1.5 z-50">
                            <div className="flex items-center justify-between gap-4">
                              <span className="font-mono text-[10px] text-[#F6C453] font-bold">
                                #{data.id}
                              </span>
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                                style={{ backgroundColor: `${data.color}22`, color: data.color }}
                              >
                                {data.statusLabel}
                              </span>
                            </div>
                            <div className="font-bold text-[#F3F1EA] max-w-xs">{data.fullName}</div>
                            <div className="text-[11px] text-[#98A1BC]">
                              Plano: <span className="text-[#F3F1EA]">{data.tierName}</span>
                            </div>
                            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-4">
                              <span className="text-[#98A1BC]">Progresso:</span>
                              <span className="font-mono font-bold text-[#19D3F3]">
                                {data.progress}% Concluído
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-[11px]">
                              <span className="text-[#98A1BC]">Prazo total SLA:</span>
                              <span className="font-mono text-[#F3F1EA]">
                                {data.deliveryDays} dias úteis
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    x={75}
                    stroke="#FF2E93"
                    strokeDasharray="3 3"
                    strokeOpacity={0.4}
                    label={{
                      value: 'Curadoria (75%)',
                      fill: '#FF2E93',
                      fontSize: 9,
                      position: 'insideTopRight',
                    }}
                  />
                  <Bar
                    dataKey="progress"
                    radius={[0, 8, 8, 0]}
                    onClick={(entry: any) => setSelectedBarId(entry?.id || null)}
                    className="cursor-pointer"
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={`cell-${entry.id}`}
                        fill={entry.color}
                        stroke={selectedBarId === entry.id ? '#FFFFFF' : 'none'}
                        strokeWidth={2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Timeline Phases legend bar */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-[#070A17]/70 border border-yellow-500/20 text-center">
                <span className="text-[10px] font-mono text-yellow-400 font-bold block">1. Briefing</span>
                <span className="text-[11px] text-[#98A1BC]">25% alinhamento</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#070A17]/70 border border-cyan-500/20 text-center">
                <span className="text-[10px] font-mono text-[#19D3F3] font-bold block">2. Produção</span>
                <span className="text-[11px] text-[#98A1BC]">50% geração IA</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#070A17]/70 border border-pink-500/20 text-center">
                <span className="text-[10px] font-mono text-[#FF2E93] font-bold block">3. Curadoria</span>
                <span className="text-[11px] text-[#98A1BC]">75% refino humano</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#070A17]/70 border border-emerald-500/20 text-center">
                <span className="text-[10px] font-mono text-emerald-400 font-bold block">4. Entrega</span>
                <span className="text-[11px] text-[#98A1BC]">100% homologado</span>
              </div>
            </div>
          </div>

          {/* Right Column: Campaign Inspector & Health */}
          <div className="lg:col-span-4 space-y-4">
            {/* Average completion health card */}
            <div className="bg-[#070A17] p-5 rounded-2xl border border-[rgba(243,241,234,0.08)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#98A1BC] tracking-wider block">
                  VELOCIDADE MÉDIA
                </span>
                <div className="font-heading text-3xl font-extrabold text-[#F3F1EA] mt-0.5">
                  {averageProgress}%
                </div>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Esteira em ritmo nominal
                </span>
              </div>

              {/* Circular gauge representation */}
              <div className="w-16 h-16 rounded-full border-4 border-[#19D3F3]/20 flex items-center justify-center relative">
                <div
                  className="absolute inset-0 rounded-full border-4 border-[#19D3F3] border-t-transparent animate-spin-slow"
                  style={{ transform: `rotate(${(averageProgress / 100) * 360}deg)` }}
                />
                <span className="font-mono text-xs font-bold text-[#F3F1EA]">{averageProgress}%</span>
              </div>
            </div>

            {/* Selected Campaign Detailed Card */}
            {activeFocusCampaign && (
              <div className="bg-[#070A17] p-5 rounded-2xl border border-[rgba(243,241,234,0.12)] space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#F6C453] font-bold">
                    DESTAQUE: #{activeFocusCampaign.id}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase"
                    style={{
                      backgroundColor: `${activeFocusCampaign.color}15`,
                      color: activeFocusCampaign.color,
                      borderColor: `${activeFocusCampaign.color}35`,
                    }}
                  >
                    {activeFocusCampaign.statusLabel}
                  </span>
                </div>

                <div>
                  <h4 className="font-heading text-base font-bold text-[#F3F1EA] line-clamp-2">
                    {activeFocusCampaign.fullName}
                  </h4>
                  <p className="text-xs text-[#98A1BC] mt-0.5">
                    Nível: <span className="text-[#F3F1EA] font-semibold">{activeFocusCampaign.tierName}</span>
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#98A1BC]">Conclusão:</span>
                    <span className="font-bold" style={{ color: activeFocusCampaign.color }}>
                      {activeFocusCampaign.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${activeFocusCampaign.progress}%`,
                        backgroundColor: activeFocusCampaign.color,
                      }}
                    />
                  </div>
                </div>

                {/* Timeline Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5">
                  <div className="bg-white/5 p-2.5 rounded-xl">
                    <span className="text-[10px] text-[#98A1BC] font-mono block">PRAZO SLA</span>
                    <strong className="text-[#F3F1EA] font-heading">
                      {activeFocusCampaign.deliveryDays} dias úteis
                    </strong>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl">
                    <span className="text-[10px] text-[#98A1BC] font-mono block">DIAS CORRIDOS</span>
                    <strong className="text-[#19D3F3] font-heading">
                      {activeFocusCampaign.elapsedDays} dia(s)
                    </strong>
                  </div>
                </div>

                {/* CTA to inspect portal */}
                {onSelectOrder && (
                  <button
                    type="button"
                    onClick={() => onSelectOrder(activeFocusCampaign.id)}
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-[#F3F1EA] transition-all flex items-center justify-center gap-1.5 border border-white/10"
                  >
                    <span>Abrir Dossiê & Entregáveis</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#19D3F3]" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
