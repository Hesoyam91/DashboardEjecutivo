import { LayoutDashboard, ChevronDown } from 'lucide-react';
import type { DatasetId, DateRange } from '../types';

const DATE_RANGES: DateRange[] = ['1D', '1W', '1M', '3M', '6M', '1Y'];

const DATASET_LABELS: Record<DatasetId, string> = {
  A: 'Dataset A',
  B: 'Dataset B',
  C: 'Dataset C',
  D: 'Dataset D',
};

interface HeaderProps {
  datasetId: DatasetId;
  dateRange: DateRange;
  onDatasetChange: (id: DatasetId) => void;
  onRangeChange:   (range: DateRange) => void;
}

export function Header({ datasetId, dateRange, onDatasetChange, onRangeChange }: HeaderProps) {
  // Saludo dinámico según la hora local
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barra superior */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2 rounded-xl bg-gray-900">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-extrabold text-gray-900 tracking-tight">
              Palvi <span className="text-gray-400 font-medium">· Dashboard</span>
            </span>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-3 flex-wrap justify-end">
            {/* Selector de dataset */}
            <div className="relative">
              <select
                id="dataset-select"
                value={datasetId}
                onChange={(e) => onDatasetChange(e.target.value as DatasetId)}
                className="appearance-none pl-3 pr-8 py-2 text-sm font-bold bg-gray-100 border border-gray-300 rounded-xl text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900 hover:bg-gray-200 transition-colors"
              >
                {(Object.keys(DATASET_LABELS) as DatasetId[]).map((id) => (
                  <option key={id} value={id}>
                    {DATASET_LABELS[id]}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 pointer-events-none" />
            </div>

            {/* Toggle de rango */}
            <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-200 gap-0.5">
              {DATE_RANGES.map((r) => (
                <button
                  key={r}
                  id={`range-${r}`}
                  onClick={() => onRangeChange(r)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 ${
                    dateRange === r
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Saludo ejecutivo — inspirado en PlanMate */}
        <div className="py-4 border-t border-gray-100">
          <h1 className="text-2xl font-extrabold text-gray-900">
            {greeting}, Jefe de Ventas 👋
          </h1>
          <p className="text-sm font-medium text-gray-600 mt-0.5">
            Estas son las métricas del equipo. Identifica dónde poner foco hoy.
          </p>
        </div>
      </div>
    </header>
  );
}
