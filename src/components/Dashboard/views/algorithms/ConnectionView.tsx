function ConnectionView() {
  return (
    <section className="engineering-report" >
      
      {/* Encabezado del Reporte */}
      <header className="algo-header">
        <h1 className="algo-title">
          DIAGN&Oacute;STICO DE INTEGRIDAD DE RED
        </h1>
        <p className="algo-subtitle">
          Validaci&oacute;n de flujo de telemetr&iacute;a mediante an&aacute;lisis de paquetes y jitter temporal
        </p>
      </header>

      {/* 1.- FUNDAMENTO T&Eacute;CNICO */}
      <div className="algo-section">
        <h2 className="algo-section-title">
          1.- &iquest;C&oacute;mo se calcula la salud de la conexi&oacute;n?
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            Dado que el valor RSSI de hardware puede ser impreciso o nulo en entornos industriales, implementamos un diagn&oacute;stico basado en la <strong>Integridad de la Secuencia</strong>. Cada paquete de datos enviado por la ESP32 viaja con un n&uacute;mero de serie &uacute;nico e incremental.
          </p>
          
          <div className="algo-math-box-lg">
            <svg width="420" height="100" viewBox="0 0 420 100" className="algo-math-svg">
              <defs>
                <style>{`
                  .math-main { font-family: "Times New Roman", Times, serif; font-style: italic; font-size: 28px; fill: #1a202c; }
                  .math-op { font-family: "Times New Roman", Times, serif; font-size: 28px; fill: #1a202c; }
                  .math-text { font-family: "Inter", sans-serif; font-size: 14px; fill: #4a5568; }
                `}</style>
              </defs>
              <text x="20" y="55" className="math-main">Salud (%)</text>
              <text x="140" y="55" className="math-op">=</text>
              
              <text x="180" y="35" className="math-text">Paquetes Recibidos</text>
              <line x1="170" y1="45" x2="330" y2="45" stroke="#1a202c" strokeWidth="1.5" />
              <text x="180" y="75" className="math-text">Paquetes Esperados</text>
              
              <text x="345" y="55" className="math-op">&times; 100</text>
            </svg>
          </div>

          <p className="algo-text-last">
            Al recibir los datos, el sistema detecta de forma inmediata cualquier interrupci&oacute;n en la secuencia (por ejemplo, si el &uacute;ltimo paquete recibido fue el 100 y el actual es el 110, se registra una p&eacute;rdida de 9 paquetes). Esta relaci&oacute;n nos permite determinar la <strong>eficiencia real del enlace</strong> independientemente de la potencia de radio.
          </p>
        </div>
      </div>

      {/* 2.- IMPACTO INDUSTRIAL */}
      <div className="algo-section">
        <h2 className="algo-section-title">
          2.- &iquest;Por qu&eacute; es vital este diagn&oacute;stico?
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            Un flujo de datos interrumpido o "pausado" contamina los algoritmos matem&aacute;ticos m&aacute;s que el propio ruido del sensor:
          </p>
          <div className="algo-info-grid">
            <div className="algo-box-danger">
              <div className="algo-info-card-title">ARTEFACTOS EN LA FFT</div>
              <p className="algo-info-card-desc" style={{ color: 'inherit' }}>
                La FFT asume una se&ntilde;al continua. Los huecos en la red act&uacute;an como "golpes" matem&aacute;ticos que ensucian el espectro, creando picos falsos en altas frecuencias.
              </p>
            </div>
            <div className="algo-box-warning">
              <div className="algo-info-card-title">DERIVA POR JITTER</div>
              <p className="algo-info-card-desc" style={{ color: 'inherit' }}>
                Las variaciones en el tiempo de llegada (Jitter) alteran el c&aacute;lculo de la integral de velocidad, provocando que los medidores ISO se vuelvan inestables.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* 3.- APLICACI&Oacute;N DEL DIAGN&Oacute;STICO */}
      <div className="report-section mb-12">
        <h2 className="algo-section-title">
          3.- &iquest;C&oacute;mo utilizamos la salud de conexi&oacute;n?
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            La salud de la conexi&oacute;n no es solo un indicador visual, es una condici&oacute;n de entrada para la validez de los diagn&oacute;sticos avanzados:
          </p>
          <div className="algo-info-grid">
            <div className="algo-box-info">
              <p className="algo-info-card-desc">
                <strong>Filtrado de Alertas:</strong> Cuando el sistema detecta una salud de conexi&oacute;n inestable, se activan advertencias de confiabilidad en los indicadores de FFT y Velocidad ISO 10816.
              </p>
            </div>
            <div className="algo-box-indigo">
              <p className="algo-info-card-desc">
                <strong>Ajuste de Visualizaci&oacute;n:</strong> El dashboard ajusta din&aacute;micamente la frecuencia de refresco para priorizar la estabilidad de las gr&aacute;ficas sobre la inmediatez.
              </p>
            </div>
            <div className="algo-box-slate">
              <p className="algo-info-card-desc">
                <strong>Protocolo de Mantenimiento:</strong> Una salud por debajo del 60% genera un bloqueo preventivo en la certificaci&oacute;n de mediciones f&iacute;sicas.
              </p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

export default ConnectionView;
