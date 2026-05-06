// Tipos que reflejan exactamente la estructura de metrics.json
export type Direction = 'higher_is_better' | 'lower_is_better';
export type DatasetId = 'A' | 'B' | 'C' | 'D';
export type DateRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

export interface MetricMeta {
  key: string;
  label: string;
  unit: string;
  direction: Direction;
  description: string;
}

export interface DayRecord {
  date: string;
  metrics: Record<string, number | null>;
}

export interface DatasetMetadata {
  start_date: string;
  end_date: string;
  days: number;
  metrics: MetricMeta[];
}

export interface Dataset {
  metadata: DatasetMetadata;
  days: DayRecord[];
}

export type MetricsFile = Record<DatasetId, Dataset>;
