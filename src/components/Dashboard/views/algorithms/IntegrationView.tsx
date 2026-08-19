function IntegrationView() {
  return (
    <section className="engineering-report">
      
      {/* Encabezado del Reporte */}
      <header className="algo-header">
        <h1 className="algo-title">
          INTEGRACI&Oacute;N NUM&Eacute;RICA Y VELOCIDAD (ISO 10816)
        </h1>
        <p className="algo-subtitle">
          Conversi&oacute;n de Aceleraci&oacute;n a Velocidad mediante la Regla del Trapezoide
        </p>
      </header>

      {/* 1.- FUNDAMENTO MATEMÁTICO */}
      <div className="algo-section">
        <h2 className="algo-section-title">
          1.- ¿Qu&eacute; es el algoritmo de Integraci&oacute;n Num&eacute;rica?
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            Es el proceso matem&aacute;tico de convertir la señal de <strong>Aceleración (m/s²)</strong> que entrega el ADXL345, en una señal de <strong>Velocidad (mm/s)</strong>. En t&eacute;rminos de cálculo diferencial puro, la velocidad es la integral de la aceleraci&oacute;n respecto al tiempo:
          </p>
          
          <div className="algo-math-box algo-math-text-24 algo-math-normal algo-math-symbol">
             v(t) = ∫ a(t) dt
          </div>
          
          <p className="algo-text">
            Dado que la arquitectura DIPREMO procesa data discreta fragmentada (puntos vectoriales en el JSON) y no un continuo, empleamos la t&aacute;ctica de cálculo conocida como la <strong>Regla del Trapezoide</strong>:
          </p>

          <div className="algo-math-box-lg">
            <div className="math-container">
              <span>v<span className="math-sub">n</span></span>
              <span className="math-op">=</span>
              <span>v<span className="math-sub">n-1</span></span>
              <span className="math-op">+</span>
              <span className="math-paren">(</span>
              <div className="math-frac">
                <span className="math-frac-num">a<span className="math-sub">n</span> + a<span className="math-sub">n-1</span></span>
                <span className="math-frac-den">2</span>
              </div>
              <span className="math-paren">)</span>
              <span className="math-op">&middot;</span>
              <span>&Delta;t</span>
            </div>
          </div>
          
          <div className="algo-info-grid algo-box-slate" style={{ marginTop: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div><strong className="text-blue-dark">v<span className="math-sub">n</span>:</strong> Velocidad actual calculada.</div>
            <div><strong className="text-blue-dark">v<span className="math-sub">n-1</span>:</strong> Velocidad del punto anterior.</div>
            <div><strong className="text-blue-dark">a<span className="math-sub">n</span>:</strong> Aceleraci&oacute;n en el instante actual.</div>
            <div><strong className="text-blue-dark">a<span className="math-sub">n-1</span>:</strong> Aceleraci&oacute;n inmediata previa.</div>
            <div><strong className="text-blue-dark">2:</strong> Promedio de base (Trapezoide).</div>
            <div><strong className="text-blue-dark">&Delta;t:</strong> Tiempo entre muestras (1/Fs).</div>
          </div>

          <h3 className="algo-info-card-title" style={{ marginTop: '2rem' }}>El Proceso de Integraci&oacute;n</h3>
          <p className="algo-text">
            Este m&eacute;todo "suma &aacute;reas". Imaginamos que cada par de lecturas de aceleraci&oacute;n forma un trapecio con el eje del tiempo. Al calcular el &aacute;rea de ese trapecio y sumarla a la velocidad anterior (<em>v<sub>n-1</sub></em>), obtenemos el nuevo valor de velocidad, permitiendo ver el movimiento real de la m&aacute;quina m&aacute;s all&aacute; de su fuerza de impacto.
          </p>
        </div>
      </div>

      {/* 2.- IMPORTANCIA */}
      <div className="algo-section">
        <h2 className="algo-section-title">
          2.- ¿Por qu&eacute; es importante en el proyecto?
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            Esta componente es la piedra angular que cataloga a DIPREMO como un software de monitoreo profesional, respaldado por las m&eacute;tricas de fiabilidad ISO:
          </p>
          <div className="algo-info-grid">
            <div className="algo-box-success">
              <div className="algo-info-card-title">A. EL LENGUAJE DE LA NORMA ISO 10816</div>
              <p className="algo-info-card-desc">
                Los est&aacute;ndares industriales oficiales mundiales exigen una medida en <strong>Velocidad RMS</strong>. Para poder diagnosticar y disparar un sem&aacute;foro de alerta, es necesario conseguir un vector num&eacute;rico de mm/s puro.
              </p>
            </div>
            <div className="algo-box-warning">
              <div className="algo-info-card-title">B. DETECCI&Oacute;N DE DA&Ntilde;OS CATASTR&Oacute;FICOS</div>
              <p className="algo-info-card-desc">
                Mientras la aceleraci&oacute;n identifica daños en frecuencias altas, <strong>la velocidad detecta el espectro de baja frecuencia</strong> donde subyacen los mayores problemas mec&aacute;nicos como el desbalanceo y fallas estructurales.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3.- FLUJO DE APLICACIÓN */}
      <div className="report-section mb-12">
        <h2 className="algo-section-title">
          3.- C&Oacute;MO SE USA EN EL PROYECTO
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            Al delegar esto directamente en la PC, obtenemos integraciones de alta precisi&oacute;n en tiempo real de la siguiente manera operativa:
          </p>
          
          <div className="algo-list-grid">
            
            <div className="algo-num-step-card">
              <div className="algo-num-step-badge bg-blue">1</div>
              <div className="algo-num-step-content">
                <strong className="algo-num-step-title">Limpieza DC Previa</strong>
                <p className="algo-num-step-desc">Utilizamos el motor de normalizaci&oacute;n del sistema para centrar a cero. Evita el mortal error matem&aacute;tico de "derivar hasta el infinito" al integrar.</p>
              </div>
            </div>

            <div className="algo-num-step-card">
              <div className="algo-num-step-badge bg-violet">2</div>
              <div className="algo-num-step-content">
                <strong className="algo-num-step-title">Conversi&oacute;n Gravitatoria</strong>
                <p className="algo-num-step-desc">La magnitud bruta viene en <strong>g</strong> (Fuerza G). La multiplicamos por <strong>9806.65</strong> para transformarla a <strong>mm/s&sup2;</strong>.</p>
              </div>
            </div>

            <div className="algo-num-step-card">
              <div className="algo-num-step-badge bg-cyan">3</div>
              <div className="algo-num-step-content">
                <strong className="algo-num-step-title">Regla del Trapezoide y vRMS</strong>
                <p className="algo-num-step-desc">Los bloques del JSON se encadenan inyectando el valor anterior. Sobre ese nuevo buffer de velocidad en mm/s, activamos el algoritmo ya programado de RMS.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}

export default IntegrationView;
