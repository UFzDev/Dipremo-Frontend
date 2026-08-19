/**
 * ChartEngine: Motor de Geometría para Gráficos SVG
 * Centraliza el escalado y generación de paths para visualizaciones de alta frecuencia.
 */

export type ChartBounds = {
  min: number;
  max: number;
};

export type ChartDimensions = {
  width: number;
  height: number;
};

export class ChartEngine {
  /**
   * Genera el atributo 'points' para una polilínea SVG
   * @param data Array de valores numéricos
   * @param dim Dimensiones del contenedor (width, height)
   * @param bounds Límites del eje Y (min, max)
   */
  public static generatePolylinePoints(
    data: number[],
    dim: ChartDimensions,
    bounds: ChartBounds
  ): string {
    if (data.length === 0) return '';

    const rawRange = bounds.max - bounds.min;
    const range = rawRange === 0 ? 1 : rawRange;
    
    return data.map((val, i) => {
      // Cálculo de X proporcional al índice
      const x = (i / Math.max(1, data.length - 1)) * dim.width;
      
      // Normalización de Y (sujeto a los límites del ViewBox)
      // Clamping para evitar que la línea se salga del gráfico
      const clampedVal = Math.max(bounds.min, Math.min(bounds.max, val));
      const y = dim.height - ((clampedVal - bounds.min) / range) * dim.height;
      
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
  }

  /**
   * Calcula el rango dinámico sugerido para una serie de datos
   */
  public static getSuggestedBounds(data: number[], padding = 0.2): ChartBounds {
    if (data.length === 0) return { min: -100, max: 100 };
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const delta = max - min;
    
    return {
      min: min - delta * padding,
      max: max + delta * padding
    };
  }
}
