import { type ESPData } from '../../../../lib/connection'

type NormalizationViewProps = {
  history: ESPData[];
};

function NormalizationView({}: NormalizationViewProps) {
  return (
    <section className="engineering-report" >
      
      {/* Encabezado del Reporte */}
      <header className="algo-header">
        <h1 className="algo-title">
          NORMALIZACIÓN EN XYZ
        </h1>
        <p className="algo-subtitle">
          Gesti&oacute;n din&aacute;mica de la componente AC/DC y supresi&oacute;n de vectores gravitatorios
        </p>
      </header>

      {/* 1.- EL PROBLEMA DE LA GRAVEDAD */}
      <div className="algo-section">
        <h2 className="algo-section-title">
          1.- Offset DC y Tecnolog&iacute;a MEMS
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            Todo aceler&oacute;metro <strong>MEMS</strong> (Micro-Electro-Mechanical Systems) como el ADXL345 integrado, detecta una aceleraci&oacute;n constante de <strong>1g (9.8 m/s<sup>2</sup>)</strong> dirigida hacia el centro de la Tierra. Esta fuerza se manifiesta como un <strong>Offset DC</strong> (corriente continua), desplazando el punto de reposo l&oacute;gico de la se&ntilde;al.
          </p>

          <div className="algo-info-grid">
            <div className="algo-box-slate">
              <strong className="algo-info-card-title">¿Qu&eacute; es el Offset DC?</strong>
              <p className="algo-info-card-desc">
                Es la componente de valor promedio de la se&ntilde;al. Representa la suma del <strong>vector gravitatorio</strong> y el <strong>Bias Error</strong> (desviaci&oacute;n residual de f&aacute;brica). Para el an&aacute;lisis de vibraci&oacute;n din&aacute;mico (AC), este valor act&uacute;a como un ruido est&aacute;tico que debe ser eliminado para evitar lecturas de energ&iacute;a falsas.
              </p>
            </div>
            <div className="algo-box-indigo">
              <strong className="algo-info-card-title">Tecnolog&iacute;a MEMS de Silicio</strong>
              <p className="algo-info-card-desc">
                Estos sensores utilizan estructuras microsc&oacute;picas de silicio que act&uacute;an como condensadores variables. Cuando existe una aceleraci&oacute;n, una "masa de prueba" se mueve, cambiando la capacitancia y permitiendo una conversi&oacute;n digital de alta fidelidad con un consumo m&iacute;nimo.
              </p>
            </div>
          </div>
          
          <div className="algo-box-danger" style={{ marginBottom: '2rem' }}>
             <strong className="algo-info-card-title" style={{ color: 'inherit', display: 'block', marginBottom: '0.5rem' }}>LIMITACI&Oacute;N DE LA CALIBRACI&Oacute;N EST&Aacute;TICA</strong>
             <p className="algo-info-card-desc" style={{ color: 'inherit' }}>
                En una instalaci&oacute;n ideal, la gravedad caer&iacute;a sobre un solo eje (ej: Z=1g, X=0, Y=0). Sin embargo, en un motor real, el sensor puede montarse con inclinaciones arbitrarias, distribuyendo el vector de 1g entre los tres ejes seg&uacute;n los <strong>cosenos directores</strong> de su orientaci&oacute;n. Una resta de "valores fijos" es in&uacute;til ante cualquier reajuste f&iacute;sico del sensor.
             </p>
          </div>
        </div>
      </div>

      {/* 2.- LA SOLUCI&Oacute;N INTELIGENTE */}
      <div className="algo-section">
        <h2 className="algo-section-title">
          2.- Diferenciaci&oacute;n de Señales AC y DC
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            El sistema DIPREMO implementa un <strong>DC Blocker</strong> (Filtro Pasa-Altas) mediante un Leaky Integrator. Este algoritmo separa la informaci&oacute;n entrante en dos dominios cr&iacute;ticos:
          </p>
          <div className="algo-info-grid">
            <div className="algo-info-card shadow-sm" style={{ borderTop: '4px solid #64748b' }}>
              <div className="algo-info-card-title" style={{ color: '#94a3b8', fontSize: '11px' }}>DOMINIO DC (EST&Aacute;TICO)</div>
              <strong className="algo-info-card-title" style={{ fontSize: '16px', color: '#334155' }}>Postura y Gravedad</strong>
              <p className="algo-info-card-desc">
                Representa la l&iacute;nea base de la se&ntilde;al. Es una componente de frecuencia casi nula que el algoritmo rastrea continuamente para identificar cu&aacute;l es el "piso" gravitatorio actual de cada eje.
              </p>
            </div>
            <div className="algo-info-card shadow-sm" style={{ borderTop: '4px solid #ef4444' }}>
              <div className="algo-info-card-title" style={{ color: '#94a3b8', fontSize: '11px' }}>DOMINIO AC (DIN&Aacute;MICO)</div>
              <strong className="algo-info-card-title" style={{ fontSize: '16px', color: '#334155' }}>Vibraci&oacute;n Industrial Real</strong>
              <p className="algo-info-card-desc">
                Son las perturbaciones de alta velocidad (desbalanceo, impactos, fricci&oacute;n). Al restar el Dominio DC del sensor crudo, aislamos puramente la energ&iacute;a vibratoria necesaria para el an&aacute;lisis predictivo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3.- C&Oacute;MO SE CALCULA */}
       <div className="report-section mb-12">
        <h2 className="algo-section-title">
          3.- Arquitectura de Filtrado en Cascada de Triple Acci&oacute;n
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            Para garantizar una telemetr&iacute;a de grado industrial libre de parpadeos en reposo, el sistema implementa una <strong>Cascada de Procesamiento</strong> en tres etapas secuenciales:
          </p>
          <div className="algo-card-light">
             <h4 className="algo-info-card-title" style={{ color: '#64748b', fontSize: '13px' }}>Fase 1: Conclave de Inicializaci&oacute;n (Calibraci&oacute;n en Fr&iacute;o)</h4>
             <p className="algo-info-card-desc" style={{ marginBottom: '1rem' }}>
                Al arrancar, el algoritmo captura una ventana de <strong>32 muestras</strong> para establecer un promediado est&aacute;tico del vector de gravedad. Esto evita el "desplazamiento de arranque" y ancla la se&ntilde;al en cero instant&aacute;neamente.
             </p>

             <h4 className="algo-info-card-title" style={{ color: '#64748b', fontSize: '13px' }}>Fase 2: Seguimiento Adaptive Low-Pass (Alpha 0.998)</h4>
             <div className="algo-code-box" style={{ marginBottom: '1rem' }}>
                <span className="algo-math-color" style={{ marginRight: '0.5rem' }}>Gravity_DC =</span> (0.998 * Gravity_DC) + (0.002 * Raw_Sample)
             </div>
             <p className="algo-info-card-desc" style={{ marginBottom: '1.5rem' }}>
                Se utiliza un <strong>Leaky Integrator</strong> de alt&iacute;sima inercia para rastrear cambios lentos en la postura (DC) sin permitir que la vibraci&oacute;n real (AC) contamine la estimaci&oacute;n de la gravedad.
             </p>

             <h4 className="algo-info-card-title" style={{ color: '#64748b', fontSize: '13px' }}>Fase 3: Supresi&oacute;n No-Lineal (Deadzone 2.5 + Smoothing 0.8)</h4>
             <div className="algo-code-box" style={{ background: '#eef2ff', color: '#4338ca', marginBottom: '1rem' }}>
                <span style={{ color: '#6366f1', marginRight: '0.5rem' }}>Vibration_AC =</span> |Raw - Gravity| &lt; 2.5 ? 0 : (Raw - Gravity)
             </div>
             <p className="algo-info-card-desc">
                Finalmente, se aplica una <strong>Zona Muerta</strong> de 2.5 LSBs para silenciar el ruido t&eacute;rmico del sensor, seguida de un segundo filtro de suavizado visual (<strong>Alpha 0.8</strong>) que "ablanda" la llegada a cero, eliminando cualquier jitter residual.
             </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NormalizationView;
