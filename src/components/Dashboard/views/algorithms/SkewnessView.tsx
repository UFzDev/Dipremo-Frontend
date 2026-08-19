function SkewnessView() {
  return (
    <section className="engineering-report" >
      
      {/* Encabezado del Reporte */}
      <header className="algo-header">
        <h1 className="algo-title">
          TERCER MOMENTO ESTADÍSTICO (ASIMETRÍA)
        </h1>
        <p className="algo-subtitle">
          Monitoreo direccional de holguras y aflojamientos
        </p>
      </header>

      {/* 1.- FUNDAMENTO MATEMÁTICO */}
      <div className="algo-section">
        <h2 className="algo-section-title">
          1.- ¿Qué es la Asimetría (Skewness)?
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            Mientras el <strong>RMS</strong> te dice "cuánta fuerza" tiene la vibración y la <strong>Curtosis</strong> te advierte sobre "impactos agudos" metálicos, la <strong>Asimetría</strong> (Tercer momento) extrae de la física pura qué tan balanceada está la oscilación alrededor del punto mecánico muerto.
          </p>
          
          <div className="algo-math-box-lg">
            <div className="math-container">
              <span>S</span>
              <span className="math-op">=</span>
              <div className="math-frac">
                <div className="math-frac-num" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="math-sum" style={{ fontSize: '0.8em' }}>
                    <span className="math-sum-sym">&Sigma;</span>
                  </div>
                  <span className="math-paren">(</span>
                  <span>x<span className="math-sub">i</span> - &mu;</span>
                  <span className="math-paren">)</span>
                  <span className="math-sup" style={{ top: '-0.25em' }}>3</span>
                </div>
                <div className="math-frac-den">
                  <span>N &middot; &sigma;<span className="math-sup" style={{ top: '-0.25em' }}>3</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="algo-info-grid algo-box-slate" style={{ marginTop: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div><strong className="text-blue-dark">S:</strong> Valor de Asimetría (Skewness).</div>
            <div><strong className="text-blue-dark">x<span className="math-sub">i</span>:</strong> Valor de la muestra.</div>
            <div><strong className="text-blue-dark">&mu;:</strong> Media de la señal.</div>
            <div><strong className="text-blue-dark">&sigma;:</strong> Desviación estándar.</div>
          </div>
          
          <h3 className="algo-info-card-title" style={{ marginTop: '2rem' }}>El Análisis de Direccionalidad</h3>
          <p className="algo-text">
            A diferencia del RMS, el Skewness usa el <strong>cubo de la señal</strong>. Al elevar al cubo, los valores negativos permanecen negativos. Si el resultado final no es cero, significa que la máquina está "golpeando" más hacia un lado que hacia otro (asimetría), lo que es un síntoma clásico de holgura mecánica o bases sueltas.
          </p>
        </div>
      </div>

      {/* 2.- TRANSCENDENCIA EN EL PROYECTO */}
      <div className="algo-section">
        <h2 className="algo-section-title">
          2.- ¿Por qu&eacute; es importante en el proyecto?
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            El Skewness detecta comportamientos err&aacute;ticos mec&aacute;nicos que pasan completamente debajo del radar (o invisibles) en los otros an&aacute;lisis gausianos del software.
          </p>
          <div className="algo-info-grid">
            <div className="algo-box-info">
               <div className="algo-info-card-title">Pernos Sueltos o Bases Rotas</div>
               <p className="algo-info-card-desc">
                 Cuando la bancada est&aacute; aflojada de un solo lado, el motor en vez de vibrar choca como un rebote contra el suelo o su tope de un lado. Eso es altamente asim&eacute;trico e indica que se est&aacute; jalando el equipo o hay un amortiguamiento asim&eacute;trico en la pata de soporte.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3.- EJECUCI&Oacute;N PR&Aacute;CTICA */}
      <div className="report-section mb-12">
        <h2 className="algo-section-title">
          3.- C&Oacute;MO SE USA EN EL PROYECTO
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            Nuestra br&uacute;jula bidireccional computa lo anterior en vivo usando l&iacute;mites absolutos |S| &ge; 1.0:
          </p>
          
          <div className="algo-card-dark">
             <h4 className="algo-threshold-row mb-1">
                <span className="text-emerald">|S| {'<'} 0.5 (Sano)</span> Dinámica Simétrica Balanceada.
             </h4>
             <h4 className="algo-threshold-row mb-1">
                <span className="text-amber">|S| {'>'} 0.5 (Alerta)</span> Desviación Ligera.
             </h4>
             <h4 className="algo-threshold-row mb-0.5">
                <span className="text-rose">|S| {'>'} 1.0 (Daño Crítico)</span> Holgura o choque Unidireccional.
             </h4>
          </div>
        </div>
      </div>

    </section>
  );
}

export default SkewnessView;
