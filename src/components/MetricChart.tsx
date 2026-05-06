import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { formatValue } from '../lib/utils';
import type { Direction } from '../types';

// Paleta de colores vivos — sin grises
const CHART_COLORS: Record<string, string> = {
  traffic:                     '#6366f1', // índigo
  leads_created:               '#3b82f6', // azul
  leads_qualified:             '#0ea5e9', // sky
  deals_created:               '#10b981', // esmeralda
  avg_deal_cycle_days:         '#f59e0b', // ámbar
  stale_deals:                 '#ef4444', // rojo
  support_avg_resolution_hours:'#8b5cf6', // violeta
  deals_won:                   '#22c55e', // verde
  deals_lost:                  '#f43f5e', // rosa
  avg_response_time_min:       '#f97316', // naranja
  support_tickets_opened:      '#ec4899', // pink
};

function getColor(key: string, direction: Direction): string {
  if (CHART_COLORS[key]) return CHART_COLORS[key];
  return direction === 'higher_is_better' ? '#6366f1' : '#ef4444';
}

// Tooltip personalizado
function CustomTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-3 text-sm">
      <p className="font-bold text-gray-900">{formatValue(val, unit)}</p>
      <p className="text-gray-600 text-xs mt-0.5">{label}</p>
    </div>
  );
}

interface MetricChartProps {
  metricKey?: string;
  title: string;
  unit: string;
  direction: Direction;
  data: { date: string; value: number | null }[];
}

export function MetricChart({ metricKey = '', title, unit, direction, data }: MetricChartProps) {
  const color = getColor(metricKey, direction);

  const chartData = data.map((d) => ({
    date: d.date.slice(5), // "MM-DD"
    value: d.value,
  }));

  // Promedio para la línea de referencia
  const validValues = chartData.filter((d) => d.value !== null).map((d) => d.value as number);
  const avg = validValues.length > 0
    ? validValues.reduce((a, b) => a + b, 0) / validValues.length
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${color}18`, color }}
        >
          {direction === 'higher_is_better' ? '↑ más es mejor' : '↓ menos es mejor'}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={130}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#374151', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />

          <YAxis
            tick={{ fontSize: 10, fill: '#374151', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            width={32}
            tickFormatter={(v) => {
              if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
              return String(Math.round(v));
            }}
          />

          <Tooltip content={<CustomTooltip unit={unit} />} />

          {avg !== null && (
            <ReferenceLine
              y={avg}
              stroke={color}
              strokeDasharray="4 3"
              strokeOpacity={0.5}
              strokeWidth={1.5}
            />
          )}

          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#grad-${metricKey})`}
            dot={false}
            connectNulls={false}
            activeDot={{ r: 5, fill: color, strokeWidth: 2, stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
