import { useState } from 'react';
import { Trophy, Target, Clock, LifeBuoy } from 'lucide-react';
import { Header } from './components/Header';
import { KpiCard } from './components/KpiCard';
import type { KpiAccent } from './components/KpiCard';
import { Funnel } from './components/Funnel';
import { MetricChart } from './components/MetricChart';
import { SkeletonCard, SkeletonChart, SkeletonFunnel } from './components/Skeletons';
import { useDashboard } from './hooks/useDashboard';
import { translateMetric } from './lib/translations';
import type { DatasetId, DateRange } from './types';

// ── Las 4 KPIs hero que el Jefe de Ventas necesita ver primero ────────────────
const KPI_CONFIG = [
  {
    key:             'deals_won',
    label:           'Cierres Exitosos',
    subtitle:        'Oportunidades ganadas en el período',
    unit:            'deals',
    higherIsBetter:  true,
    accent:          'green' as KpiAccent,
    icon:            <Trophy className="w-5 h-5" />,
  },
  {
    key:             '__win_rate__',
    label:           'Tasa de Cierre',
    subtitle:        'Ganados sobre total de oportunidades cerradas',
    unit:            'rate',
    higherIsBetter:  true,
    accent:          'blue' as KpiAccent,
    icon:            <Target className="w-5 h-5" />,
  },
  {
    key:             'avg_response_time_min',
    label:           'Tiempo de Respuesta',
    subtitle:        'Minutos hasta primer contacto con el prospecto',
    unit:            'min',
    higherIsBetter:  false,
    accent:          'orange' as KpiAccent,
    icon:            <Clock className="w-5 h-5" />,
  },
  {
    key:             'support_tickets_opened',
    label:           'Tickets de Soporte',
    subtitle:        'Nuevos casos abiertos en el período',
    unit:            'tickets',
    higherIsBetter:  false,
    accent:          'rose' as KpiAccent,
    icon:            <LifeBuoy className="w-5 h-5" />,
  },
] as const;

// ── Métricas secundarias con gráficos de tendencia ───────────────────────────
const CHART_METRICS = [
  'traffic',
  'leads_created',
  'leads_qualified',
  'deals_created',
  'avg_deal_cycle_days',
  'stale_deals',
  'support_avg_resolution_hours',
];

export default function App() {
  const [datasetId, setDatasetId] = useState<DatasetId>('A');
  const [dateRange, setDateRange] = useState<DateRange>('1D');

  const { loading, error, data } = useDashboard(datasetId, dateRange);

  function getKpiValue(key: string, period: 'current' | 'previous'): number {
    if (!data) return 0;
    const src = data[period];
    if (key === '__win_rate__') return src.winRate;
    if (src.averages[key] !== undefined) return src.averages[key];
    return src.totals[key] ?? 0;
  }

  function getChartData(key: string) {
    if (!data) return [];
    return data.current.chartData.map((d) => ({
      date:  d.date as string,
      value: d[key] as number | null,
    }));
  }

  function getMeta(key: string) {
    return data?.meta.metrics.find((m) => m.key === key);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        datasetId={datasetId}
        dateRange={dateRange}
        onDatasetChange={setDatasetId}
        onRangeChange={setDateRange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {error && (
          <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 text-rose-800 text-sm font-semibold">
            ⚠️ Error al cargar métricas: {error}
          </div>
        )}

        {/* ── 4 KPIs Hero ─────────────────────────────────────────────── */}
        <section aria-label="KPIs principales">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-500 mb-4">
            Indicadores Clave
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading
              ? KPI_CONFIG.map((k) => <SkeletonCard key={k.key} />)
              : KPI_CONFIG.map((k) => (
                  <div key={k.key} className="animate-in">
                    <KpiCard
                      title={k.label}
                      subtitle={k.subtitle}
                      value={getKpiValue(k.key, 'current')}
                      previousValue={getKpiValue(k.key, 'previous')}
                      unit={k.unit}
                      higherIsBetter={k.higherIsBetter}
                      accent={k.accent}
                      icon={k.icon}
                    />
                  </div>
                ))}
          </div>
        </section>

        {/* ── Funnel ──────────────────────────────────────────────────── */}
        <section aria-label="Embudo de conversión">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-500 mb-4">
            Tasas de Conversión
          </h2>
          {loading ? (
            <SkeletonFunnel />
          ) : (
            <div className="animate-in">
              <Funnel
                traffic={data?.current.totals['traffic'] ?? 0}
                leads={data?.current.totals['leads_created'] ?? 0}
                qualified={data?.current.totals['leads_qualified'] ?? 0}
                deals={data?.current.totals['deals_created'] ?? 0}
                won={data?.current.totals['deals_won'] ?? 0}
              />
            </div>
          )}
        </section>

        {/* ── Gráficos de tendencia ────────────────────────────────────── */}
        <section aria-label="Tendencias métricas">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-500 mb-4">
            Tendencias del Período
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading
              ? CHART_METRICS.map((k) => <SkeletonChart key={k} />)
              : CHART_METRICS.map((key) => {
                  const meta = getMeta(key);
                  if (!meta) return null;
                  return (
                    <div key={key} className="animate-in">
                      <MetricChart
                        metricKey={key}
                        title={translateMetric(key, meta.label)}
                        unit={meta.unit}
                        direction={meta.direction}
                        data={getChartData(key)}
                      />
                    </div>
                  );
                })}
          </div>
        </section>

        <footer className="text-center text-xs font-medium text-gray-400 pb-4">
          Palvi · Reporte Ejecutivo · {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}
