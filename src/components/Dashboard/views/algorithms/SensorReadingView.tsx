function SensorReadingView() {
  return (
    <section className="engineering-report" >
      
      {/* Encabezado Ajustado */}
      <header className="algo-header">
        <h1 className="algo-title">
          C&Oacute;MO TRABAJA EL SISTEMA
        </h1>
        <p className="algo-subtitle">
          An&aacute;lisis del Proceso de Adquisici&oacute;n y Digitalizaci&oacute;n de Se&ntilde;ales de Aceleraci&oacute;n
        </p>
      </header>

      {/* 1.- SISTEMA MEMS */}
      <div className="report-section mb-12">
        <h2 className="algo-section-title">
          1.- Arquitectura de Detecci&oacute;n Micromec&aacute;nica (MEMS)
        </h2>
        <div className="algo-section-content">
          <div className="algo-box-info">
            <p className="algo-info-card-desc" style={{ color: 'inherit', margin: 0 }}>
              <strong>Componente Est&aacute;tico (Gravedad):</strong> En condiciones de reposo sobre una superficie nivelada, el eje Z interact&uacute;a perpendicularmente con el vector de gravedad terrestre, resultando en una lectura est&aacute;tica de +/- 1g equivalente a aproximadamente 256 LSB (Least Significant Bit) en escala de +/- 2g. 
              Los ejes X e Y, al encontrarse paralelos al plano, registran valores pr&oacute;ximos a 0 LSB.
            </p>
          </div>
        </div>
      </div>

      {/* 2.- CUANTIZACI&Oacute;N */}
      <div className="report-section mb-12">
        <h2 className="algo-section-title">
          2.- Conversi&oacute;n Anal&oacute;gica-Digital y Mapa de Registros
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            Las variaciones de capacitancia se procesan mediante un ADC (Analog-Digital Converter) interno de 13 bits. Los resultados se cuantizan en formato de complemento a dos y se distribuyen en un mapa de memoria de 8 bits (byte-addressable) para almacenar los datos.
          </p>
          <table className="algo-table">
            <thead>
              <tr className="algo-table-row-light">
                <th className="algo-table-cell">Eje</th>
                <th className="algo-table-cell">Registro Bajo (Low)</th>
                <th className="algo-table-cell">Registro Alto (High)</th>
                <th className="algo-table-cell">Formato</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="algo-table-cell algo-table-cell-bold">X</td>
                <td className="algo-table-cell">0x32 (DATAX0)</td>
                <td className="algo-table-cell">0x33 (DATAX1)</td>
                <td className="algo-table-cell" rowSpan={3}>16-bit Complemento a dos (Left Justified)</td>
              </tr>
              <tr>
                <td className="algo-table-cell algo-table-cell-bold">Y</td>
                <td className="algo-table-cell">0x34 (DATAY0)</td>
                <td className="algo-table-cell">0x35 (DATAY1)</td>
              </tr>
              <tr>
                <td className="algo-table-cell algo-table-cell-bold">Z</td>
                <td className="algo-table-cell">0x36 (DATAZ0)</td>
                <td className="algo-table-cell">0x37 (DATAZ1)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3.- I2C */}
      <div className="report-section mb-12">
        <h2 className="algo-section-title">
          3.- Protocolo de Comunicaci&oacute;n y Extracci&oacute;n
        </h2>
        <div className="algo-section-content">
          <p className="algo-text-last">
            La ESP32 inicia la transacci&oacute;n I2C actuando como dispositivo de lectura. Se realiza una lectura multibyte a partir de la direcci&oacute;n base 0x32. 
            El flujo de datos se sincroniza mediante las l&iacute;neas SCL (Clock) y SDA (Data), garantizando la integridad de las muestras.
          </p>
        </div>
      </div>

      {/* 4.- PROCESAMIENTO */}
      <div className="report-section mb-12">
        <h2 className="algo-section-title">
          4.- Reconstrucci&oacute;n de Firma y Conversi&oacute;n
        </h2>
        <div className="algo-section-content">
          <p className="algo-text">
            Los bytes extra&iacute;dos en r&aacute;fagas de 8 bits se concatenan en el firmware de la ESP32 para recuperar el valor entero original de 16 bits. Este proceso utiliza operaciones Bitwise que es el desplazamiento a la izquierda:
          </p>
          <div className="algo-code-box">
            <span className="algo-code-comment">// Algoritmo de concatenaci&oacute;n por desplazamiento en C++</span><br/>
            int16_t rawValue = (register_low | (register_high &lt;&lt; 8));
          </div>
          <p className="algo-text-last">
            La conversi&oacute;n a unidades de aceleraci&oacute;n (g) se obtiene aplicando el factor de escala correspondiente a la configuraci&oacute;n de resoluci&oacute;n completa (Full Res), t&iacute;picamente <strong>3.9 mg/LSB</strong>.
          </p>
        </div>
      </div>

      {/* 5.- WEBSOCKET */}
      <div className="report-section mb-12">
        <h2 className="algo-section-title">
          5.- Transmisi&oacute;n de Capa de Aplicaci&oacute;n (WebSocket)
        </h2>
        <div className="algo-section-content">
          <p className="algo-text-last">
            Los datos procesados se encapsulan en tramas JSON y se transmiten mediante un servidor WebSocket as&iacute;ncrono sobre TCP/IP. Esta arquitectura permite el streaming de alta frecuencia con latencia reducida, facilitando la visualizaci&oacute;n inmediata de los transitorios de vibraci&oacute;n en el cliente.
          </p>
        </div>
      </div>

    </section>
  );
}

export default SensorReadingView;
