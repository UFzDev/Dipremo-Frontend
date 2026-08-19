function KurtosisView() {
  return (
    <section className="engineering-report" >
      
      {/* Encabezado del Reporte */}
      <header className="algo-header">
        <h1 className="algo-title">
          CUARTO MOMENTO ESTADÍSTICO (CURTOSIS)
        </h1>
        <p className="algo-subtitle">
          Detección temprana de fallos en rodamientos e impactos mecánicos
        </p>
      </header>

      {/* 1.- FUNDAMENTO MATEMÁTICO */}
      <div className="algo-section">
        <h2 className="algo-section-title">
          1.- ¿Qué es la Curtosis?
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            Matemáticamente, es el cuarto momento estadístico de una señal. En términos mecánicos simples, <strong>mide qué tan "puntiaguda" o "esporádica"</strong> es la distribución de tus datos de aceleración frente a una distribución normal suave (Gaussiana de valor 3).
          </p>
          
          <div className="algo-math-box-lg">
            <div className="math-container">
              <span>K</span>
              <span className="math-op">=</span>
              <div className="math-frac">
                <div className="math-frac-num" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="math-sum" style={{ fontSize: '0.8em' }}>
                    <span className="math-sum-sym">&Sigma;</span>
                  </div>
                  <span className="math-paren">(</span>
                  <span>x<span className="math-sub">i</span> - &mu;</span>
                  <span className="math-paren">)</span>
                  <span className="math-sup" style={{ top: '-0.25em' }}>4</span>
                </div>
                <div className="math-frac-den">
                  <span>N &middot; &sigma;<span className="math-sup" style={{ top: '-0.25em' }}>4</span></span>
                </div>
              </div>
            </div>
          </div>
          <div className="algo-info-grid algo-box-slate" style={{ marginTop: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div><strong className="text-blue-dark">K:</strong> Valor de Curtosis.</div>
            <div><strong className="text-blue-dark">x<span className="math-sub">i</span>:</strong> Valor de la muestra.</div>
            <div><strong className="text-blue-dark">&mu;:</strong> Media de la señal.</div>
            <div><strong className="text-blue-dark">&sigma;:</strong> Desviación estándar.</div>
          </div>
          
          <h3 className="algo-info-card-title" style={{ marginTop: '2rem' }}>El Proceso Estadístico</h3>
          <p className="algo-text">
            Calculamos la diferencia entre cada punto y el promedio. Esto hace que los valores normales (pequeños) desaparezcan, mientras que los impactos (grandes) se magnifiquen masivamente. Finalmente, normalizamos el resultado para obtener un índice puro de salud de rodamientos.
          </p>
        </div>
      </div>

      {/* 2.- LA MAGIA VS RMS */}
      <div className="algo-section">
        <h2 className="algo-section-title">
          2.- ¿Por qu&eacute; es importante en el proyecto?
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            La magia pura de la curtosis radica en que es prácticamente <strong>insensible a los cambios masivos de RPM o carga pesada</strong> del motor, pero explota de dolor ante mínimos impactos metálicos como un rodamiento crujiendo.
          </p>
          <div className="algo-info-grid">
            <div className="algo-box-danger">
              <div className="algo-info-card-title" style={{ color: 'inherit' }}>EL FALLO DEL RMS (ENGAÑO)</div>
              <p className="algo-info-card-desc" style={{ color: 'inherit' }}>
                Cuando una bola de rodamiento tiene un <strong>micro-pitting</strong> (una fisura miniatura), choca metálicamente y genera picos violentos. Pero al ser tan cortos (milisegundos), al promediarse matemáticamente bajo raíz cuadrática, <strong>no tienen peso total para mover el RMS general</strong>. La gráfica de daños severos se verá absurdamente "Sana y Verde".
              </p>
            </div>
            <div className="algo-box-warning">
              <div className="algo-info-card-title" style={{ color: 'inherit' }}>LA EXPOSICI&Oacute;N DE LA CURTOSIS</div>
              <p className="algo-info-card-desc" style={{ color: 'inherit' }}>
                Elevamos la ecuaci&oacute;n a la <strong>cuarta potencia (x<sup>4</sup>)</strong>. Los temblores normales suaves (<strong>~= 1</strong>) se mantienen bajos (<strong>1<sup>4</sup> = 1</strong>), pero ese micro pico violento (<strong>~= 10</strong>) explota de inmediato (<strong>10<sup>4</sup> = 10,000</strong>). La campana matem&aacute;tica se deforma y grita la alerta en nuestro panel antes de que la m&aacute;quina siquiera empieza a calentarse.
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
            Pr&aacute;cticamente el motor genera una distribuci&oacute;n gaussiana de los &uacute;ltimos datos recolectados. Cuando se detecta una anomal&iacute;a estad&iacute;stica fuera de lo normal, es cuando el &iacute;ndice salta:
          </p>
          
          <div className="algo-card-dark">
             <h4 className="algo-threshold-row mb-1">
                <span className="text-emerald">K=3.0</span> Estado de Salud Plena (Ruido Gausiano Natural)
             </h4>
             <h4 className="algo-threshold-row mb-1">
                <span className="text-amber">K=3.5</span> Alarma de Micro-fisuras incipientes (Warning)
             </h4>
             <h4 className="algo-threshold-row mb-0.5">
                <span className="text-rose">K=10.0</span> Fallo Catastr&oacute;fico del Balero / Impactos puros (Danger)
             </h4>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

export default KurtosisView;
