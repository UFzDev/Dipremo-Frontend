type FFTViewProps = {
  motorRpm: number;
};

function FFTView({ motorRpm }: FFTViewProps) {
  return (
    <section className="engineering-report">
      
      {/* Encabezado del Reporte */}
      <header className="algo-header">
        <h1 className="algo-title">
          TRANSFORMADA R&Aacute;PIDA DE FOURIER (FFT)
        </h1>
        <p className="algo-subtitle">
          An&aacute;lisis Espectral y Detecci&oacute;n de Patrones Mec&aacute;nicos a 100 Hz
        </p>
      </header>

      <div className="algo-section-content">
        <p className="algo-text-primary">
          La <strong>FFT</strong> es un algoritmo optimizado para calcular la Transformada Discreta de Fourier (DFT). Su principio fundamental es que cualquier señal compleja en el tiempo (como el "ruido" de un motor) puede descomponerse en una suma de ondas senoidales simples de diferentes frecuencias, amplitudes y fases.
        </p>
        
        <h3 className="algo-info-card-title">La Ecuación de Base</h3>
        
        <p className="algo-text">
          Para una serie de <strong>N</strong> muestras de aceleración <strong>x(n)</strong>, el espectro de frecuencias <strong>X(k)</strong> se calcula mediante:
        </p>

        <div className="algo-math-box-lg">
          <div className="math-container">
            <span>X(k)</span>
            <span className="math-op">=</span>
            <div className="math-sum">
              <span className="math-sum-limit">N-1</span>
              <span className="math-sum-sym">&Sigma;</span>
              <span className="math-sum-limit">n=0</span>
            </div>
            <span>x(n) &middot; e</span>
            <div className="math-sup" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', top: '-1em' }}>
              <span>-j</span>
              <div className="math-frac" style={{ fontSize: '0.7em' }}>
                <span className="math-frac-num" style={{ borderBottomWidth: '1px' }}>2&pi;</span>
                <span className="math-frac-den">N</span>
              </div>
              <span>kn</span>
            </div>
          </div>
        </div>
        
        <div className="algo-info-grid algo-box-slate" style={{ marginTop: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div><strong className="text-blue-dark">X(k):</strong> Magnitud de señal en frecuencia.</div>
          <div><strong className="text-blue-dark">x(n):</strong> Valor de la muestra en tiempo n.</div>
          <div><strong className="text-blue-dark">e:</strong> Base natural.</div>
          <div><strong className="text-blue-dark">-j:</strong> Unidad imaginaria o rotación.</div>
          <div><strong className="text-blue-dark">2&pi;/N:</strong> Resolución angular por muestra.</div>
          <div><strong className="text-blue-dark">kn:</strong> Producto de índices de correlación.</div>
        </div>
        
        <h3 className="algo-info-card-title" style={{ marginTop: '2rem' }}>El Proceso de Transformación</h3>
        <p className="algo-text">
          Matemáticamente, la FFT correlaciona la señal de tiempo con una serie de ondas complejas (senoidales). Si la señal "vibra" de forma similar a una de estas ondas, el resultado de la sumatoria explota en un <strong>Pico Espectral</strong>, indicando presencia de energía en esa frecuencia exacta.
        </p>
        
        <h3 className="algo-info-card-title">El Proceso de Optimización</h3>
        <p className="algo-text">
          La DFT original requiere <strong>N<sup>2</sup></strong> operaciones. La FFT (algoritmo de Cooley-Tukey) reduce esto a <strong>N log<sub>2</sub> N</strong>. Para un bloque de 1024 datos, pasamos de 1,048,576 operaciones a solo 10,240. Esta eficiencia matemática es lo que permite que el análisis espectral ocurra en "tiempo real".
        </p>
      </div>

      {/* 2.- IMPORTANCIA */}
      <div className="algo-section">
        <h2 className="algo-section-title">
          2.- ¿Por qué es importante?
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            En el mantenimiento industrial, el dominio del tiempo indica que la máquina vibra anormalmente, pero no indica <em>por qué</em>. La importancia de la FFT radica en la visualización de la <strong>Firma Vibratoria</strong>:
          </p>
          <div className="algo-info-grid">
            <div className="algo-box-danger">
              <div className="algo-info-card-title">AISLAMIENTO DE FALLAS</div>
              <p className="algo-info-card-desc">Los problemas mecánicos no ocurren al azar; tienen "domicilios" fijos predecibles en el espectro de frecuencias analizado.</p>
            </div>
            <div className="algo-box-success">
              <div className="algo-info-card-title">DETECCIÓN PRECOZ</div>
              <p className="algo-info-card-desc">Fallas incipientes (ej. rodamientos) generan señales muy débiles que el RMS omite, pero en la FFT saltan como picos aislados de alta frecuencia.</p>
            </div>
            <div className="algo-box-warning">
              <div className="algo-info-card-title">LIMPIEZA DE DATOS</div>
              <p className="algo-info-card-desc">Permite ignorar el ruido eléctrico a 50/60Hz o vibraciones de fondo parásitas de otras máquinas que alteran la lectura del motor objetivo.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3.- CÓMO SE USA EN EL PROYECTO */}
      <div className="report-section mb-12">
        <h2 className="algo-section-title">
          3.- CÓMO SE USA EN EL PROYECTO
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            El análisis FFT es el cerebro detrás de tus diagnósticos. Sigue un pipeline de procesamiento de cuatro etapas para convertir vibración cruda en información accionable:
          </p>
          
          <div className="algo-list-grid">
            
            <div className="algo-num-step-card">
              <div className="algo-num-step-badge bg-violet">1</div>
              <div className="algo-num-step-content">
                <strong className="algo-num-step-title">Preparación</strong>
                <p className="algo-num-step-desc" >Antes del cálculo, suavizamos los bordes de la señal para evitar el "leakage" (fugas de energía). Esto garantiza que los picos en la gráfica sean reales y no errores matemáticos.</p>
              </div>
            </div>

            <div className="algo-num-step-card">
              <div className="algo-num-step-badge bg-blue">2</div>
              <div className="algo-num-step-content">
                <strong className="algo-num-step-title">Transformación al Espectro</strong>
                <p className="algo-num-step-desc">El motor descompone la señal compleja en un mapa de frecuencias. Aquí es donde descubrimos qué componentes (RPM, Poleas, Baleros) están aportando energía destructiva al motor.</p>
              </div>
            </div>

            <div className="algo-num-step-card">
              <div className="algo-num-step-badge bg-cyan">3</div>
              <div className="algo-num-step-content">
                <strong className="algo-num-step-title">Mapeo de Frecuencias y Magnitud</strong>
                <p className="algo-num-step-desc">Calculamos la magnitud real (energía) de cada pico. El sistema sitúa la <strong>Referencia 1X en {(motorRpm / 60).toFixed(1)} Hz</strong> (basado en tus {motorRpm} RPM) para una lectura físicamente precisa del estado del activo.</p>
              </div>
            </div>

            <div className="algo-num-step-card">
              <div className="algo-num-step-badge bg-emerald">4</div>
              <div className="algo-num-step-content">
                <strong className="algo-num-step-title">Diagnóstico Industrial Automático</strong>
                <p className="algo-num-step-desc">Finalmente, cruzamos los picos con las cinemáticas mecánicas: 1X para desbalanceo, 2X para desalineación y bandas de alta frecuencia para fallas inminentes de rodamientos.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}

export default FFTView;
