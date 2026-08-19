import { MODELO_SVM } from '../../../../lib/algorithms/SVMClassifier'

type SVMViewProps = {
    // Podríamos pasar los datos en tiempo real aquí si quisiéramos mostrar el cálculo vivo
};

function SVMView({}: SVMViewProps) {
  const f = (n: number) => n.toFixed(6);

  return (
    <section className="engineering-report">
      <header className="algo-header">
        <h1 className="algo-title">Clasificación IA: SVM Lineal</h1>
        <p className="algo-subtitle">
          Procesamiento en tiempo real mediante Máquinas de Vector de Soporte (Inferencia en Navegador)
        </p>
      </header>

      <div className="report-section mb-12">
        <h2 className="algo-section-title">1.- Arquitectura de Inferencia (Client-Side)</h2>
        <div className="algo-section-content">
          <p className="algo-text">
            A diferencia de sistemas que dependen de una API en la nube, este motor ejecuta la inferencia directamente en el hilo de ejecución de la aplicación web. Esto garantiza latencia cero y privacidad de datos industriales.
          </p>
          <div className="algo-box-info">
            <p className="algo-info-card-desc" style={{ color: 'inherit', margin: 0 }}>
              <strong>Modelo:</strong> SVM Lineal con estrategia <em>One-vs-One</em> para 3 clases (Apagado, Encendido, Papel).
            </p>
          </div>
        </div>
      </div>

      <div className="report-section mb-12">
        <h2 className="algo-section-title">2.- Hiperplanos de Decisión y Pesos (W)</h2>
        <div className="algo-section-content">
          <p className="algo-text">
            El vector de características consta de 7 dimensiones: <code>[RMS_X, RMS_Y, RMS_Z, Kurt_X, Kurt_Y, Kurt_Z, Vel_ISO]</code>.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {/* Duelo 0 vs 1 */}
            <div className="algo-box-indigo" style={{ padding: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#4338ca' }}>Duelo: Apagado vs Papel</h4>
              <div style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                Bias (b): {f(MODELO_SVM.duelo01.b)}<br/>
                W: [{MODELO_SVM.duelo01.w.map(w => f(w)).join(', ')}]
              </div>
            </div>

            {/* Duelo 0 vs 2 */}
            <div className="algo-box-indigo" style={{ padding: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#4338ca' }}>Duelo: Apagado vs Encendido</h4>
              <div style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                Bias (b): {f(MODELO_SVM.duelo02.b)}<br/>
                W: [{MODELO_SVM.duelo02.w.map(w => f(w)).join(', ')}]
              </div>
            </div>

            {/* Duelo 1 vs 2 */}
            <div className="algo-box-indigo" style={{ padding: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#4338ca' }}>Duelo: Papel vs Encendido</h4>
              <div style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                Bias (b): {f(MODELO_SVM.duelo12.b)}<br/>
                W: [{MODELO_SVM.duelo12.w.map(w => f(w)).join(', ')}]
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="report-section mb-12">
        <h2 className="algo-section-title">3.- Proceso de Votación</h2>
        <div className="algo-section-content">
          <p className="algo-text">
            Para cada par de clases, se calcula la función de decisión <code>f(x) = w·x + b</code>. Si el resultado es positivo, la primera clase recibe un punto; si es negativo, la segunda clase lo recibe. La clase con mayor puntaje final determina el estado del sistema.
          </p>
        </div>
      </div>
    </section>
  );
}

export default SVMView;
