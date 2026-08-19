import { type ESPData } from '../connection';
import { NormalizationEngine } from './Normalization';

export type RMSData = {
  x: number;
  y: number;
  z: number;
  res: number;
  timestamp: number;
  diag: ESPData['diag'];
  sample_rate_hz: number;
  type: 'rms';
  isRMS: true;
};

export class RMSEngine {
  private static bufferX: number[] = [];
  private static bufferY: number[] = [];
  private static bufferZ: number[] = [];
  private static readonly WINDOW_SIZE = 100;

  /**
   * Agrega una muestra y retorna el valor RMS si el búfer se llena
   */
  public static addSample(sample: ESPData): RMSData | null {
    // 1. Normalizamos el dato en vivo primero para que el RMS sea sobre el cero absoluto
    const normalized = NormalizationEngine.processSample(sample);

    this.bufferX.push(normalized.x);
    this.bufferY.push(normalized.y);
    this.bufferZ.push(normalized.z);

    if (this.bufferX.length >= this.WINDOW_SIZE) {
      const xRMS = this.calculateRMS(this.bufferX);
      const yRMS = this.calculateRMS(this.bufferY);
      const zRMS = this.calculateRMS(this.bufferZ);
      
      // Magnitud Resultante (Combinada) según ISO
      const resultant = Math.sqrt((xRMS * xRMS) + (yRMS * yRMS) + (zRMS * zRMS));

      const rms: RMSData = {
        x: xRMS,
        y: yRMS,
        z: zRMS,
        res: resultant,
        timestamp: sample.uptime_ms || Date.now(),
        diag: sample.diag,
        sample_rate_hz: sample.sample_rate_hz,
        type: 'rms',
        isRMS: true 
      };

      // Limpiar búfers para el siguiente ciclo
      this.bufferX = [];
      this.bufferY = [];
      this.bufferZ = [];

      return rms;
    }

    return null;
  }

  /**
   * Fórmula: sqrt( sum(ai^2) / N )
   */
  private static calculateRMS(values: number[]): number {
    const sumSquares = values.reduce((sum, val) => sum + (val * val), 0);
    return Math.sqrt(sumSquares / values.length);
  }
}
