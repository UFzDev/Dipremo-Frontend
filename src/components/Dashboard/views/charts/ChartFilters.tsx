/**
 * ChartFilters — Componente universal de toggles (pills) para gráficas multieje.
 * Abstrae el patrón visual de FFTChart para reutilización en todas las gráficas.
 */

export type AxisConfig = {
  key: string;
  label: string;
  color: string;
  bgActive: string;
  bgInactive: string;
};

// Conjuntos de ejes listos para importar
export const TRIAXIAL_AXES: AxisConfig[] = [
  { key: 'x',   label: 'Eje X',       color: '#ef4444', bgActive: '#fee2e2', bgInactive: '#f1f5f9' },
  { key: 'y',   label: 'Eje Y',       color: '#10b981', bgActive: '#d1fae5', bgInactive: '#f1f5f9' },
  { key: 'z',   label: 'Eje Z',       color: '#3b82f6', bgActive: '#dbeafe', bgInactive: '#f1f5f9' },
];

export const TRIAXIAL_WITH_RES: AxisConfig[] = [
  ...TRIAXIAL_AXES,
  { key: 'res', label: 'Resultante', color: '#8b5cf6', bgActive: '#ede9fe', bgInactive: '#f1f5f9' },
];

type ChartFiltersProps = {
  axes: AxisConfig[];
  activeKeys: Set<string>;
  onToggle: (key: string) => void;
};

function ChartFilters({ axes, activeKeys, onToggle }: ChartFiltersProps) {
  return (
    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
      {axes.map(axis => {
        const isActive = activeKeys.has(axis.key);
        return (
          <button
            key={axis.key}
            onClick={() => onToggle(axis.key)}
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s',
              background: isActive ? axis.bgActive : axis.bgInactive,
              color: isActive ? axis.color : '#94a3b8',
            }}
          >
            {axis.label}
          </button>
        );
      })}
    </div>
  );
}

export default ChartFilters;
