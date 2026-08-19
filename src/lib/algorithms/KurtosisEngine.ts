import { type ESPData } from '../connection';
import { NormalizationEngine } from './Normalization';

export type KurtosisData = {
  kurtosisX: number;
  kurtosisY: number;
  kurtosisZ: number;
  timestamp: number;
  sampleRateHz: number;
};

export class KurtosisEngine {
  private static readonly WINDOW_SIZE = 512; // Cantidad estadística de muestras por bloque
  
  // Filtro Pasa-Altas: Remueve movimientos lentos. 
  // Calculamos Alpha dinámicamente basado en fs.
  private static getHpfAlpha(fs: number): number {
    const fc = Math.min(50.0, fs * 0.4); // Intentamos 50Hz, o 40% de fs para evitar Nyquist
    const rc = 1.0 / (2.0 * Math.PI * fc);
    const dt = 1.0 / fs;
    return rc / (rc + dt);
  }

  // Umbral de Actividad: Si la varianza es menor a este valor, consideramos que el sensor
  // está en reposo y el "ruido" es insignificante para el diagnóstico.
  // 0.5 LSB^2 es un valor prudente para ignorar el ruido térmico del ADXL345.
  private static readonly MIN_VARIANCE_THRESHOLD = 0.5;

  // Buffers de recolección temporal
  private static bufferX: number[] = [];
  private static bufferY: number[] = [];
  private static bufferZ: number[] = [];

  // Filtro HPF interactivo
  private static filterX = 0;
  private static filterY = 0;
  private static filterZ = 0;
  private static lastRawX = 0;
  private static lastRawY = 0;
  private static lastRawZ = 0;
  private static isInitialized = false;

  public static addSample(sample: ESPData): KurtosisData | null {
    // Tomamos la señal base limpia del DC Blocker
    const aClean = NormalizationEngine.processSample(sample);

    if (!this.isInitialized) {
      this.lastRawX = aClean.x;
      this.lastRawY = aClean.y;
      this.lastRawZ = aClean.z;
      this.isInitialized = true;
      return null;
    }

    // Filtro Pasa-Altas Matemático (HPF: High-Pass Filter):
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
      const result: KurtosisData = {
        kurtosisX: this.calculateKurtosis(this.bufferX),
        kurtosisY: this.calculateKurtosis(this.bufferY),
        kurtosisZ: this.calculateKurtosis(this.bufferZ),
        timestamp: Date.now(),
        sampleRateHz: fs
      };

      // Vaciamos el pipeline para el siguiente bloque diagnóstico
      this.bufferX = [];
      this.bufferY = [];
      this.bufferZ = [];

      return result;
    }

    return null;
  }

  /**
   * Cálculo del Cuarto Momento Estadístico (Curtosis)
   * Formula: [ 1/N * Σ(x - μ)^4 ] / σ^4
   * Complejidad: O(N) un loop de paso doble (Promedio y Varianza/Curtosis combinada)
   */
  private static calculateKurtosis(values: number[]): number {
    const n = values.length;
    if (n < 4) return 3.0; // Evitar disparates en muestras incompletas

    // 1. Calcular Media (μ)
    let sum = 0;
    for (let i = 0; i < n; i++) sum += values[i];
    const mean = sum / n;

    // 2. Calcular Varianza (σ^2) y Cuarto Momento Desviado
    let varianceSum = 0;
    let fourthMomentSum = 0;

    for (let i = 0; i < n; i++) {
        const diff = values[i] - mean;
        const diffSq = diff * diff;
        varianceSum += diffSq;
        fourthMomentSum += (diffSq * diffSq); // diff^4
    }

    const variance = varianceSum / n;
    
    // FILTRO DE REPOSO:
    // Si la varianza es extremadamente baja (ruido eléctrico/térmico), 
    // forzamos a 3.0 para evitar divisiones por valores ínfimos que disparan la Curtosis.
    if (variance < this.MIN_VARIANCE_THRESHOLD) {
      return 3.0; // Estado nominal (Silencio)
    }

    const m4 = fourthMomentSum / n;
    const standardKurtosis = m4 / (variance * variance);

    // Retorna la "Excess Kurtosis + 3" standard = Curtosis Pura (Gaussiana Normal = 3.0)
    return standardKurtosis;
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
