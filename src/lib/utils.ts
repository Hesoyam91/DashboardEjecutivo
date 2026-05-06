// Formateador de valores según el tipo de métrica
export function formatValue(value: number | null, unit: string, direction?: string): string {
  if (value === null || value === undefined || isNaN(value)) return '—';
  
  if (unit === 'rate' || unit === '%') {
    return new Intl.NumberFormat('es-AR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }
  if (unit === 'min' || unit === 'minutes') {
    return `${value.toFixed(1)} min`;
  }
  if (unit === 'hours' || unit === 'hrs') {
    return `${value.toFixed(1)} h`;
  }
  if (unit === 'days') {
    return `${value.toFixed(1)} d`;
  }
  return new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value);
}

// Formatea el % de cambio para mostrar en KPI cards
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: 'always',
  }).format(value);
}

// Decide si la variación es "buena" (verde) o "mala" (roja) según direction
export function getTrend(current: number | null, previous: number | null, higherIsBetter: boolean) {
  if (current === null || previous === null || previous === 0) {
    return { delta: 0, isGood: true, hasData: false };
  }
  const delta = (current - previous) / Math.abs(previous);
  const isGood = higherIsBetter ? delta >= 0 : delta <= 0;
  return { delta, isGood, hasData: true };
}

// Convierte DateRange a cantidad de días
export function rangeToDays(range: string): number {
  const map: Record<string, number> = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
  };
  return map[range] ?? 30;
}
