import { type ESPData } from '../connection';

export type ConnectionHealth = {
  quality: number; // 0-100%
  lostPackets: number;
  totalPackets: number;
  jitterMs: number;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  avgArrivalDelta: number;
};

export class ConnectionEngine {
  private static lastSampleId = -1;
  private static totalLost = 0;
  private static totalReceived = 0;
  private static rollingWindow: boolean[] = []; // true = éxito, false = perdido
  private static lastArrivalTime = 0;
  private static deltas: number[] = [];

  private static readonly WINDOW_SIZE = 200;

  public static processSample(sample: ESPData): ConnectionHealth {
    const now = Date.now();
    
    if (this.lastSampleId !== -1) {
      // 1. Detección de Huecos (Packet Loss)
      // Si recibimos ID 10 y luego ID 15, perdimos 11, 12, 13, 14 (4 paquetes)
      const gap = sample.sample_id - this.lastSampleId - 1;
      
      if (gap > 0) {
        this.totalLost += gap;
        // Llenamos la ventana con fallos
        for (let i = 0; i < gap; i++) {
          this.rollingWindow.push(false);
        }
      }
      
      // Este paquete sí llegó
      this.rollingWindow.push(true);

      // 2. Cálculo de Estabilidad (Jitter/Delta)
      const arrivalDelta = now - this.lastArrivalTime;
      this.deltas.push(arrivalDelta);
    } else {
      // Primer paquete
      this.rollingWindow.push(true);
    }

    this.lastSampleId = sample.sample_id;
    this.lastArrivalTime = now;
    this.totalReceived++;

    // Limpieza de ventanas para rendimiento
    if (this.rollingWindow.length > this.WINDOW_SIZE) {
      this.rollingWindow = this.rollingWindow.slice(-this.WINDOW_SIZE);
    }
    if (this.deltas.length > 50) {
      this.deltas = this.deltas.slice(-50);
    }

    // 3. Estadísticas Finales
    const receivedInWindow = this.rollingWindow.filter(p => p).length;
    const successRate = (receivedInWindow / this.rollingWindow.length) * 100;
    
    const avgDelta = this.deltas.length > 0 
      ? this.deltas.reduce((a, b) => a + b, 0) / this.deltas.length 
      : 0;

    // Calcular desviación (jitter aproximado)
    const jitter = this.deltas.length > 1
      ? Math.abs(avgDelta - sample.delta_ms)
      : 0;

    let status: ConnectionHealth['status'] = 'excellent';
    if (successRate < 60) status = 'critical';
    else if (successRate < 80) status = 'poor';
    else if (successRate < 90) status = 'fair';
    else if (successRate < 97) status = 'good';

    return {
      quality: Math.round(successRate),
      lostPackets: this.totalLost,
      totalPackets: this.totalReceived,
      jitterMs: Math.round(jitter),
      avgArrivalDelta: Math.round(avgDelta),
      status
    };
  }

  public static reset() {
    this.lastSampleId = -1;
    this.totalLost = 0;
    this.totalReceived = 0;
    this.rollingWindow = [];
    this.lastArrivalTime = 0;
    this.deltas = [];
  }
}
