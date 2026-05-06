// Colores vivos por etapa del funnel
const STEP_CONFIG = [
  { label: 'Visitas',       color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
  { label: 'Prospectos',    color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  { label: 'Calificados',   color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd' },
  { label: 'Oportunidades', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
  { label: 'Cierres',       color: '#22c55e', bg: '#f0fdf4', border: '#86efac' },
];

interface FunnelProps {
  traffic: number;
  leads: number;
  qualified: number;
  deals: number;
  won: number;
}

const fmt = (n: number) => new Intl.NumberFormat('es-AR').format(Math.round(n));
const pct = (a: number, b: number) =>
  b > 0
    ? new Intl.NumberFormat('es-AR', { style: 'percent', minimumFractionDigits: 1 }).format(a / b)
    : '—';

export function Funnel({ traffic, leads, qualified, deals, won }: FunnelProps) {
  const values = [traffic, leads, qualified, deals, won];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* Encabezado */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-900">Embudo de Conversión</h2>
        <p className="text-xs font-medium text-gray-600 mt-0.5">
          Tasas de conversión entre cada etapa · período seleccionado
        </p>
      </div>

      {/* Pasos */}
      <div className="flex flex-col md:flex-row gap-2 items-stretch">
        {STEP_CONFIG.map((step, idx) => {
          const value = values[idx];
          const prev  = values[idx - 1] ?? 0;
          const rate  = idx > 0 ? pct(value, prev) : null;
          const isLast = idx === STEP_CONFIG.length - 1;

          return (
            <div key={step.label} className="flex flex-col md:flex-row items-center flex-1 min-w-0">
              {/* Flecha de conversión ANTES del paso (excepto el primero) */}
              {idx > 0 && (
                <div className="flex flex-col items-center px-1 shrink-0">
                  <div
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 whitespace-nowrap"
                    style={{ background: `${step.color}18`, color: step.color }}
                  >
                    {rate}
                  </div>
                  <svg className="hidden md:block text-gray-300 w-5 h-5" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Card del paso */}
              <div
                className="w-full rounded-2xl border p-4 text-center transition-all hover:shadow-md flex-1"
                style={{ background: step.bg, borderColor: step.border }}
              >
                <div
                  className="text-[10px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: step.color }}
                >
                  {step.label}
                </div>
                <div className="text-2xl font-extrabold text-gray-900">
                  {fmt(value)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
