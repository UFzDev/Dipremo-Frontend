import { type ESPData } from '../connection';
import { NormalizationEngine } from './Normalization';

export type SkewnessData = {
  skewnessX: number;
  skewnessY: number;
  skewnessZ: number;
  timestamp: number;
  sampleRateHz: number;
};

export class SkewnessEngine {
  private static readonly WINDOW_SIZE = 512; // Muestras estadísticas para 1 captura de holgura

  // Buffers de recolección temporal
  private static bufferX: number[] = [];
  private static bufferY: number[] = [];
  private static bufferZ: number[] = [];

  // Filtro Pasa-Altas: Remueve movimientos lentos. 
  // Calculamos Alpha dinámicamente basado en fs.
  private static getHpfAlpha(fs: number): number {
    const fc = Math.min(50.0, fs * 0.4); 
    const rc = 1.0 / (2.0 * Math.PI * fc);
    const dt = 1.0 / fs;
    return rc / (rc + dt);
  }

  private static filterX = 0;
  private static filterY = 0;
  private static filterZ = 0;
  private static lastRawX = 0;
  private static lastRawY = 0;
  private static lastRawZ = 0;
  private static isInitialized = false;

  public static addSample(sample: ESPData): SkewnessData | null {
    // Tomamos la señal AC limpia de gravedad
    const aClean = NormalizationEngine.processSample(sample);

    if (!this.isInitialized) {
      this.lastRawX = aClean.x;
      this.lastRawY = aClean.y;
      this.lastRawZ = aClean.z;
      this.isInitialized = true;
      return null;
    }

    // Filtrado de bajas frecuencias
    const fs = sample.sample_rate_hz || 100;
    const alpha = this.getHpfAlpha(fs);

    this.filterX = alpha * (this.filterX + aClean.x - this.lastRawX);
    this.filterY = alpha * (this.filterY + aClean.y - this.lastRawY);
    this.filterZ = alpha * (this.filterZ + aClean.z - this.lastRawZ);

    this.lastRawX = aClean.x;
    this.lastRawY = aClean.y;
    this.lastRawZ = aClean.z;

    this.bufferX.push(this.filterX);
    this.bufferY.push(this.filterY);
    this.bufferZ.push(this.filterZ);

    if (this.bufferX.length >= this.WINDOW_SIZE) {
      const result: SkewnessData = {
        skewnessX: this.calculateSkewness(this.bufferX),
        skewnessY: this.calculateSkewness(this.bufferY),
        skewnessZ: this.calculateSkewness(this.bufferZ),
        timestamp: Date.now(),
        sampleRateHz: fs
      };

      // Vaciamos el pipeline para el siguiente diagnóstico
      this.bufferX = [];
      this.bufferY = [];
      this.bufferZ = [];

      return result;
    }

    return null;
  }

  /**
   * Cálculo del Tercer Momento Estadístico (Asimetría / Skewness)
   * Formula: [ 1/N * Σ(x - μ)^3 ] / σ^3
   */
  private static calculateSkewness(values: number[]): number {
    const n = values.length;
    if (n < 3) return 0.0; // Evitar divisiones fatales

    // 1. Calcular Media (μ) (Que debería ser extremadamente cercana a Cero por el HPF)
    let sum = 0;
    for (let i = 0; i < n; i++) sum += values[i];
    const mean = sum / n;

    // 2. Calcular Varianza (σ^2) y Tercer Momento
    let varianceSum = 0;
    let thirdMomentSum = 0;

    for (let i = 0; i < n; i++) {
        const diff = values[i] - mean;
        const diffSq = diff * diff;
        varianceSum += diffSq;
        thirdMomentSum += (diffSq * diff); // (x - μ)^3
    }

    const variance = varianceSum / n;
    
    // Safety check para divisor casi cero (la máquina está 100% apagada o es ruido térmico)
    if (variance < 0.0000001) return 0.0; 

    const standardDeviation = Math.sqrt(variance);
    const m3 = thirdMomentSum / n;
    
    // Asimetría (Tercer momento dividido por desviación estándar al cubo)
    const skewness = m3 / (standardDeviation * standardDeviation * standardDeviation);

    return skewness;
  }

  public static reset() {
    this.bufferX = [];
    this.bufferY = [];
    this.bufferZ = [];
    this.filterX = 0;
    this.filterY = 0;
    this.filterZ = 0;
    this.isInitialized = false;
  }
}
