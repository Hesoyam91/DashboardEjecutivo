# Dashboard Ejecutivo — Palvi

## Cómo correrlo localmente

```bash
git clone <repo>
cd dashboard
npm install
cp ../metrics.json public/metrics.json   # o donde esté el archivo
npm run dev
# → http://localhost:3333
```

---

## Decisiones técnicas

### Stack

- **Vite + React + TypeScript** — Next.js hubiera añadido Server/Client Components sin ningún beneficio real para un dashboard que lee un archivo JSON estático.
- **Tailwind CSS** — Iteración de UI rápida sin CSS custom. Para un entregable acotado prioriza velocidad sobre convención.
- **Recharts** — API declarativa, integración natural con React, suficiente para las visualizaciones requeridas.
- **Sin state manager global** — El único estado compartido es `datasetId` y `dateRange`. Se maneja con `useState` en el componente raíz y se pasa por props. Un state manager hubiera sido demasiado para un entregable acotado.

### ETL y manejo de nulos

Los datos pasan por una capa de transformación en `src/hooks/useDashboard.ts` antes de llegar a cualquier componente. La decisión central:

- **Métricas de conteo** (`traffic`, `leads_created`, `deals_won`, etc.): `null` → `0`. Un día sin registros es un día con cero eventos.
- **Métricas de promedio** (`avg_response_time_min`, `avg_deal_cycle_days`, `support_avg_resolution_hours`): `null` → _se excluye del cálculo_. Un día sin leads no tiene tiempo de respuesta — así se evita distorsionar el promedio.

Esta distinción está documentada en el código con un comentario explícito.

### Carga asíncrona simulada

El fetch de `metrics.json` incluye un `setTimeout(700ms)` antes de resolver, más estados de `loading` con skeletons. La razón: en producción esto sería un endpoint real. Diseñar el componente para manejar latencia desde el inicio evita tener que refactorizar después.

### Indicadores de rendimiento (verde/rojo)

El campo `direction` del JSON (`higher_is_better` / `lower_is_better`) controla el color de las tendencias. No está hardcodeado por métrica. Si el backend agrega una nueva métrica con su `direction`, el frontend la renderiza correctamente sin ningún cambio de código.

### Rango de fechas

Por defecto se muestra `1D` (el último día del dataset). La decisión: el Jefe de Ventas llega a las 8am a ver qué pasó ayer, no a analizar tendencias de 6 meses. Los rangos más amplios están disponibles pero no son la vista por defecto.

### Win Rate

Se calcula como `sum(deals_won) / sum(deals_won + deals_lost)` sobre el período seleccionado, no por cohorte. Es una métrica de cierre del período, no de seguimiento de oportunidades.

---

## Segunda iteración

**Selector de fechas (Date Picker) personalizado.** Hoy el rango de fechas usa el final del array como "hoy". En producción el usuario debería poder definir un rango arbitrario (ej. "del 1 al 15 de marzo"). Lo dejé fuera porque implementarlo bien requiere una librería de calendario y lógica de validación que excedía el tiempo disponible.

**Tests de las funciones de agregación.** La lógica de ETL en `useDashboard.ts` (especialmente el tratamiento diferenciado de nulos) debería tener tests unitarios con Jest o Vitest.
