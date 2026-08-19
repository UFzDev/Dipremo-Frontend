import { type ESPData } from '../connection';
import { NormalizationEngine } from './Normalization';

export type VelocityRMSData = {
  vRmsX: number;
  vRmsY: number;
  vRmsZ: number;
  vRmsRes: number;
  timestamp: number;
  sampleRateHz: number;
};

export class IntegrationEngine {
  private static readonly WINDOW_SIZE = 100; // Cálculo de vRMS cada 100 muestras
  // LSB del sensor acelerómetro a Gravedad pura (ADXL345 Full Res = 0.0039g/LSB)
  // Luego Gravedad a Aceleración: * 9806.65 mm/s²
  // 0.0039 * 9806.65 = 38.2459
  private static readonly LSB_TO_MMS2 = 38.2459; 
  
  // NORMA ISO 10816 EXIGE FILTRAR BAJAS FRECUENCIAS (< 10 Hz)
  // Calculamos el Alpha dinámicamente: alpha = RC / (RC + dt)
  private static getLeakyAlpha(fs: number): number {
    const fc = 10.0; // Corte ISO en 10 Hz
    const rc = 1.0 / (2.0 * Math.PI * fc);
    const dt = 1.0 / fs;
    return rc / (rc + dt);
  }

  // Memoria estado Integración (Trapezoide)
  private static aOldX = 0;
  private static aOldY = 0;
  private static aOldZ = 0;
  private static vX = 0;
  private static vY = 0;
  private static vZ = 0;

  // Buffers para cálculo de RMS
  private static bufferVx: number[] = [];
  private static bufferVy: number[] = [];
  private static bufferVz: number[] = [];

  private static isInitialized = false;

  public static addSample(sample: ESPData): VelocityRMSData | null {
    // 1. Limpieza base de Aceleración con el DC Blocker del ADXL345
    const aClean = NormalizationEngine.processSample(sample);

    // 2. Conversión física (De LSB Crudo a 'mm/s²')
    const aCurrentX = aClean.x * this.LSB_TO_MMS2;
    const aCurrentY = aClean.y * this.LSB_TO_MMS2;
    const aCurrentZ = aClean.z * this.LSB_TO_MMS2;

    if (!this.isInitialized) {
      this.aOldX = aCurrentX;
      this.aOldY = aCurrentY;
      this.aOldZ = aCurrentZ;
      this.isInitialized = true;
      return null;
    }

    // 3. Resolución Temporal (Delta T) y Alpha Dinámico
    const fs = sample.sample_rate_hz || 100.0;
    const dt = 1.0 / fs;
    const alpha = this.getLeakyAlpha(fs);

    // 4. Integración Numérica Adaptativa (Leaky Integrator)
    // El "Leak" (alpha) multiplica el resultado en cada ciclo. Actúa como un
    // resorte que jala la velocidad siempre de regreso a cero, matando 
    // absolutamente la deriva a infinito (drift).
    this.vX = alpha * (this.vX + ((aCurrentX + this.aOldX) / 2.0) * dt);
    this.vY = alpha * (this.vY + ((aCurrentY + this.aOldY) / 2.0) * dt);
    this.vZ = alpha * (this.vZ + ((aCurrentZ + this.aOldZ) / 2.0) * dt);

    // Actualizamos los "olds" para el siguiente ciclo
    this.aOldX = aCurrentX;
    this.aOldY = aCurrentY;
    this.aOldZ = aCurrentZ;

    // 6. Almacenamiento en Buffer (Cálculo RMS Estándar ISO 10816)
    this.bufferVx.push(this.vX);
    this.bufferVy.push(this.vY);
    this.bufferVz.push(this.vZ);

    if (this.bufferVx.length >= this.WINDOW_SIZE) {
      const vRmsX = this.calculateRMS(this.bufferVx);
      const vRmsY = this.calculateRMS(this.bufferVy);
      const vRmsZ = this.calculateRMS(this.bufferVz);
      
      // Velocidad Resultante (Vectorial sum)
      const vRmsRes = Math.sqrt((vRmsX * vRmsX) + (vRmsY * vRmsY) + (vRmsZ * vRmsZ));

      const result: VelocityRMSData = {
        vRmsX: vRmsX,
        vRmsY: vRmsY,
        vRmsZ: vRmsZ,
        vRmsRes: vRmsRes,
        timestamp: Date.now(),
        sampleRateHz: sample.sample_rate_hz || 100
      };

      // Vaciado de pipeline
      this.bufferVx = [];
      this.bufferVy = [];
      this.bufferVz = [];

      return result;
    }

    return null;
  }

  private static calculateRMS(values: number[]): number {
    const sumSq = values.reduce((sum, val) => sum + (val * val), 0);
    return Math.sqrt(sumSq / values.length);
  }

  public static reset() {
    this.isInitialized = false;
    this.aOldX = 0; this.aOldY = 0; this.aOldZ = 0;
    this.vX = 0; this.vY = 0; this.vZ = 0;
    this.bufferVx = []; this.bufferVy = []; this.bufferVz = [];
  }
}
