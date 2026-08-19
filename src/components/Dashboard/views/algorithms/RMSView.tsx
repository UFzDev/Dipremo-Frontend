function RMSView() {
  return (
    <section className="engineering-report" >
      
      {/* Encabezado del Reporte */}
      <header className="algo-header">
        <h1 className="algo-title">
          VALOR CUADR&Aacute;TICO MEDIO (RMS)
        </h1>
        <p className="algo-subtitle">
          Implementaci&oacute;n de M&eacute;trica de Energ&iacute;a y Potencia en Vibraci&oacute;n Mec&aacute;nica
        </p>
      </header>

      {/* 1.- DEFINICI&Oacute;N Y FUNDAMENTO */}
      <div className="algo-section">
        <h2 className="algo-section-title">
          1.- &iquest;Qu&eacute; es el Valor Cuadr&aacute;tico Medio (RMS)?
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            El RMS (Root Mean Square) es una medida estad&iacute;stica de la magnitud de una cantidad variable. En ingenier&iacute;a, se utiliza para obtener un valor constante que represente la potencia o energ&iacute;a de una se&ntilde;al que cambia r&aacute;pidamente en el tiempo.
          </p>
          
          <h3 className="algo-info-card-title">Fundamento Matem&aacute;tico</h3>
          <div className="algo-math-box-lg">
            <div className="math-container">
              <span>X<span className="math-sub">RMS</span></span>
              <span className="math-op">=</span>
              <div className="math-sqrt">
                <span className="math-sqrt-sym">&radic;</span>
                <div className="math-sqrt-content">
                  <div className="math-frac">
                    <span className="math-frac-num">1</span>
                    <span className="math-frac-den">N</span>
                  </div>
                  <div className="math-sum">
                    <span className="math-sum-limit">N</span>
                    <span className="math-sum-sym">&Sigma;</span>
                    <span className="math-sum-limit">i=1</span>
                  </div>
                  <span>x<span className="math-sub">i</span><span className="math-sup">2</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <p style={{ fontSize: '14px', marginBottom: '1rem', marginTop: '2rem' }}>El proceso matem&aacute;tico consta de tres etapas:</p>
          <ul style={{ paddingLeft: '1.5rem', fontSize: '14px', lineHeight: '1.8' }}>
            <li><strong>Cuadrado (Square):</strong> Se eleva cada lectura al cuadrado, asegurando que todos los valores sean positivos.</li>
            <li><strong>Media (Mean):</strong> Se calcula el promedio de los cuadrados en un intervalo de tiempo definido por N.</li>
            <li><strong>Ra&iacute;z (Root):</strong> Se aplica la ra&iacute;z cuadrada para retornar el resultado a las unidades originales de medida.</li>
          </ul>
        </div>
      </div>

      {/* 2.- IMPORTANCIA EN EL PROYECTO */}
      <div className="algo-section">
        <h2 className="algo-section-title">
          2.- Por qu&eacute; es importante en el proyecto
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            La importancia del RMS radica en que es la m&eacute;trica que representa fielmente el contenido energ&eacute;tico de la se&ntilde;al.
          </p>
          <div className="algo-info-grid">
            <div className="algo-box-info">
              <div className="algo-info-card-title" style={{ color: 'inherit' }}>EVITA LA CANCELACI&Oacute;N</div>
              <p className="algo-info-card-desc" style={{ color: 'inherit' }}>Al promediar una vibraci&oacute;n pura, el promedio simple resulta cercano a cero. El RMS asegura que cada movimiento sume a la magnitud total.</p>
            </div>
            <div className="algo-box-success">
              <div className="algo-info-card-title" style={{ color: 'inherit' }}>CONTENIDO ENERG&Eacute;TICO</div>
              <p className="algo-info-card-desc" style={{ color: 'inherit' }}>La energ&iacute;a mec&aacute;nica es proporcional al cuadrado de la amplitud. El RMS es el indicador directo de la energ&iacute;a disipada.</p>
            </div>
            <div className="algo-box-warning">
              <div className="algo-info-card-title" style={{ color: 'inherit' }}>ESTABILIDAD OPERATIVA</div>
              <p className="algo-info-card-desc" style={{ color: 'inherit' }}>A diferencia del valor "Pico", el RMS promedia el comportamiento para detectar cambios reales en la condici&oacute;n mec&aacute;nica.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3.- C&Oacute;MO LO USAREMOS NOSOTROS */}
      <div className="report-section mb-12">
        <h2 className="algo-section-title">
          3.- C&Oacute;MO SE USA EN EL PROYECTO
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            En el sistema de monitoreo, el RMS se aplica para tres funciones cr&iacute;ticas:
          </p>
          <div className="algo-info-grid">
            <div className="algo-stage-card">
              <strong className="algo-info-card-title">A. Determinaci&oacute;n de la Severidad Vibratoria</strong>
              <p className="algo-info-card-desc">Permite definir el estado de salud de la m&aacute;quina. Un RMS elevado indica la presencia de problemas estructurales reales.</p>
            </div>
            <div className="algo-stage-card">
              <strong className="algo-info-card-title">B. Establecimiento de L&iacute;mites de Alerta</strong>
              <p className="algo-info-card-desc">Acomoda umbrales l&oacute;gicos de operaci&oacute;n: Zonas de funcionamiento normal, alerta por incremento y peligro cr&iacute;tico.</p>
            </div>
            <div className="algo-stage-card">
              <strong className="algo-info-card-title">C. An&aacute;lisis de Tendencia</strong>
              <p className="algo-info-card-desc">Registra la evoluci&oacute;n temporal de la energ&iacute;a. Facilita la predicci&oacute;n de fallas mediante el seguimiento del incremento gradual de vibraci&oacute;n.</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

export default RMSView;
