// Mapa centralizado de traducciones para métricas del JSON.
// Usamos este mapa en lugar del `label` que viene del JSON (que está en inglés).
// La clave es el `key` de la métrica; el valor es el label en español.

export const METRIC_LABELS: Record<string, string> = {
  traffic:                      'Visitas al Sitio',
  leads_created:                'Nuevos Prospectos',
  leads_qualified:              'Prospectos Calificados',
  deals_created:                'Oportunidades Abiertas',
  deals_won:                    'Cierres Exitosos',
  deals_lost:                   'Oportunidades Perdidas',
  avg_response_time_min:        'Tiempo de Respuesta',
  avg_deal_cycle_days:          'Ciclo de Venta',
  stale_deals:                  'Oportunidades Estancadas',
  support_tickets_opened:       'Tickets de Soporte',
  support_avg_resolution_hours: 'Tiempo de Resolución',
};

// Unidades en español
export const UNIT_LABELS: Record<string, string> = {
  visits:   'visitas',
  leads:    'prospectos',
  min:      'min',
  minutes:  'min',
  days:     'días',
  hours:    'hs',
  hrs:      'hs',
  tickets:  'tickets',
  deals:    'cierres',
  rate:     '%',
  '%':      '%',
};

// Traduce la unidad que viene del JSON a español
export function translateUnit(unit: string): string {
  return UNIT_LABELS[unit] ?? unit;
}

// Obtiene el label traducido; si no hay traducción, devuelve el original
export function translateMetric(key: string, fallback: string): string {
  return METRIC_LABELS[key] ?? fallback;
}
