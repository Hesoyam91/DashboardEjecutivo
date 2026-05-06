import { useState, useEffect, useMemo } from 'react';
import type { MetricsFile, DatasetId, DateRange, DayRecord } from '../types';
import { rangeToDays } from '../lib/utils';

// ── ETL: Sanitiza un día — reemplaza null por null (lo dejamos pasar) ──────────
// La decisión consciente: NO imputamos 0 para los promedios (avg_*) porque
// null en avg_response_time_min significa "no hubo leads ese día", no "0 minutos".
// Para sumas (traffic, deals, etc.) null lo tratamos como 0 en el agregado.

function isSumMetric(key: string): boolean {
  return !key.startsWith('avg_') && !key.startsWith('support_avg');
}

interface AggregatedMetrics {
  totals: Record<string, number>;
  averages: Record<string, number>;
  winRate: number;
  chartData: { date: string; [key: string]: number | string | null }[];
}

function aggregate(days: DayRecord[]): AggregatedMetrics {
  const sums: Record<string, number> = {};
  const sumCounts: Record<string, number> = {};

  const chartData = days.map((day) => {
    const row: { date: string; [key: string]: number | string | null } = {
      date: day.date,
    };
    Object.entries(day.metrics).forEach(([key, val]) => {
      // Punto de entrada del ETL: sanitizamos null
      const sanitized = val === null ? null : Number(val);
      row[key] = sanitized;

      if (sanitized !== null) {
        if (isSumMetric(key)) {
          // Métricas de conteo: acumular suma
          sums[key] = (sums[key] ?? 0) + sanitized;
        } else {
          // Métricas de promedio: solo contar días con dato real
          sums[key] = (sums[key] ?? 0) + sanitized;
          sumCounts[key] = (sumCounts[key] ?? 0) + 1;
        }
      }
    });
    return row;
  });

  // Construir totals y averages
  const totals: Record<string, number> = {};
  const averages: Record<string, number> = {};

  Object.keys(sums).forEach((key) => {
    if (isSumMetric(key)) {
      totals[key] = sums[key] ?? 0;
    } else {
      const count = sumCounts[key] ?? 0;
      averages[key] = count > 0 ? sums[key] / count : 0;
    }
  });

  // Win Rate: métrica calculada de período
  const won = totals['deals_won'] ?? 0;
  const lost = totals['deals_lost'] ?? 0;
  const winRate = won + lost > 0 ? won / (won + lost) : 0;

  return { totals, averages, winRate, chartData };
}

// ── Hook principal ──────────────────────────────────────────────────────────────
export function useDashboard(datasetId: DatasetId, range: DateRange) {
  const [rawData, setRawData] = useState<MetricsFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simula carga asíncrona como si fuera un API call real
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        // Latencia simulada para que la UX de carga sea visible
        await new Promise((r) => setTimeout(r, 700));
        const res = await fetch('/metrics.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: MetricsFile = await res.json();
        if (!cancelled) setRawData(json);
      } catch (e) {
        if (!cancelled) setError(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []); // Solo carga el archivo 1 vez — el slice lo hacemos en useMemo

  // Datos procesados según dataset y rango de fechas
  const processed = useMemo(() => {
    if (!rawData || !rawData[datasetId]) return null;

    const dataset = rawData[datasetId];
    const nDays = rangeToDays(range);
    const allDays = dataset.days;

    // Slice del período actual y del anterior (para comparar tendencia)
    const currentDays = allDays.slice(-nDays);
    const previousDays = allDays.slice(-nDays * 2, -nDays);

    return {
      meta: dataset.metadata,
      current: aggregate(currentDays),
      previous: aggregate(previousDays),
    };
  }, [rawData, datasetId, range]);

  return { loading, error, data: processed };
}
