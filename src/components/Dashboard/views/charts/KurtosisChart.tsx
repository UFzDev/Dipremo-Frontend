import { type KurtosisData } from '../../../../lib/algorithms/KurtosisEngine';

type KurtosisChartProps = {
  data: KurtosisData | null;
};

function getBearingHealthStatus(kurtosis: number) {
  if (kurtosis < 3.0) return { color: '#64748b', label: 'BAJO RUIDO (ANORMAL)', percent: (kurtosis/12)*100 }; // Ruido sub-gausiano / senoidal puro
  if (kurtosis < 3.5) return { color: '#10b981', label: 'NORMAL (SIN IMPACTOS)', percent: (kurtosis/12)*100 };
  if (kurtosis < 10.0) return { color: '#f59e0b', label: 'ALERTA (MICRO-GRIETAS)', percent: (kurtosis/12)*100 };
  return { color: '#ef4444', label: 'CRÍTICO (DAÑO SEVERO)', percent: 100 };
}

function GaugeBar({ value, axisLabel }: { value: number; axisLabel: string }) {
  const status = getBearingHealthStatus(value);
  const fillWidth = Math.max(0, Math.min(100, status.percent));

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '13px', fontWeight: 800 }}>
         <span>Eje {axisLabel} <span style={{ color: '#94a3b8', fontSize: '11px', marginLeft: '4px' }}>(K={value.toFixed(2)})</span></span>
         <span style={{ color: status.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{status.label}</span>
      </div>
      <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
         <div style={{ 
           height: '100%', 
           width: `${fillWidth}%`, 
           background: status.color, 
           transition: 'width 0.4s ease-out, background-color 0.4s ease-out' 
         }}></div>
      </div>
      {/* Marcadores de referencia */}
      <div style={{ position: 'relative', height: '10px', marginTop: '4px' }}>
         <div style={{ position: 'absolute', left: `${(3.5/12)*100}%`, width: '2px', height: '100%', background: '#fcd34d' }}></div>
         <span style={{ position: 'absolute', left: `${(3.5/12)*100}%`, top: '10px', fontSize: '9px', color: '#f59e0b', transform: 'translateX(-50%)' }}>Warn (3.5)</span>

         <div style={{ position: 'absolute', left: `${(10.0/12)*100}%`, width: '2px', height: '100%', background: '#fca5a5' }}></div>
         <span style={{ position: 'absolute', left: `${(10.0/12)*100}%`, top: '10px', fontSize: '9px', color: '#ef4444', transform: 'translateX(-50%)' }}>Danger (10.0)</span>
      </div>
    </div>
  );
}

function KurtosisChart({ data }: KurtosisChartProps) {
  if (!data) {
    return (
      <div style={{ height: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
         </svg>
         Capturando 4to Momento Estadístico...
         <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="kurtosis-chart-card" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z"></path>
              <path d="M8.5 7.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"></path>
           </svg>
           Salud de Rodamientos (Curtosis)
        </h4>
        <p style={{ margin: '0.25rem 0 0', fontSize: '11px', color: '#64748b' }}>
          Detección de impactos en alta frecuencia insensible a velocidad. Límite Crítico: K={'>'}10
        </p>
      </header>

      <div style={{ flex: 1, paddingBottom: '1rem' }}>
         <GaugeBar value={data.kurtosisX} axisLabel="X" />
         <GaugeBar value={data.kurtosisY} axisLabel="Y" />
         <GaugeBar value={data.kurtosisZ} axisLabel="Z" />
      </div>
    </div>
  );
}

export default KurtosisChart;
