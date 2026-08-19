import { type ESPData } from '../connection';

/**
 * Motor de Normalización Dinámica (DC Blocker / Leaky Integrator)
 * Extrae y suprime el vector de gravedad de forma adaptativa.
 */
export class NormalizationEngine {
  // Constante de suavizado para el Promedio Móvil (Filtro Pasa-Bajos)
  // 0.998 garantiza una línea base ultra-estable (2.5s de ajuste inicial)
  private static readonly ALPHA = 0.998;
  private static readonly CALIBRATION_WINDOW = 32;
  private static readonly NOISE_DEADZONE = 2.5;
  private static readonly OUT_ALPHA = 0.8; // Suavizado visual de salida

  // Seguidores del vector gravedad / sesgo DC
  public static gravityX = 0;
  public static gravityY = 0;
  public static gravityZ = 0;
  
  // Memoria del suavizado de salida
  private static outX = 0;
  private static outY = 0;
  private static outZ = 0;

  private static initCount = 0;
  private static isInitialized = false;

  /**
   * Ejecuta el DC Blocker iterativo con Supresión de Ruido y Suavizado de Salida
   */
  public static processSample(sample: ESPData) {
    // Fase 1: Calibración por Ventana de Promedio (Arranque en frío)
    if (!this.isInitialized) {
      this.gravityX += sample.raw.x;
      this.gravityY += sample.raw.y;
      this.gravityZ += sample.raw.z;
      this.initCount++;

      if (this.initCount >= this.CALIBRATION_WINDOW) {
        this.gravityX /= this.CALIBRATION_WINDOW;
        this.gravityY /= this.CALIBRATION_WINDOW;
        this.gravityZ /= this.CALIBRATION_WINDOW;
        this.isInitialized = true;
      }
      
      return { x: 0, y: 0, z: 0, uptime: sample.uptime_ms };
    }

    // Fase 2: Seguimiento Adaptive Low-Pass (EMA) del DC / Gravedad
    this.gravityX = (this.ALPHA * this.gravityX) + ((1 - this.ALPHA) * sample.raw.x);
    this.gravityY = (this.ALPHA * this.gravityY) + ((1 - this.ALPHA) * sample.raw.y);
    this.gravityZ = (this.ALPHA * this.gravityZ) + ((1 - this.ALPHA) * sample.raw.z);

    // Fase 3: Extracción AC y Supresión de Ruido de Piso (Deadzone)
    let vx = sample.raw.x - this.gravityX;
    let vy = sample.raw.y - this.gravityY;
    let vz = sample.raw.z - this.gravityZ;

    // Aplicar Deadzone agresiva
    if (Math.abs(vx) < this.NOISE_DEADZONE) vx = 0;
    if (Math.abs(vy) < this.NOISE_DEADZONE) vy = 0;
    if (Math.abs(vz) < this.NOISE_DEADZONE) vz = 0;

    // Fase 4: Suavizado Visual (Filtro de Salida)
    // Reduce el jitter residual y "ablanda" la transición a cero
    this.outX = (this.OUT_ALPHA * this.outX) + ((1 - this.OUT_ALPHA) * vx);
    this.outY = (this.OUT_ALPHA * this.outY) + ((1 - this.OUT_ALPHA) * vy);
    this.outZ = (this.OUT_ALPHA * this.outZ) + ((1 - this.OUT_ALPHA) * vz);

    return {
      x: this.outX,
      y: this.outY,
      z: this.outZ,
      uptime: sample.uptime_ms
    };
  }

  /**
   * Permite re-convergencia manual
   */
  public static reset() {
    this.isInitialized = false;
    this.initCount = 0;
    this.gravityX = 0;
    this.gravityY = 0;
    this.gravityZ = 0;
    this.outX = 0;
    this.outY = 0;
    this.outZ = 0;
  }

  /**
   * Normaliza un flujo histórico
   */
  public static processHistory(history: ESPData[]) {
    return history.map(sample => this.processSample(sample));
  }
}
