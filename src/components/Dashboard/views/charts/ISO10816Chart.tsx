import { useState } from 'react';
import { type VelocityRMSData } from '../../../../lib/algorithms/IntegrationEngine';

type ISO10816ChartProps = {
  data: VelocityRMSData | null;
};

type ISOLimits = {
  good: number;
  satisfactory: number;
  unsatisfactory: number;
};

const ISO_CLASSES: Record<number, { title: string, desc: string, limits: ISOLimits }> = {
  1: {
    title: 'Clase I',
    desc: 'Pequeños (< 15 kW)',
    limits: { good: 0.71, satisfactory: 1.80, unsatisfactory: 4.50 }
  },
  2: {
    title: 'Clase II',
    desc: 'Medianos (15 kW - 75 kW)',
    limits: { good: 1.12, satisfactory: 2.80, unsatisfactory: 7.10 }
  },
  3: {
    title: 'Clase III',
    desc: 'Grandes (> 75 kW), Base Rígida',
    limits: { good: 1.80, satisfactory: 4.50, unsatisfactory: 11.20 }
  },
  4: {
    title: 'Clase IV',
    desc: 'Grandes (> 75 kW), Base Flexible',
    limits: { good: 2.80, satisfactory: 7.10, unsatisfactory: 18.00 }
  }
};

function getSeverityZone(vRms: number, limits: ISOLimits) {
  if (vRms <= limits.good) return { color: '#10b981', label: 'EXCELENTE', tag: 'A' };
  if (vRms <= limits.satisfactory) return { color: '#84cc16', label: 'SATISFACTORIO', tag: 'B' };
  if (vRms <= limits.unsatisfactory) return { color: '#f59e0b', label: 'ALERTA', tag: 'C' };
  return { color: '#ef4444', label: 'PELIGRO', tag: 'D' };
}

function Thermometer({ vRms, axisLabel, limits }: { vRms: number; axisLabel: string, limits: ISOLimits }) {
  const zone = getSeverityZone(vRms, limits);
  // Escalar el límite del termómetro para que el "Rojo" se alcance cerca del techo visual
  const MAX_SCALE = limits.unsatisfactory * 1.5; 
  const heightPercent = Math.min(100, (vRms / MAX_SCALE) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
      <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>EJE {axisLabel}</div>
      <div style={{ position: 'relative', height: '140px', width: '24px', background: '#f1f5f9', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <div style={{ 
          width: '100%', 
          height: `${heightPercent}%`, 
          background: zone.color,
          transition: 'height 0.3s ease-out, background 0.3s'
        }}></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <strong style={{ fontSize: '15px', color: zone.color }}>{vRms.toFixed(2)}</strong>
        <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700 }}>mm/s</span>
      </div>
      <div style={{ fontSize: '10px', fontWeight: 800, background: `${zone.color}20`, color: zone.color, padding: '2px 8px', borderRadius: '4px' }}>
        ZONA {zone.tag}
      </div>
    </div>
  );
}

function ISO10816Chart({ data }: ISO10816ChartProps) {
  const [motorClass, setMotorClass] = useState<number>(1);

  if (!data) {
    return (
      <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', animation: 'pulse 1.5s infinite' }}>
            <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path>
         </svg>
         Capturando métricas de Integración ISO...
         <style>{`@keyframes pulse { 0%, 100% { opacity: 0.5; transform: scale(0.95); } 50% { opacity: 1; transform: scale(1.05); } }`}</style>
      </div>
    );
  }

  const selectedClass = ISO_CLASSES[motorClass];

  return (
    <div className="iso-chart-card" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
        <div style={{ minWidth: '200px' }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Severidad ISO 10816-3</h4>
          <p style={{ margin: '0.25rem 0 0', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
            {selectedClass.title}: {selectedClass.desc}
          </p>
        </div>
        <div style={{ flex: '1 1 200px', display: 'flex', justifyContent: 'flex-end' }}>
          <select 
            value={motorClass} 
            onChange={(e) => setMotorClass(Number(e.target.value))}
            style={{ 
              width: '100%',
              maxWidth: '280px',
              padding: '8px 12px', 
              borderRadius: '8px', 
              border: '1px solid #cbd5e1', 
              fontSize: '11px', 
              fontWeight: 700, 
              color: '#334155', 
              background: '#f8fafc', 
              cursor: 'pointer', 
              outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            {Object.entries(ISO_CLASSES).map(([key, iso]) => (
              <option key={key} value={key}>{iso.title} - {iso.desc}</option>
            ))}
          </select>
        </div>
      </header>

      {/* 1. SECCIÓN RESULTANTE (MAESTRO) */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
         <div style={{ width: '100%', maxWidth: '280px' }}>
           <Thermometer vRms={data.vRmsRes} axisLabel="RESULTANTE" limits={selectedClass.limits} />
         </div>
      </div>

      {/* 2. SECCIÓN POR EJES (DETALLE) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', alignItems: 'center' }}>
         <Thermometer vRms={data.vRmsX} axisLabel="X" limits={selectedClass.limits} />
         <Thermometer vRms={data.vRmsY} axisLabel="Y" limits={selectedClass.limits} />
         <Thermometer vRms={data.vRmsZ} axisLabel="Z" limits={selectedClass.limits} />
      </div>

      <footer style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', fontSize: '9px', fontWeight: 800, textAlign: 'center', opacity: 0.8 }}>
         <div style={{ color: '#10b981' }}>ZONA A<br/>&lt; {selectedClass.limits.good.toFixed(2)}</div>
         <div style={{ color: '#84cc16' }}>ZONA B<br/>&lt; {selectedClass.limits.satisfactory.toFixed(2)}</div>
         <div style={{ color: '#f59e0b' }}>ZONA C<br/>&lt; {selectedClass.limits.unsatisfactory.toFixed(2)}</div>
         <div style={{ color: '#ef4444' }}>ZONA D<br/>&gt; {selectedClass.limits.unsatisfactory.toFixed(2)}</div>
      </footer>
    </div>
  );
}

export default ISO10816Chart;
