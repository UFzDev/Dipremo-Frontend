export const STATUS = {
  CONNECTED: "Conectado",
  DISCONNECTED: "Desconectado",
  ERROR: "Error",
  CONNECTING: "Conectando..."
} as const;

export type ConnectionStatus = typeof STATUS[keyof typeof STATUS];

export type ESPData = {
  // Datos de identificación y tiempo
  device_id: string;
  boot_id: number;
  sample_id: number;
  sample_rate_hz: number;
  uptime_ms: number;
  delta_ms: number;

  // Datos crudos del sensor
  raw: {
    x: number;
    y: number;
    z: number;
  };

  // Diagnóstico de la placa
  diag: {
    temp_c: number;
    free_heap: number;
    rssi_dbm: number;
    i2c_error_count: number;
  };
};

export function connectToESP(
  onData: (data: ESPData) => void,
  onStatus: (status: ConnectionStatus) => void
) {
  // Conexión directa al backend Docker (FastAPI WebSockets)
  const host = window.location.hostname || 'localhost';
  const wsUrl = `ws://${host}:8000/ws/telemetria`;
  
  let socket: WebSocket | null = null;
  let isManuallyClosed = false;

  try {
    socket = new WebSocket(wsUrl);
  } catch (err) {
    console.error('Error al instanciar WebSocket:', err);
    onStatus(STATUS.ERROR);
    return () => {};
  }

  let hasOpened = false;

  socket.onopen = () => {
    hasOpened = true;
    onStatus(STATUS.CONNECTED);
    console.log(`[DIPREMO] WebSocket conectado a ${wsUrl}`);
  };

  socket.onclose = () => {
    if (isManuallyClosed) {
      onStatus(STATUS.DISCONNECTED);
    } else if (!hasOpened) {
      onStatus(STATUS.ERROR);
    } else {
      onStatus(STATUS.DISCONNECTED);
    }
    console.log('[DIPREMO] WebSocket desconectado.');
  };

  socket.onerror = (error) => {
    onStatus(STATUS.ERROR);
    console.error('[DIPREMO] Error en WebSocket:', error);
  };

  socket.onmessage = (event) => {
    try {
      const parsed: ESPData = JSON.parse(event.data);
      onData(parsed);
    } catch (e) {
      console.error('[DIPREMO] Error al parsear telemetría JSON:', e);
    }
  };

  return () => {
    isManuallyClosed = true;
    if (socket) {
      socket.close();
    }
  };
}
