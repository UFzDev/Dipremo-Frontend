type ConfigViewProps = {
  motorRpm: number;
  setMotorRpm: (rpm: number) => void;
  vibeLimits: { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number };
  setVibeLimits: (val: any) => void;
  rmsPeaks: { x: number; y: number; z: number; res: number };
  setRmsPeaks: (val: any) => void;
  fftRange: { minHz: number; maxHz: number };
  setFftRange: (val: any) => void;
  sessionPeaks: {
    minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number;
    rmsX: number; rmsY: number; rmsZ: number; rmsRes: number;
    maxFreqHz: number; maxFreqLSB: number;
  };
  onResetSessionPeaks: () => void;
};

function ConfigView({ 
  motorRpm, setMotorRpm, 
  vibeLimits, setVibeLimits,
  rmsPeaks, setRmsPeaks,
  fftRange, setFftRange,
  sessionPeaks, onResetSessionPeaks
}: ConfigViewProps) {

  const labelStyle: React.CSSProperties = { 
    display: 'block', 
    fontSize: '11px', 
    fontWeight: 800, 
    color: 'var(--text-muted)', 
    textTransform: 'uppercase', 
    marginBottom: '0.5rem',
    letterSpacing: '0.05em'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem',
    fontSize: '13px',
    fontWeight: 600,
    borderRadius: '6px',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-main)',
    outline: 'none',
    background: 'var(--bg-card)'
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 800,
    color: 'var(--text-main)',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderLeft: '4px solid var(--primary)',
    paddingLeft: '0.75rem'
  };

  return (
    <div className="config-view" style={{ padding: '2rem', animation: 'fadeIn 0.5s ease-out', maxWidth: '1000px' }}>
      <header className="algo-header" style={{ marginBottom: '2rem' }}>
        <h1 className="algo-title-sm">Configuraci&oacute;n de Instrumentaci&oacute;n</h1>
        <p className="algo-subtitle">Calibraci&oacute;n de l&iacute;mites y picos operativos del sistema DIPREMO.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* SECCIÓN 1: MOTOR BÁSICO */}
        <section>
          <h3 style={sectionTitleStyle}>Par&aacute;metros del Motor</h3>
          <div className="algo-card-light" style={{ padding: '1.5rem' }}>
            <label style={labelStyle}>Velocidad de giro (Nominal)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input 
                type="number" 
                value={motorRpm === 0 ? '' : motorRpm}
                onChange={(e) => setMotorRpm(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                style={{ ...inputStyle, width: '120px' }}
              />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>RPM</span>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: RANGO FFT */}
        <section>
          <h3 style={sectionTitleStyle}>An&aacute;lisis Espectral (FFT)</h3>
          <div className="algo-card-light" style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>M&iacute;nimo Hz</label>
              <input 
                type="number" 
                value={fftRange.minHz}
                onChange={(e) => setFftRange({ ...fftRange, minHz: parseFloat(e.target.value) || 0 })}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>M&aacute;ximo Hz</label>
              <input 
                type="number" 
                value={fftRange.maxHz}
                onChange={(e) => setFftRange({ ...fftRange, maxHz: parseFloat(e.target.value) || 0 })}
                style={inputStyle}
              />
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: MONITOR TRIAXIAL */}
        <section style={{ gridColumn: '1 / -1' }}>
          <h3 style={sectionTitleStyle}>L&iacute;mites Monitor Triaxial (Normalizaci&oacute;n)</h3>
          <div className="algo-card-light" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <div>
              <label style={{ ...labelStyle, color: 'var(--error)' }}>Eje X (Min / Max)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="number" value={vibeLimits.minX} onChange={(e) => setVibeLimits({ ...vibeLimits, minX: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                <input type="number" value={vibeLimits.maxX} onChange={(e) => setVibeLimits({ ...vibeLimits, maxX: parseFloat(e.target.value) || 0 })} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={{ ...labelStyle, color: 'var(--success)' }}>Eje Y (Min / Max)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="number" value={vibeLimits.minY} onChange={(e) => setVibeLimits({ ...vibeLimits, minY: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                <input type="number" value={vibeLimits.maxY} onChange={(e) => setVibeLimits({ ...vibeLimits, maxY: parseFloat(e.target.value) || 0 })} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={{ ...labelStyle, color: 'var(--primary)' }}>Eje Z (Min / Max)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="number" value={vibeLimits.minZ} onChange={(e) => setVibeLimits({ ...vibeLimits, minZ: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                <input type="number" value={vibeLimits.maxZ} onChange={(e) => setVibeLimits({ ...vibeLimits, maxZ: parseFloat(e.target.value) || 0 })} style={inputStyle} />
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: TENDENCIA ENERGÉTICA */}
        <section style={{ gridColumn: '1 / -1' }}>
          <h3 style={sectionTitleStyle}>Picos Máximos Tendencia Energ&eacute;tica (RMS)</h3>
          <div className="algo-card-light" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Pico X</label>
              <input type="number" value={rmsPeaks.x} onChange={(e) => setRmsPeaks({ ...rmsPeaks, x: parseFloat(e.target.value) || 0 })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Pico Y</label>
              <input type="number" value={rmsPeaks.y} onChange={(e) => setRmsPeaks({ ...rmsPeaks, y: parseFloat(e.target.value) || 0 })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Pico Z</label>
              <input type="number" value={rmsPeaks.z} onChange={(e) => setRmsPeaks({ ...rmsPeaks, z: parseFloat(e.target.value) || 0 })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Pico Resultante</label>
              <input type="number" value={rmsPeaks.res} onChange={(e) => setRmsPeaks({ ...rmsPeaks, res: parseFloat(e.target.value) || 0 })} style={inputStyle} />
            </div>
          </div>
        </section>

        {/* SECCIÓN 5: REFERENCIA DE SESIÓN (SOLO LECTURA) */}
        <section style={{ gridColumn: '1 / -1', marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ ...sectionTitleStyle, borderLeftColor: 'var(--success)', marginBottom: 0 }}>Valores M&aacute;ximos Le&iacute;dos (Sesi&oacute;n Actual)</h3>
            <button 
              onClick={onResetSessionPeaks}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                color: '#64748b',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
              onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
            >
              Reiniciar Lecturas
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {/* Triaxial Peaks */}
            <div className="algo-card-light" style={{ padding: '1rem', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 900, margin: '0 0 1rem 0', textTransform: 'uppercase' }}>Vibraci&oacute;n (Extremos)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: '"JetBrains Mono", monospace', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--error)' }}>X</span>
                  <span style={{ fontWeight: 700 }}>{sessionPeaks.minX.toFixed(0)} | {sessionPeaks.maxX.toFixed(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--success)' }}>Y</span>
                  <span style={{ fontWeight: 700 }}>{sessionPeaks.minY.toFixed(0)} | {sessionPeaks.maxY.toFixed(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--primary)' }}>Z</span>
                  <span style={{ fontWeight: 700 }}>{sessionPeaks.minZ.toFixed(0)} | {sessionPeaks.maxZ.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* RMS Peaks */}
            <div className="algo-card-light" style={{ padding: '1rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', gridColumn: 'span 2' }}>
              <h4 style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 900, margin: '0 0 1rem 0', textTransform: 'uppercase' }}>Energ&iacute;a RMS (Picos de Sesi&oacute;n)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', fontFamily: '"JetBrains Mono", monospace' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', opacity: 0.5 }}>X</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--error)' }}>{sessionPeaks.rmsX.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', opacity: 0.5 }}>Y</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--success)' }}>{sessionPeaks.rmsY.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', opacity: 0.5 }}>Z</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>{sessionPeaks.rmsZ.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', opacity: 0.5 }}>RES</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#8b5cf6' }}>{sessionPeaks.rmsRes.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* FFT Peak Frequency */}
            <div className="algo-card-light" style={{ padding: '1rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h4 style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 900, margin: '0 0 1rem 0', textTransform: 'uppercase' }}>Frecuencia Pico</h4>
              <div style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--warning)' }}>{sessionPeaks.maxFreqHz.toFixed(1)}</div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)' }}>HERTZ</div>
              </div>
            </div>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
            * Estos valores representan el techo y piso absoluto detectado por el sensor. Úsalos como base para configurar tus límites operativos.
          </p>
        </section>

      </div>
    </div>
  );
}

export default ConfigView;
