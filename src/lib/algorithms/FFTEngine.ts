import { type ESPData } from '../connection';
import { NormalizationEngine } from './Normalization';

export type FFTData = {
  magnitudeX: number[];
  magnitudeY: number[];
  magnitudeZ: number[];
  magnitudeRes: number[];
  bins: number;
  sampleRateHz: number;
  timestamp: number;
};

export class FFTEngine {
  public static readonly WINDOW_SIZE = 256;
  private static bufferX: number[] = [];
  private static bufferY: number[] = [];
  private static bufferZ: number[] = [];

  /**
   * Adds a sample to the buffer. If the buffer is full, it computes the FFT.
   */
  public static addSample(sample: ESPData): FFTData | null {
    const normalized = NormalizationEngine.processSample(sample);
    
    this.bufferX.push(normalized.x);
    this.bufferY.push(normalized.y);
    this.bufferZ.push(normalized.z);

    if (this.bufferX.length >= this.WINDOW_SIZE) {
      // Calculate FFT for each axis
      const magX = this.processChannel(this.bufferX);
      const magY = this.processChannel(this.bufferY);
      const magZ = this.processChannel(this.bufferZ);
      
      // Cálculo de la Magnitud Resultante (Bin por Bin)
      const magnitudeRes = magX.map((val, i) => 
        Math.sqrt((val * val) + (magY[i] * magY[i]) + (magZ[i] * magZ[i]))
      );

      const result: FFTData = {
        magnitudeX: magX,
        magnitudeY: magY,
        magnitudeZ: magZ,
        magnitudeRes: magnitudeRes,
        bins: this.WINDOW_SIZE / 2,
        sampleRateHz: sample.sample_rate_hz || 100.0,
        timestamp: Date.now()
      };

      // Clear buffers (Non-overlapping window. For 50% overlap, keep last N/2)
      this.bufferX = [];
      this.bufferY = [];
      this.bufferZ = [];

      return result;
    }

    return null;
  }

  private static processChannel(data: number[]): number[] {
    const input = [...data];
    const N = input.length;

    // 1. Hanning Window to prevent spectral leakage
    for (let i = 0; i < N; i++) {
        input[i] *= 0.5 * (1 - Math.cos((2 * Math.PI * i) / (N - 1)));
    }

    // 2. Setup Real and Imaginary arrays
    const real = [...input];
    const imag = new Array(N).fill(0);

    // 3. Bit-reversed addressing
    let j = 0;
    for (let i = 0; i < N - 1; i++) {
      if (i < j) {
        // Swap
        let tempReal = real[i];
        real[i] = real[j];
        real[j] = tempReal;
      }
      let k = N >> 1;
      while (k <= j) {
        j -= k;
        k >>= 1;
      }
      j += k;
    }

    // 4. Radix-2 Cooley-Tukey FFT Algorithm
    const log2n = Math.log2(N);
    for (let l = 1; l <= log2n; l++) {
      const le = 1 << l;
      const le2 = le >> 1;
      let uR = 1;
      let uI = 0;
      const angle = Math.PI / le2;
      const sR = Math.cos(angle);
      const sI = -Math.sin(angle);

      for (let j = 1; j <= le2; j++) {
        for (let i = j - 1; i < N; i += le) {
          const ip = i + le2;
          const tR = real[ip] * uR - imag[ip] * uI;
          const tI = real[ip] * uI + imag[ip] * uR;
          
          real[ip] = real[i] - tR;
          imag[ip] = imag[i] - tI;
          
          real[i] += tR;
          imag[i] += tI;
        }
        const t = uR * sR - uI * sI;
        uI = uR * sI + uI * sR;
        uR = t;
      }
    }

    // 5. Calculate Magnitude (First N/2 elements represent the useful spectrum)
    const magnitudes = new Array(N / 2);
    for (let i = 0; i < N / 2; i++) {
      // Magnitude scaling factor: 2/N (except DC which would be 1/N but we ignore scale diff for visual UI)
      magnitudes[i] = (Math.sqrt(real[i] * real[i] + imag[i] * imag[i]) * 2) / N;
    }
    
    // Zero out DC bias completely if needed, but Hanning array might have shifted. 
    // Usually DC is magnitudes[0]
    magnitudes[0] = 0; 

    return magnitudes;
  }
}
