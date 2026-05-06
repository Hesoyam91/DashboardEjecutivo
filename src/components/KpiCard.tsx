import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatValue, formatPercent, getTrend } from '../lib/utils';

// Acento de color por tarjeta — inspirado en PlanMate
export type KpiAccent = 'blue' | 'green' | 'orange' | 'rose';

const ACCENT_STYLES: Record<KpiAccent, { icon: string; badge: string; badgeGood: string; badgeBad: string }> = {
  blue:   { icon: 'bg-blue-100 text-blue-600',   badge: 'border border-gray-200 text-gray-700', badgeGood: 'bg-emerald-50 border border-emerald-300 text-emerald-700', badgeBad: 'bg-rose-50 border border-rose-300 text-rose-700' },
  green:  { icon: 'bg-emerald-100 text-emerald-600', badge: 'border border-gray-200 text-gray-700', badgeGood: 'bg-emerald-50 border border-emerald-300 text-emerald-700', badgeBad: 'bg-rose-50 border border-rose-300 text-rose-700' },
  orange: { icon: 'bg-orange-100 text-orange-600', badge: 'border border-gray-200 text-gray-700', badgeGood: 'bg-emerald-50 border border-emerald-300 text-emerald-700', badgeBad: 'bg-rose-50 border border-rose-300 text-rose-700' },
  rose:   { icon: 'bg-rose-100 text-rose-600',   badge: 'border border-gray-200 text-gray-700', badgeGood: 'bg-emerald-50 border border-emerald-300 text-emerald-700', badgeBad: 'bg-rose-50 border border-rose-300 text-rose-700' },
};

interface KpiCardProps {
  title: string;
  subtitle?: string;
  value: number | null;
  previousValue: number | null;
  unit: string;
  higherIsBetter: boolean;
  accent?: KpiAccent;
  icon: React.ReactNode;
}

export function KpiCard({
  title,
  subtitle,
  value,
  previousValue,
  unit,
  higherIsBetter,
  accent = 'blue',
  icon,
}: KpiCardProps) {
  const { delta, isGood, hasData } = getTrend(value, previousValue, higherIsBetter);
  const styles = ACCENT_STYLES[accent];

  const badgeClass = !hasData
    ? styles.badge
    : isGood
    ? styles.badgeGood
    : styles.badgeBad;

  const TrendIcon = !hasData || delta === 0 ? Minus : delta > 0 ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
      {/* Header de la card */}
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${styles.icon}`}>
          {icon}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${
          hasData
            ? isGood
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'
            : 'bg-gray-100 text-gray-500'
        }`}>
        {hasData ? (isGood ? '▲ POSITIVO' : '▼ ATENCIÓN') : 'SIN DATOS'}
        </span>
      </div>

      {/* Valor principal */}
      <div>
        <p className="text-3xl font-extrabold text-gray-900 leading-none">
          {formatValue(value, unit)}
        </p>
        <p className="text-sm font-semibold text-gray-800 mt-1.5">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Badge de tendencia */}
      <div className={`inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
        <TrendIcon className="w-3.5 h-3.5" />
        {hasData
          ? <><span>{formatPercent(delta)}</span><span className="font-normal text-gray-500">vs período ant.</span></>
          : <span>Sin período anterior</span>
        }
      </div>
    </div>
  );
}
