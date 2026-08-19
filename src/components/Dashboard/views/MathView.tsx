import { useState } from 'react'
import '../../../styles/algorithms.css'

// Sub-vistas (Algoritmos)
import SensorReadingView from './algorithms/SensorReadingView'
import NormalizationView from './algorithms/NormalizationView'
import RMSView from './algorithms/RMSView'
import FFTView from './algorithms/FFTView'
import IntegrationView from './algorithms/IntegrationView'
import KurtosisView from './algorithms/KurtosisView'
import SkewnessView from './algorithms/SkewnessView'
import ConnectionView from './algorithms/ConnectionView'
import SVMView from './algorithms/SVMView'
import { type ESPData } from '../../../lib/connection'
import { type RMSData } from '../../../lib/algorithms/RMSEngine'

type MathViewProps = {
  rawHistory: ESPData[];
  rmsHistory: RMSData[];
  motorRpm: number;
};

type SubTab = 'reading' | 'connection' | 'normalization' | 'rms' | 'fft' | 'integration' | 'kurtosis' | 'skewness' | 'svm';

function MathView({ rawHistory, motorRpm }: MathViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('reading');

  const renderAlgo = () => {
    switch (activeSubTab) {
      case 'reading':
        return <SensorReadingView />;
      case 'normalization':
        return <NormalizationView history={rawHistory} />;
      case 'rms':
        return <RMSView />;
      case 'fft':
        return <FFTView motorRpm={motorRpm} />;
      case 'integration':
        return <IntegrationView />;
      case 'kurtosis':
        return <KurtosisView />;
      case 'skewness':
        return <SkewnessView />;
      case 'connection':
        return <ConnectionView />;
      case 'svm':
        return <SVMView />;
      default:
        return <SensorReadingView />;
    }
  };

  return (
    <section>
      <div className="tabs-inner">
        <div 
          className={`tab-inner-item ${activeSubTab === 'reading' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('reading')}
        >
          Lectura del Sensor
        </div>
        <div 
          className={`tab-inner-item ${activeSubTab === 'connection' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('connection')}
        >
          Diagnóstico Red
        </div>
        <div 
          className={`tab-inner-item ${activeSubTab === 'normalization' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('normalization')}
        >
          Normalización
        </div>
        <div 
          className={`tab-inner-item ${activeSubTab === 'rms' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('rms')}
        >
          Análisis RMS
        </div>
        <div 
          className={`tab-inner-item ${activeSubTab === 'fft' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('fft')}
        >
          Transformada FFT
        </div>
        <div 
          className={`tab-inner-item ${activeSubTab === 'integration' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('integration')}
        >
          Velocidad ISO
        </div>
        <div 
          className={`tab-inner-item ${activeSubTab === 'kurtosis' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('kurtosis')}
        >
          Curtosis
        </div>
        <div 
          className={`tab-inner-item ${activeSubTab === 'skewness' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('skewness')}
        >
          Asimetría
        </div>
        <div 
          className={`tab-inner-item ${activeSubTab === 'svm' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('svm')}
          style={{ background: activeSubTab === 'svm' ? '#f5f3ff' : 'transparent', color: activeSubTab === 'svm' ? '#7c3aed' : 'inherit' }}
        >
          Clasificación IA
        </div>
      </div>

      <div className="algo-content" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        {renderAlgo()}
      </div>
    </section>
  );
}

export default MathView;
