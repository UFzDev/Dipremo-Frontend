import { STATUS, type ESPData, type ConnectionStatus } from '../../lib/connection'
import { type ConnectionHealth } from '../../lib/algorithms/ConnectionEngine'

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  data: ESPData | null;
  status: ConnectionStatus;
  health: ConnectionHealth | null;
  onConnect: () => void;
  onDisconnect: () => void;
};

function SignalBars({ quality }: { quality: number }) {
  const bars = [1, 2, 3, 4];
  const activeBars = Math.ceil(quality / 25);
  
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
      {bars.map((bar, i) => (
        <div 
          key={bar} 
          style={{ 
            width: '3px', 
            height: `${(i + 1) * 25}%`, 
            background: i < activeBars ? (quality > 50 ? '#10b981' : '#f59e0b') : '#e2e8f0',
            borderRadius: '1px',
            transition: 'background 0.3s ease'
          }} 
        />
      ))}
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab, data, status, health, onConnect, onDisconnect }: SidebarProps) {
  const isConnected = status === STATUS.CONNECTED;
  const isConnecting = status === STATUS.CONNECTING;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>DIPREMO</h1>
        <div className="label-sm" style={{ opacity: 0.6 }}>Panel de Datos</div>
      </div>

      <nav className="sidebar-menu">
        <div 
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Vista General
        </div>
        <div 
          className={`nav-item ${activeTab === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          Gráficas
        </div>
        <div 
          className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Historial
        </div>
        <div 
          className={`nav-item ${activeTab === 'math' ? 'active' : ''}`}
          onClick={() => setActiveTab('math')}
        >
          Algoritmos
        </div>
        <div 
          className={`nav-item ${activeTab === 'raw' ? 'active' : ''}`}
          onClick={() => setActiveTab('raw')}
        >
          Consola JSON
        </div>
        <div 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
          style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}
        >
          Configuraci&oacute;n
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="label-sm" style={{ marginBottom: '0.5rem' }}>Dispositivo</div>
        
        {isConnected ? (
          <div style={{ marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
               <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
                  CONECTADO
               </div>
               <SignalBars quality={health?.quality ?? 0} />
            </div>
            
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem', wordBreak: 'break-all' }}>
              ID: {data?.device_id || 'Cargando...'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Salud de Red: <span style={{ color: (health?.quality ?? 0) > 80 ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{health?.quality ?? 0}%</span>
            </div>
            <button className="btn btn-ghost w-full" onClick={onDisconnect} style={{ fontSize: '12px', padding: '0.4rem' }}>
              Desconectar
            </button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '11px', color: status === STATUS.ERROR ? 'var(--error)' : 'var(--text-muted)', marginBottom: '1.2rem', fontWeight: 500 }}>
              {status === STATUS.ERROR ? '● Error de conexión' : '○ Esperando acción...'}
            </div>
            <button 
              className="btn btn-primary w-full" 
              onClick={onConnect} 
              disabled={isConnecting}
              style={{ fontSize: '13px' }}
            >
              {isConnecting ? 'Conectando...' : 'Conectar ESP32'}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
