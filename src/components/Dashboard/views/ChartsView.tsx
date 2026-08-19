import VibrationChart from './charts/VibrationChart'
import RMSChart from './charts/RMSChart'
import FFTChart from './charts/FFTChart'
import ISO10816Chart from './charts/ISO10816Chart'
import KurtosisChart from './charts/KurtosisChart'
import SkewnessChart from './charts/SkewnessChart'
import { type ESPData } from '../../../lib/connection'
import { type FFTData } from '../../../lib/algorithms/FFTEngine'
import { type VelocityRMSData } from '../../../lib/algorithms/IntegrationEngine'
import { type KurtosisData } from '../../../lib/algorithms/KurtosisEngine'
import { type SkewnessData } from '../../../lib/algorithms/SkewnessEngine'

type ChartsViewProps = {
  data: ESPData | null;
  history: any[];
  fftData: FFTData | null;
  isoData: VelocityRMSData | null;
  kurtosisData: KurtosisData | null;
  skewnessData: SkewnessData | null;
  motorRpm: number;
  vibeLimits: { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number };
  rmsPeaks: { x: number; y: number; z: number; res: number };
  fftRange: { minHz: number; maxHz: number };
  classification: string;
};

function ChartsView({ 
  data, history, fftData, isoData, kurtosisData, skewnessData, motorRpm,
  vibeLimits = { minX: -16, maxX: 16, minY: -16, maxY: 16, minZ: -16, maxZ: 16 },
  rmsPeaks = { x: 50, y: 50, z: 50, res: 80 },
  fftRange = { minHz: 0, maxHz: 50 },
  classification = "Indeterminado"
}: ChartsViewProps) {
  return (
    <div className="charts-view" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%', boxSizing: 'border-box' }}>
      <header style={{ gridColumn: '1 / span 3', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#1e293b', margin: 0 }}>
            Monitor Triaxial
          </h2>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: classification === "Encendido" ? '#10b981' : (classification === "Apagado" ? '#64748b' : (classification === "Papel" ? '#ef4444' : '#94a3b8')),
            padding: '0.4rem 1rem',
            borderRadius: '2rem',
            color: 'white',
            fontSize: '11px',
            fontWeight: 900,
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}>
            {classification === "Encendido" ? '✅' : (classification === "Apagado" ? '⚪' : (classification === "Papel" ? '⚠️' : '❓'))}
            {classification.toUpperCase()}
          </div>
        </div>
      </header>

      {/* Gráficas de Vibración en tiempo real */}
      <VibrationChart latestSample={data} axis="x" label="Eje X" color="#ef4444" limits={{ min: vibeLimits.minX, max: vibeLimits.maxX }} />
      <VibrationChart latestSample={data} axis="y" label="Eje Y" color="#10b981" limits={{ min: vibeLimits.minY, max: vibeLimits.maxY }} />
      <VibrationChart latestSample={data} axis="z" label="Eje Z" color="#3b82f6" limits={{ min: vibeLimits.minZ, max: vibeLimits.maxZ }} />

      {/* Gráfica de Energía (Trend) - Ocupa todo el ancho */}
      <div style={{ gridColumn: '1 / span 3', marginTop: '1rem' }}>
        <RMSChart history={history} thresholds={rmsPeaks} />
      </div>

      {/* Gráfica Espectral FFT */}
      <div style={{ gridColumn: '1 / span 3' }}>
        <FFTChart data={fftData} motorRpm={motorRpm} range={fftRange} />
      </div>

      {/* Indicadores Predictivos Múltiples (Bottom Row) */}
      <div style={{ gridColumn: '1 / span 3', gap: '1rem', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)' }}>
        <ISO10816Chart data={isoData} />
        <KurtosisChart data={kurtosisData} />
        <SkewnessChart data={skewnessData} />
      </div>
    </div>
  );
}

export default ChartsView;
