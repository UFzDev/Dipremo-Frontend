import { type SkewnessData } from '../../../../lib/algorithms/SkewnessEngine';

type SkewnessChartProps = {
  data: SkewnessData | null;
};

// Limites Absolutos Propuestos:
// Sano: |S| < 0.5
// Alerta (Posible holgura ligera): |S| > 0.5 y < 1.0
// Peligro (Daño direccional marcado/Tornillo roto): |S| > 1.0
function getSkewnessSeverity(val: number) {
  const abs = Math.abs(val);
  if (abs < 0.5) return { color: '#10b981', label: 'SIMÉTRICO (Sano)' };
  if (abs < 1.0) return { color: '#f59e0b', label: 'DESVIADO (Revisar Holgura)' };
  return { color: '#ef4444', label: 'UNIDIRECCIONAL (Daño/Suelto)' };
}

function CompassBar({ value, axisLabel }: { value: number; axisLabel: string }) {
  const status = getSkewnessSeverity(value);
  
  // Escala visual de -2.0 a +2.0
  const MAX_SCALE = 2.0;
  // Convertimos el valor matemático a porcentaje visual (donde 0 matemático es 50% visual)
  let visualPercent = 50 + (value / MAX_SCALE) * 50;
  // Clampeamos para que no se desborde del div
  visualPercent = Math.max(0, Math.min(100, visualPercent));

  // Determinar desde el centro (50%) hacia donde pintar la barra y qué tan ancha será
  const isPositive = value >= 0;
  const leftPos = isPositive ? 50 : visualPercent;
  const width = isPositive ? (visualPercent - 50) : (50 - visualPercent);

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '13px', fontWeight: 800 }}>
         <span>Eje {axisLabel} <span style={{ color: '#94a3b8', fontSize: '11px', marginLeft: '4px' }}>(S={value.toFixed(2)})</span></span>
         <span style={{ color: status.color, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px' }}>{status.label}</span>
      </div>
      
      {/* Marco de la barra con separador central */}
      <div style={{ position: 'relative', height: '14px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
         <div style={{
             position: 'absolute',
             top: 0,
             bottom: 0,
             left: `${leftPos}%`,
             width: `${width}%`,
             background: status.color,
             transition: 'left 0.4s ease-out, width 0.4s ease-out, background-color 0.4s ease-out'
         }}></div>
         
         {/* Línea Cero Central */}
         <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', background: '#1e293b' }}></div>

         {/* Marcas de umbral (Alerta +- 0.5) */}
         <div style={{ position: 'absolute', top: 0, bottom: 0, left: '62.5%', width: '1px', background: '#cbd5e1' }}></div>
         <div style={{ position: 'absolute', top: 0, bottom: 0, left: '37.5%', width: '1px', background: '#cbd5e1' }}></div>

         {/* Marcas de umbral (Peligro +- 1.0) */}
         <div style={{ position: 'absolute', top: 0, bottom: 0, left: '75%', width: '1px', background: '#fca5a5' }}></div>
         <div style={{ position: 'absolute', top: 0, bottom: 0, left: '25%', width: '1px', background: '#fca5a5' }}></div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>
         <span>-2.0 (Negativo)</span>
         <span>0.0</span>
         <span>+2.0 (Positivo)</span>
      </div>
    </div>
  );
}

function SkewnessChart({ data }: SkewnessChartProps) {
  if (!data) {
    return (
      <div style={{ height: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>
            <line x1="12" y1="2" x2="12" y2="22"></line>
            <polyline points="17 5 12 2 7 5"></polyline>
            <polyline points="7 19 12 22 17 19"></polyline>
         </svg>
         Capturando 3er Momento Estadístico (Asimetría)...
         <style>{`@keyframes spin { 100% { transform: rotate(180deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="skewness-chart-card" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
           </svg>
           Holguras / Anclaje (Skewness)
        </h4>
        <p style={{ margin: '0.25rem 0 0', fontSize: '11px', color: '#64748b' }}>
          Mide impactos asimétricos y aflojamientos. Límite Sano: Abs(S) {'<'} 0.5
        </p>
      </header>

      <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
         <CompassBar value={data.skewnessX} axisLabel="X" />
         <CompassBar value={data.skewnessY} axisLabel="Y" />
         <CompassBar value={data.skewnessZ} axisLabel="Z" />
      </div>
    </div>
  );
}

export default SkewnessChart;
