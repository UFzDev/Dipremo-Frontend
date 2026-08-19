import { useState, useMemo } from 'react';
import { ChartEngine } from '../../../../lib/utils/chart-engine';
import { type FFTData } from '../../../../lib/algorithms/FFTEngine';
import ChartFilters, { TRIAXIAL_WITH_RES } from './ChartFilters';

type FFTChartProps = {
  data: FFTData | null;
  height?: number;
  motorRpm: number;
  range: { minHz: number; maxHz: number };
};

function FFTChart({ data, height = 280, motorRpm, range }: FFTChartProps) {
  const width = 800;
  
  // Estado para filtros de ejes
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set(['x', 'y', 'z', 'res']));

  const handleToggle = (key: string) => {
    const next = new Set(activeKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setActiveKeys(next);
  };

  // Mapeo de coordenadas y detección de picos
  const chartData = useMemo(() => {
    if (!data) return null;

    // Magnitudes visibles para escalado
    const visibleMagnitudes: number[] = [];
    if (activeKeys.has('x')) visibleMagnitudes.push(...data.magnitudeX);
    if (activeKeys.has('y')) visibleMagnitudes.push(...data.magnitudeY);
    if (activeKeys.has('z')) visibleMagnitudes.push(...data.magnitudeZ);
    if (activeKeys.has('res')) visibleMagnitudes.push(...data.magnitudeRes);

    const maxVal = visibleMagnitudes.length > 0 ? Math.max(...visibleMagnitudes) : 10;
    const bounds = { min: 0, max: Math.max(5, maxVal * 1.15) }; 

    // Búsqueda de Pico Dominante en la Resultante
    let peakMag = 0;
    let peakIndex = 0;
    data.magnitudeRes.forEach((mag, i) => {
      if (mag > peakMag) {
        peakMag = mag;
        peakIndex = i;
      }
    });

    const peakFreq = peakIndex * (data.sampleRateHz / (data.bins * 2));

    return {
      lines: {
        x: activeKeys.has('x') ? ChartEngine.generatePolylinePoints(data.magnitudeX, { width, height }, bounds) : '',
        y: activeKeys.has('y') ? ChartEngine.generatePolylinePoints(data.magnitudeY, { width, height }, bounds) : '',
        z: activeKeys.has('z') ? ChartEngine.generatePolylinePoints(data.magnitudeZ, { width, height }, bounds) : '',
        res: activeKeys.has('res') ? ChartEngine.generatePolylinePoints(data.magnitudeRes, { width, height }, bounds) : '',
      },
      max: bounds.max,
      peak: { mag: peakMag, freq: peakFreq }
    };
  }, [data, activeKeys, height]);

  if (!data || !chartData) {
    return (
      <div className="fft-chart-container" style={{ 
        height: height + 80, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#f8fafc', 
        borderRadius: '12px', 
        border: '2px dashed #e2e8f0', 
        marginBottom: '2rem',
        color: '#94a3b8',
        fontSize: '13px',
        fontWeight: 600,
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        Generando espectro triaxial...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const maxFreq = data.sampleRateHz / 2;

  return (
    <div className="fft-chart-wrapper" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
      
      {/* Header y Filtros */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            Transformada de Fourier (FFT)
          </h4>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Frecuencia: 0 - {maxFreq.toFixed(0)} Hz</span>
            <span style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 700 }}>Pico: {chartData.peak.freq.toFixed(1)} Hz ({chartData.peak.mag.toFixed(1)} LSB)</span>
          </div>
        </div>
        
        <ChartFilters axes={TRIAXIAL_WITH_RES} activeKeys={activeKeys} onToggle={handleToggle} />
      </div>

      <div style={{ display: 'flex' }}>
        {/* Eje Y Indices */}
        <div style={{ width: '35px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: height, color: '#94a3b8', fontSize: '10px', fontWeight: 700, textAlign: 'right', paddingRight: '8px' }}>
           <span>{chartData.max.toFixed(0)}</span>
           <span>{(chartData.max / 2).toFixed(0)}</span>
           <span>0</span>
        </div>

        {/* Contenedor de la gráfica SVG */}
        <div style={{ flex: 1, position: 'relative', height: height, background: '#fafafa', borderRadius: '8px', overflow: 'hidden', borderBottom: '2px solid #e2e8f0', borderLeft: '2px solid #e2e8f0' }}>
          
          {/* Grid Background */}
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.3 }}>
            <defs>
              <pattern id="fft-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#fft-grid)" />
          </svg>

          {/* Líneas de FFT */}
          <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
            
            {/* Sombras base - Prioridad a la Resultante */}
            {activeKeys.has('res') && chartData.lines.res && <polygon points={`0,${height} ${chartData.lines.res} ${width},${height}`} fill="#8b5cf6" opacity="0.1" />}
            {activeKeys.has('z') && chartData.lines.z && <polygon points={`0,${height} ${chartData.lines.z} ${width},${height}`} fill="#3b82f6" opacity="0.05" />}
            {activeKeys.has('y') && chartData.lines.y && <polygon points={`0,${height} ${chartData.lines.y} ${width},${height}`} fill="#10b981" opacity="0.05" />}
            {activeKeys.has('x') && chartData.lines.x && <polygon points={`0,${height} ${chartData.lines.x} ${width},${height}`} fill="#ef4444" opacity="0.05" />}

            {/* Líneas sólidas */}
            {activeKeys.has('res') && chartData.lines.res && <polyline points={chartData.lines.res} fill="none" stroke="#8b5cf6" strokeWidth="3" opacity="0.9" strokeLinejoin="round" />}
            {activeKeys.has('z') && chartData.lines.z && <polyline points={chartData.lines.z} fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.6" strokeLinejoin="round" />}
            {activeKeys.has('y') && chartData.lines.y && <polyline points={chartData.lines.y} fill="none" stroke="#10b981" strokeWidth="2" opacity="0.6" strokeLinejoin="round" />}
            {activeKeys.has('x') && chartData.lines.x && <polyline points={chartData.lines.x} fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.7" strokeLinejoin="round" />}

            {/* Zona de Interés (Rango Configurado) */}
            {(() => {
               const maxFreq = (data.sampleRateHz / 2) || 1; // Evitar división por cero
               const rectX = (range.minHz / maxFreq) * width;
               const rectW = ((range.maxHz - range.minHz) / maxFreq) * width;
               
               if (rectW <= 0 || isNaN(rectX) || isNaN(rectW)) return null;
               
               return (
                 <g>
                   <rect 
                     x={rectX} y={0} width={rectW} height={height} 
                     fill="var(--primary)" opacity="0.1" 
                   />
                   <line x1={rectX} y1={0} x2={rectX} y2={height} stroke="var(--primary)" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
                   <line x1={rectX+rectW} y1={0} x2={rectX+rectW} y2={height} stroke="var(--primary)" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
                   <text x={rectX + 5} y={height - 10} fill="var(--primary)" fontSize="9" fontWeight="800" opacity="0.6">ZONA ACTIVA</text>
                 </g>
               );
            })()}

            {/* Referencias Mecánicas (1X, 2X) */}
            {motorRpm > 0 && (() => {
              const f1X = motorRpm / 60;
              const f2X = f1X * 2;
              const maxFreq = data.sampleRateHz / 2;
              const x1X = (f1X / maxFreq) * width;
              const x2X = (f2X / maxFreq) * width;

              return (
                <g>
                  {/* 1X Line */}
                  <line x1={x1X} y1={0} x2={x1X} y2={height} stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.8" />
                  <text x={x1X + 4} y={20} fill="#64748b" fontSize="10" fontWeight="800">1X (Giro)</text>
                  
                  {/* 2X Line (Opcional, solo si está en rango) */}
                  {f2X < maxFreq && (
                    <>
                      <line x1={x2X} y1={0} x2={x2X} y2={height} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                      <text x={x2X + 4} y={35} fill="#94a3b8" fontSize="9" fontWeight="700">2X</text>
                    </>
                  )}
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Axis Labels (X-Axis: Frequency) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingLeft: '35px', color: '#64748b', fontSize: '10px', fontWeight: 600 }}>
        <span>0 Hz</span>
        <span>{Math.round(maxFreq / 4)} Hz</span>
        <span>{Math.round(maxFreq / 2)} Hz</span>
        <span>{Math.round((maxFreq * 3) / 4)} Hz</span>
        <span>{(maxFreq).toFixed(0)} Hz</span>
      </div>

    </div>
  );
}

export default FFTChart;
