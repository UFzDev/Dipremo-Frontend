import { useState, useEffect, useMemo } from 'react';
import { ChartEngine } from '../../../../lib/utils/chart-engine';
import { NormalizationEngine } from '../../../../lib/algorithms/Normalization';
import { type ESPData } from '../../../../lib/connection';
import BaseChart from './BaseChart';

type VibrationChartProps = {
  latestSample: ESPData | null;
  axis: 'x' | 'y' | 'z';
  label: string;
  color: string;
  limits: { min: number; max: number };
};

function VibrationChart({ latestSample, axis, label, color, limits }: VibrationChartProps) {
  // Parámetros de vista del gráfico
  const width = 800;
  const height = 120;
  const WINDOW_SIZE = 100;

  // Búfer local interno (Solo 100 puntos)
  const [windowData, setWindowData] = useState<number[]>(new Array(WINDOW_SIZE).fill(0));

  // Inyección de datos en tiempo real (Velocidad Nativa del Sensor)
  useEffect(() => {
    if (!latestSample) return;

    // 1. Normalizamos solo el nuevo punto entrante
    const normalizedPoint = NormalizationEngine.processSample(latestSample);
    const newValue = normalizedPoint[axis];

    // 2. Actualizamos el búfer de ventana (Empujamos nuevo, quitamos viejo)
    setWindowData(prev => {
      const next = [...prev, newValue];
      if (next.length > WINDOW_SIZE) return next.slice(1);
      return next;
    });
  }, [latestSample, axis]);

  // Cálculo de picos en la ventana actual
  const peaks = useMemo(() => {
    if (windowData.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...windowData),
      max: Math.max(...windowData)
    };
  }, [windowData]);

  // Generación de puntos SVG ultra-ligera
  const points = useMemo(() => {
    return ChartEngine.generatePolylinePoints(
      windowData, 
      { width, height }, 
      { min: limits.min, max: limits.max }
    );
  }, [windowData, limits]);

  // Cálculo de Y para las líneas de umbral
  const getY = (val: number) => {
    const rawRange = limits.max - limits.min;
    const range = rawRange === 0 ? 1 : rawRange; // Evitar división por cero
    return height - ((val - limits.min) / range) * height;
  };

  return (
    <BaseChart 
      label={label}
      color={color}
      points={points}
      valueDisplay={
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '10px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Min: {peaks.min.toFixed(0)}</span>
          <span style={{ color, fontWeight: 900, fontSize: '13px', padding: '0 4px', background: '#f8fafc', borderRadius: '4px' }}>
            {windowData[windowData.length - 1]?.toFixed(0) || '0'}
          </span>
          <span style={{ color: 'var(--error)' }}>Max: {peaks.max.toFixed(0)}</span>
        </div>
      }
    >
      {/* Líneas de Umbral Configuradas */}
      <line 
        x1="0" y1={getY(limits.max)} x2={width} y2={getY(limits.max)} 
        stroke="var(--error)" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6" 
      />
      <line 
        x1="0" y1={getY(limits.min)} x2={width} y2={getY(limits.min)} 
        stroke="var(--error)" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6" 
      />
    </BaseChart>
  );
}

export default VibrationChart;
