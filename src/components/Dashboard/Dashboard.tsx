import { useState, useEffect, useRef } from 'react'
import { type ESPData, type ConnectionStatus, STATUS } from '../../lib/connection'
import { RMSEngine, type RMSData } from '../../lib/algorithms/RMSEngine'
import { FFTEngine, type FFTData } from '../../lib/algorithms/FFTEngine'
import { IntegrationEngine, type VelocityRMSData } from '../../lib/algorithms/IntegrationEngine'
import { KurtosisEngine, type KurtosisData } from '../../lib/algorithms/KurtosisEngine'
import { SkewnessEngine, type SkewnessData } from '../../lib/algorithms/SkewnessEngine'
import { ConnectionEngine, type ConnectionHealth } from '../../lib/algorithms/ConnectionEngine'
import { NormalizationEngine } from '../../lib/algorithms/Normalization'
import { SVMClassifier } from '../../lib/algorithms/SVMClassifier'

// ... (Sub-componentes)
import Sidebar from './Sidebar'
import OverviewView from './views/OverviewView'
import ChartsView from './views/ChartsView'
import HistoryView from './views/HistoryView'
import MathView from './views/MathView'
import RawView from './views/RawView'
import ConfigView from './views/ConfigView'

type DashboardProps = {
  data: ESPData | null;
  status: ConnectionStatus;
  onConnect: () => void;
  onDisconnect: () => void;
};

export type Tab = 'overview' | 'charts' | 'history' | 'math' | 'raw' | 'settings';

function Dashboard({ data, status, onConnect, onDisconnect }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // 0. Configuración de Motor (Persistente)
  const [motorRpm, setMotorRpm] = useState<number>(() => {
    const saved = localStorage.getItem('dipremo_motor_rpm');
    return saved ? parseInt(saved, 10) : 1800;
  });

  useEffect(() => {
    localStorage.setItem('dipremo_motor_rpm', motorRpm.toString());
  }, [motorRpm]);

  // 0.1 Configuración Avanzada (Límites y Picos)
  const [vibeLimits, setVibeLimits] = useState(() => {
    const saved = localStorage.getItem('dipremo_vibe_limits');
    return saved ? JSON.parse(saved) : { minX: -16, maxX: 16, minY: -16, maxY: 16, minZ: -16, maxZ: 16 };
  });

  const [rmsPeaks, setRmsPeaks] = useState(() => {
    const saved = localStorage.getItem('dipremo_rms_peaks');
    return saved ? JSON.parse(saved) : { x: 50, y: 50, z: 50, res: 80 };
  });

  const [fftRange, setFftRange] = useState(() => {
    const saved = localStorage.getItem('dipremo_fft_range');
    return saved ? JSON.parse(saved) : { minHz: 0, maxHz: 50 };
  });

  useEffect(() => {
    localStorage.setItem('dipremo_vibe_limits', JSON.stringify(vibeLimits));
  }, [vibeLimits]);

  useEffect(() => {
    localStorage.setItem('dipremo_rms_peaks', JSON.stringify(rmsPeaks));
  }, [rmsPeaks]);

  useEffect(() => {
    localStorage.setItem('dipremo_fft_range', JSON.stringify(fftRange));
  }, [fftRange]);
  
  // 1. Historial en memoria (solo para renderizado UI)
  const historyRef = useRef<RMSData[]>([]);
  const rawBufferRef = useRef<ESPData[]>([]);

  // 2. Estado de Interfaz (solo se actualiza periódicamente para fluidez)
  const [displayHistory, setDisplayHistory] = useState<RMSData[]>([]);
  const [displayRawHistory, setDisplayRawHistory] = useState<ESPData[]>([]);

  // 3. Estado FFT
  const fftRef = useRef<FFTData | null>(null);
  const [displayFft, setDisplayFft] = useState<FFTData | null>(null);

  // 4. Estado Velocidad ISO (Integración)
  const isoRef = useRef<VelocityRMSData | null>(null);
  const [displayIso, setDisplayIso] = useState<VelocityRMSData | null>(null);

  // 5. Estado Curtosis
  const kurtosisRef = useRef<KurtosisData | null>(null);
  const [displayKurtosis, setDisplayKurtosis] = useState<KurtosisData | null>(null);

  // 6. Estado Asimetría (Skewness)
  const skewnessRef = useRef<SkewnessData | null>(null);
  const [displaySkewness, setDisplaySkewness] = useState<SkewnessData | null>(null);

  // 7. Estado Diagnóstico de Conexión
  const healthRef = useRef<ConnectionHealth | null>(null);
  const [displayHealth, setDisplayHealth] = useState<ConnectionHealth | null>(null);

  // 8. Registro de Picos de Sesión (Para Calibración)
  const sessionPeaksRef = useRef({
    minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0,
    rmsX: 0, rmsY: 0, rmsZ: 0, rmsRes: 0,
    maxFreqHz: 0, maxFreqLSB: 0
  });
  const [displaySessionPeaks, setDisplaySessionPeaks] = useState(sessionPeaksRef.current);

  // 9. Estado Vibración Normalizada (En tiempo real)
  const normalizedRef = useRef({ x: 0, y: 0, z: 0 });
  const [displayNormalized, setDisplayNormalized] = useState(normalizedRef.current);

  // 10. Clasificación SVM
  const svmClassificationRef = useRef<string>("Indeterminado");
  const [displaySvmClassification, setDisplaySvmClassification] = useState(svmClassificationRef.current);

  const resetSessionPeaks = () => {
    sessionPeaksRef.current = {
      minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0,
      rmsX: 0, rmsY: 0, rmsZ: 0, rmsRes: 0,
      maxFreqHz: 0, maxFreqLSB: 0
    };
    setDisplaySessionPeaks(sessionPeaksRef.current);
  };

  // Gestión de entrada de datos (Velocidad de Sensor)
  useEffect(() => {
    // A. Gatekeeper: Solo procesar si estamos conectados y hay data
    if (data && status === STATUS.CONNECTED) {
      // 0. Normalización Única (Evita corrupción de EMA por llamadas múltiples)
      const normalized = NormalizationEngine.processSample(data);
      normalizedRef.current = { x: normalized.x, y: normalized.y, z: normalized.z };

      // 1. Registro de Picos de Sesión (Absolutos)
      const p = sessionPeaksRef.current;
      p.minX = Math.min(p.minX, normalized.x);
      p.maxX = Math.max(p.maxX, normalized.x);
      p.minY = Math.min(p.minY, normalized.y);
      p.maxY = Math.max(p.maxY, normalized.y);
      p.minZ = Math.min(p.minZ, normalized.z);
      p.maxZ = Math.max(p.maxZ, normalized.z);

      // B. Buffer RAW (Volátil - Solo para Math/Normalization)
      rawBufferRef.current = [data, ...rawBufferRef.current].slice(0, 200);

      // C. Procesamiento RMS (Persistente - Para Auditoría/Tendencia)
      // Nota: RMSEngine.addSample ahora debería usar el normalized calculado si fuera posible,
      // pero para no romper compatibilidad, le pasamos la data. 
      // TODO: Refactorizar motores para aceptar pre-normalized.
      const rmsResult = RMSEngine.addSample(data);
      if (rmsResult) {
        historyRef.current = [rmsResult, ...historyRef.current].slice(0, 5000);
        
        // Actualizar picos RMS de sesión
        p.rmsX = Math.max(p.rmsX, rmsResult.x);
        p.rmsY = Math.max(p.rmsY, rmsResult.y);
        p.rmsZ = Math.max(p.rmsZ, rmsResult.z);
        p.rmsRes = Math.max(p.rmsRes, rmsResult.res);
      }

      // D. Procesamiento Espectral (FFT)
      const fftResult = FFTEngine.addSample(data);
      if (fftResult) {
        fftRef.current = fftResult;

        // Buscar el pico más alto en la resultante para la sesión
        let currentPeakMag = 0;
        let currentPeakIdx = 0;
        fftResult.magnitudeRes.forEach((mag, i) => {
          if (mag > currentPeakMag) {
            currentPeakMag = mag;
            currentPeakIdx = i;
          }
        });

        // Solo actualizar si este pico es mayor al histórico de la sesión
        if (currentPeakMag > p.maxFreqLSB) {
          p.maxFreqLSB = currentPeakMag;
          p.maxFreqHz = currentPeakIdx * (fftResult.sampleRateHz / (fftResult.bins * 2));
        }
      }
      
      // ... resto de motores
      const isoResult = IntegrationEngine.addSample(data);
      if (isoResult) isoRef.current = isoResult;

      const kurtosisResult = KurtosisEngine.addSample(data);
      if (kurtosisResult) kurtosisRef.current = kurtosisResult;

      const skewnessResult = SkewnessEngine.addSample(data);
      if (skewnessResult) skewnessRef.current = skewnessResult;

      healthRef.current = ConnectionEngine.processSample(data);

      // SVM Classification
      const rms = historyRef.current[0];
      const kurt = kurtosisRef.current;
      const iso = isoRef.current;
      if (rms && kurt && iso) {
        const maxIso = Math.max(iso.vRmsX, iso.vRmsY, iso.vRmsZ);
        const featureVector = [rms.x, rms.y, rms.z, kurt.kurtosisX, kurt.kurtosisY, kurt.kurtosisZ, maxIso];
        svmClassificationRef.current = SVMClassifier.clasificarVibracion(featureVector);
      }
    }
  }, [data, status]);

  // Motor de Actualización Visual (Throttle a 10Hz/100ms para estabilidad total)
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayHistory(historyRef.current);
      setDisplayRawHistory(rawBufferRef.current);
      if (fftRef.current) {
        setDisplayFft(fftRef.current);
      }
      if (isoRef.current) {
        setDisplayIso(isoRef.current);
      }
      if (kurtosisRef.current) {
        setDisplayKurtosis(kurtosisRef.current);
      }
      if (skewnessRef.current) {
        setDisplaySkewness(skewnessRef.current);
      }
      if (healthRef.current) {
        setDisplayHealth(healthRef.current);
      }
      setDisplaySvmClassification(svmClassificationRef.current);
      setDisplaySessionPeaks({ ...sessionPeaksRef.current });
      setDisplayNormalized({ ...normalizedRef.current });
    }, 100); 

    return () => clearInterval(timer);
  }, []);

  // Motor de Logging Físico (CSV - Cada 10 segundos)
  useEffect(() => {
    const persistTimer = setInterval(() => {
      // 1. Gatekeepers Estrictos
      if (status !== STATUS.CONNECTED) return;
      
      const health = healthRef.current;
      const current = rawBufferRef.current[0];
      
      // Solo grabar si hay calidad de señal mínima (> 10%)
      if (!health || health.quality < 10 || !current) return; 

      const now = new Date().toISOString();
      const rms = historyRef.current[0];
      const kurt = kurtosisRef.current;
      const iso = isoRef.current;
      
      const maxIso = Math.max(iso?.vRmsX ?? 0, iso?.vRmsY ?? 0, iso?.vRmsZ ?? 0);
      const f = (val: number | undefined) => (val || 0).toFixed(4);

      // Clasificación para el registro
      const classification = svmClassificationRef.current;

      // Ensamblaje estricto de las 11 columnas (timestamp, rmsX, rmsY, rmsZ, kurtX, kurtY, kurtZ, velIso, temp, health, tipo)
      const csvLine = `${now},${f(rms?.x)},${f(rms?.y)},${f(rms?.z)},${f(kurt?.kurtosisX)},${f(kurt?.kurtosisY)},${f(kurt?.kurtosisZ)},${f(maxIso)},${current.diag.temp_c.toFixed(1)},${health.quality},${classification}`;
      
      fetch('/api/history/append', { method: 'POST', body: csvLine })
        .catch(err => console.error("Error grabando en disco:", err));
        
    }, 10000); 

    return () => clearInterval(persistTimer);
  }, [status]); // Quitamos 'data' para evitar resets infinitos del timer

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewView 
            data={data} 
            health={displayHealth}
            rmsData={displayHistory[0] || null}
            fftData={displayFft}
            isoData={displayIso}
            kurtosisData={displayKurtosis}
            skewnessData={displaySkewness}
            motorRpm={motorRpm}
            vibeLimits={vibeLimits}
            rmsPeaks={rmsPeaks}
            vibeData={displayNormalized}
            classification={displaySvmClassification}
          />
        );
      case 'charts':
        return (
          <ChartsView 
            data={data} 
            history={displayHistory} 
            fftData={displayFft} 
            isoData={displayIso} 
            kurtosisData={displayKurtosis} 
            skewnessData={displaySkewness} 
            motorRpm={motorRpm}
            vibeLimits={vibeLimits}
            rmsPeaks={rmsPeaks}
            fftRange={fftRange}
            classification={displaySvmClassification}
          />
        );
      case 'history':
        return <HistoryView history={displayHistory} />;
      case 'math':
        return <MathView rawHistory={displayRawHistory} rmsHistory={displayHistory} motorRpm={motorRpm} />;
      case 'raw':
        return <RawView data={data} />;
      case 'settings':
        return (
          <ConfigView 
            motorRpm={motorRpm} setMotorRpm={setMotorRpm} 
            vibeLimits={vibeLimits} setVibeLimits={setVibeLimits}
            rmsPeaks={rmsPeaks} setRmsPeaks={setRmsPeaks}
            fftRange={fftRange} setFftRange={setFftRange}
            sessionPeaks={displaySessionPeaks}
            onResetSessionPeaks={resetSessionPeaks}
          />
        );
      default:
        return (
          <OverviewView 
            data={data} 
            health={displayHealth}
            rmsData={displayHistory[0] || null}
            fftData={displayFft}
            isoData={displayIso}
            kurtosisData={displayKurtosis}
            skewnessData={displaySkewness}
            motorRpm={motorRpm}
            vibeLimits={vibeLimits}
            rmsPeaks={rmsPeaks}
            vibeData={displayNormalized}
            classification={displaySvmClassification}
          />
        );
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        data={data} 
        status={status}
        health={displayHealth}
        onConnect={onConnect}
        onDisconnect={onDisconnect} 
      />

      <main className="content-area">
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;
