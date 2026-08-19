import { type ReactNode } from 'react';

type BaseChartProps = {
  points: string;
  color: string;
  label: string;
  valueDisplay: ReactNode;
  footerDisplay?: ReactNode;
  width?: number;
  height?: number;
  children?: ReactNode;
};

function BaseChart({ 
  points, 
  color, 
  label, 
  valueDisplay, 
  footerDisplay,
  width = 800,
  height = 120,
  children
}: BaseChartProps) {
  return (
    <div className="base-chart" style={{ 
      background: '#ffffff', 
      padding: '0.75rem', 
      borderRadius: '8px', 
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    }}>
      {/* Header del Gráfico */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
        <h4 style={{ 
          color: '#94a3b8', 
          fontSize: '9px', 
          fontWeight: 900, 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em', 
          margin: 0 
        }}>
          {label}
        </h4>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: '#1e293b' }}>
          {valueDisplay}
        </div>
      </div>

      {/* Área de dibujo SVG */}
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        style={{ width: '100%', height: `${height}px`, overflow: 'visible' }}
        preserveAspectRatio="none"
      >
        {/* Rejilla de Fondo (Grids) */}
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#f1f5f9" strokeWidth="1.5" />
        <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="#f1f5f9" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="#f1f5f9" strokeWidth="1" strokeOpacity="0.5" />

        {/* Polilínea de Señal */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
          style={{ transition: 'points 0.1s linear' }}
        />

        {/* Capas Adicionales (Umbrales, Zonas de Operación, etc.) */}
        {children}
      </svg>

      {/* Footer / Labels de Ejes */}
      {footerDisplay && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          {footerDisplay}
        </div>
      )}
    </div>
  );
}

export default BaseChart;
