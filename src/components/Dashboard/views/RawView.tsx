import type { ESPData } from '../../../lib/connection'

type RawViewProps = {
  data: ESPData | null;
};

function RawView({ data }: RawViewProps) {
  // Transformamos el objeto para la consola JSON según preferencias del usuario
  const displayData = data ? {
    id: data.device_id,
    boot: data.boot_id,
    sample: data.sample_id,
    rate: data.sample_rate_hz,
    uptime: data.uptime_ms,
    delta: data.delta_ms,
    axis: {
      x: data.raw.x,
      y: data.raw.y,
      z: data.raw.z
    },
    diag: {
      temp: data.diag.temp_c,
      heap: data.diag.free_heap,
      rssi: data.diag.rssi_dbm,
      errors: data.diag.i2c_error_count
    }
  } : null;

  return (
    <section>
      <div className="mb-8">
        <div className="label-sm mb-4">Consola JSON en Tiempo Real</div>
        <pre style={{ 
          background: '#1e293b', 
          color: '#94a3b8', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          fontSize: '11px', 
          border: '1px solid #334155', 
          maxHeight: '200px', 
          overflowY: 'auto' 
        }}>
          {JSON.stringify(displayData, null, 2)}
        </pre>
      </div>

      <style>{`
        .grid-telemetry {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
        }
        .card-mini {
          padding: 1rem;
          text-align: left;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
        }
        .section-title {
          font-size: 11px;
          color: var(--primary);
          font-weight: 700;
          text-transform: uppercase;
          margin: 1.5rem 0 1rem 0;
          border-left: 3px solid var(--primary);
          padding-left: 0.5rem;
        }
      `}</style>

      {/* Identidad y Conexión */}
      <div className="section-title">Conexión</div>
      <div className="grid-telemetry">
        <div className="card-mini">
          <div className="label-sm">id</div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>{data?.device_id || '--'}</div>
        </div>
        <div className="card-mini">
          <div className="label-sm">boot</div>
          <div style={{ fontWeight: 700, fontSize: '18px' }}>{data?.boot_id ?? '--'}</div>
        </div>
        <div className="card-mini">
          <div className="label-sm">rssi</div>
          <div style={{ fontWeight: 700, fontSize: '18px', color: '#8b5cf6' }}>{data?.diag.rssi_dbm ?? '--'} dBm</div>
        </div>
        <div className="card-mini">
          <div className="label-sm">uptime</div>
          <div style={{ fontWeight: 700, fontSize: '18px' }}>{(data?.uptime_ms ? (data.uptime_ms / 1000).toFixed(1) : '--')} s</div>
        </div>
      </div>

      {/* Muestreo */}
      <div className="section-title">Parámetros de Muestreo</div>
      <div className="grid-telemetry">
        <div className="card-mini">
          <div className="label-sm">sample</div>
          <div style={{ fontWeight: 700, fontSize: '18px' }}>{data?.sample_id?.toLocaleString() ?? '--'}</div>
        </div>
        <div className="card-mini">
          <div className="label-sm">rate</div>
          <div style={{ fontWeight: 700, fontSize: '18px', color: '#ec4899' }}>{data?.sample_rate_hz ?? '--'} Hz</div>
        </div>
        <div className="card-mini">
          <div className="label-sm">delta</div>
          <div style={{ fontWeight: 700, fontSize: '18px', color: '#f59e0b' }}>{data?.delta_ms.toFixed(2) ?? '--'} ms</div>
        </div>
      </div>

      {/* Sensores RAW */}
      <div className="section-title">Aceleración Cruda</div>
      <div className="grid-telemetry">
        <div className="card-mini">
          <div className="label-sm">axis_x</div>
          <div style={{ fontWeight: 800, fontSize: '22px', color: '#3b82f6' }}>{data?.raw.x ?? '--'}</div>
        </div>
        <div className="card-mini">
          <div className="label-sm">axis_y</div>
          <div style={{ fontWeight: 800, fontSize: '22px', color: '#10b981' }}>{data?.raw.y ?? '--'}</div>
        </div>
        <div className="card-mini">
          <div className="label-sm">axis_z</div>
          <div style={{ fontWeight: 800, fontSize: '22px', color: '#f97316' }}>{data?.raw.z ?? '--'}</div>
        </div>
      </div>

      {/* Estado del Sistema */}
      <div className="section-title">Datos del Microcontrolador</div>
      <div className="grid-telemetry">
        <div className="card-mini">
          <div className="label-sm">temp</div>
          <div style={{ fontWeight: 700, fontSize: '18px' }}>{data?.diag.temp_c.toFixed(1) ?? '--'} °C</div>
        </div>
        <div className="card-mini" style={{ opacity: data?.diag.i2c_error_count ? 1 : 0.5 }}>
          <div className="label-sm">errors</div>
          <div style={{ fontWeight: 700, fontSize: '18px', color: (data?.diag.i2c_error_count ?? 0) > 0 ? '#ef4444' : 'inherit' }}>
            {data?.diag.i2c_error_count ?? '--'}
          </div>
        </div>
        <div className="card-mini">
          <div className="label-sm">heap</div>
          <div style={{ fontWeight: 700, fontSize: '16px' }}>{data?.diag.free_heap.toLocaleString() ?? '--'} B</div>
        </div>
      </div>
    </section>
  );
}

export default RawView;
