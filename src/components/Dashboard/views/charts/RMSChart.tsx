import { useMemo, useState } from 'react';
import { ChartEngine } from '../../../../lib/utils/chart-engine';
import ChartFilters, { TRIAXIAL_WITH_RES } from './ChartFilters';

type RMSChartProps = {
  history: any[];
  height?: number;
  thresholds: { x: number; y: number; z: number; res: number };
};

function RMSChart({ history, height = 200, thresholds }: RMSChartProps) {
  const width = 800;
  const WINDOW_SIZE = 100;
  
  // Estado para filtros de ejes
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set(['x', 'y', 'z', 'res']));

  const handleToggle = (key: string) => {
    const next = new Set(activeKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setActiveKeys(next);
  };

  // 1. Filtramos y preparamos los datos RMS
  const rmsData = useMemo(() => {
    return history
      .filter(p => p.isRMS)
      .slice(0, WINDOW_SIZE)
      .reverse();
  }, [history]);

  // 2. Generamos puntos para los ejes visibles
  const axisPoints = useMemo(() => {
    // Calculamos el máximo real de los datos visibles para auto-scaling inteligente
    const allVisibleValues = rmsData.flatMap(p => {
      const vals = [];
      if (activeKeys.has('x')) { vals.push(p.x); vals.push(thresholds.x); }
      if (activeKeys.has('y')) { vals.push(p.y); vals.push(thresholds.y); }
      if (activeKeys.has('z')) { vals.push(p.z); vals.push(thresholds.z); }
      if (activeKeys.has('res')) { vals.push(p.res); vals.push(thresholds.res); }
      return vals;
    });

    const maxVal = Math.max(...allVisibleValues, 10);
    const scale = { min: 0, max: maxVal * 1.1 };
    
    return {
      x: activeKeys.has('x') ? ChartEngine.generatePolylinePoints(rmsData.map(p => p.x), { width, height }, scale) : '',
      y: activeKeys.has('y') ? ChartEngine.generatePolylinePoints(rmsData.map(p => p.y), { width, height }, scale) : '',
      z: activeKeys.has('z') ? ChartEngine.generatePolylinePoints(rmsData.map(p => p.z), { width, height }, scale) : '',
      res: activeKeys.has('res') ? ChartEngine.generatePolylinePoints(rmsData.map(p => p.res || 0), { width, height }, scale) : '',
      max: scale.max
    };
  }, [rmsData, height, activeKeys, thresholds]);

  // Cálculo de Y para líneas horizontales
  const getY = (val: number) => {
    const range = axisPoints.max || 1; // Evitar división por cero
    return height - (val / range) * height;
  };

  // Cálculo de picos máximos por eje en la ventana actual
  const peaks = useMemo(() => {
    return {
      x: Math.max(...rmsData.map(p => p.x), 0),
      y: Math.max(...rmsData.map(p => p.y), 0),
      z: Math.max(...rmsData.map(p => p.z), 0),
      res: Math.max(...rmsData.map(p => p.res || 0), 0)
    };
  }, [rmsData]);

  if (rmsData.length === 0) {
    return (
      <div className="rms-chart-container" style={{ 
        height: height + 80, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#f8fafc', 
        borderRadius: '12px', 
        border: '2px dashed #e2e8f0', 
        marginBottom: '2rem',
        color: '#94a3b8',
        fontSize: '12px',
        fontWeight: 600,
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        Esperando estabilizaci&oacute;n de energ&iacute;a...
      </div>
    );
  }

  const latest = rmsData[rmsData.length - 1] || {};

  return (
    <div className="rms-chart-container" style={{ position: 'relative', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Tendencia Energ&eacute;tica (RMS)
          </h4>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>Escala Autom&aacute;tica: 0 - {axisPoints.max.toFixed(1)} LSB</div>
        </div>
        
        <ChartFilters axes={TRIAXIAL_WITH_RES} activeKeys={activeKeys} onToggle={handleToggle} />
      </div>

      <div style={{ position: 'relative', paddingLeft: '35px' }}>
        {/* Etiquetas de Eje Y (Escala) */}
        <div style={{ position: 'absolute', left: 0, top: 0, height: height, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '9px', fontWeight: 700, color: '#94a3b8', textAlign: 'right', width: '30px' }}>
          <span>{axisPoints.max.toFixed(0)}</span>
          <span>{(axisPoints.max / 2).toFixed(0)}</span>
          <span>0</span>
        </div>

        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          {/* Rejilla de Referencia */}
          <line x1="0" y1="0" x2={width} y2="0" stroke="#f8fafc" strokeWidth="1" />
          <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#f8fafc" strokeWidth="1" />
          <line x1="0" y1={height} x2={width} y2={height} stroke="#f1f5f9" strokeWidth="1" />

          {/* Líneas de Umbral / Picos Críticos */}
          {activeKeys.has('res') && <line x1="0" y1={getY(thresholds.res)} x2={width} y2={getY(thresholds.res)} stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />}
          {activeKeys.has('z') && <line x1="0" y1={getY(thresholds.z)} x2={width} y2={getY(thresholds.z)} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />}
          {activeKeys.has('y') && <line x1="0" y1={getY(thresholds.y)} x2={width} y2={getY(thresholds.y)} stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />}
          {activeKeys.has('x') && <line x1="0" y1={getY(thresholds.x)} x2={width} y2={getY(thresholds.x)} stroke="var(--error)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />}

          {/* L&iacute;neas de Tendencia */}
          {activeKeys.has('res') && <polyline points={axisPoints.res} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="4 2" opacity="0.8" style={{ transition: 'all 0.3s' }} />}
          {activeKeys.has('z') && <polyline points={axisPoints.z} fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.6" style={{ transition: 'all 0.3s' }} />}
          {activeKeys.has('y') && <polyline points={axisPoints.y} fill="none" stroke="#10b981" strokeWidth="2" opacity="0.6" style={{ transition: 'all 0.3s' }} />}
          {activeKeys.has('x') && <polyline points={axisPoints.x} fill="none" stroke="#ef4444" strokeWidth="2" style={{ transition: 'all 0.3s' }} />}
        </svg>
      </div>

      {/* Valores Actuales y Picos */}
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
         {activeKeys.has('x') && <div><span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>RMS X:</span> <strong style={{ color: 'var(--error)' }}>{latest.x?.toFixed(2)}</strong> <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>(Pico: {peaks.x.toFixed(2)})</span></div>}
         {activeKeys.has('y') && <div><span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>RMS Y:</span> <strong style={{ color: '#10b981' }}>{latest.y?.toFixed(2)}</strong> <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>(Pico: {peaks.y.toFixed(2)})</span></div>}
         {activeKeys.has('z') && <div><span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>RMS Z:</span> <strong style={{ color: 'var(--primary)' }}>{latest.z?.toFixed(2)}</strong> <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>(Pico: {peaks.z.toFixed(2)})</span></div>}
         {activeKeys.has('res') && <div><span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>RESULTANTE:</span> <strong style={{ color: '#8b5cf6' }}>{latest.res?.toFixed(2)}</strong> <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>(Pico: {peaks.res.toFixed(2)})</span></div>}
      </div>
    </div>
  );
}

export default RMSChart;
