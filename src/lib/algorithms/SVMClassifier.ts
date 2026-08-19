/**
 * Motor de Clasificación SVM (Support Vector Machine)
 * Implementa una arquitectura One-vs-One para clasificación de vibración industrial.
 */

export type SVMModel = {
    b: number;
    w: number[];
};

export type SVMDuelos = {
    duelo01: SVMModel;
    duelo02: SVMModel;
    duelo12: SVMModel;
};

export const MODELO_SVM: SVMDuelos = {
    // Apagado (0) vs Normal (1)
    duelo01: { b: 1.00007907, w: [-0.10208149, -0.1298137, -0.09435169, 0.00670611, 0.00559925, -0.00156762, -0.04446164] },
    // Apagado (0) vs Papel (2)
    duelo02: { b: 0.99943793, w: [-0.09535265, -0.07778906, -0.06710994, 0.00397959, 0.00510178, -0.00182026, -0.03446606] },
    // Normal (1) vs Papel (2)
    duelo12: { b: 9.06496949, w: [-0.25221721, 0.94601813, -2.07609392, 0.39509825, -3.55026227, 1.10529844, 0.58743625] }
};

export class SVMClassifier {
    /**
     * Clasifica un vector de características en una de las 3 categorías.
     * @param datos Array de 7 características: [rmsX, rmsY, rmsZ, kurtX, kurtY, kurtZ, velIso]
     */
    static clasificarVibracion(datos: number[]): string {
        if (datos.length < 7) return "Indeterminado";

        let votos = [0, 0, 0]; // [Apagado, Normal, Papel]
        
        const calcular = (d: SVMModel, x: number[]) => d.w.reduce((acc, w, i) => acc + w * x[i], 0) + d.b;

        // Ejecutar votación One-vs-One
        (calcular(MODELO_SVM.duelo01, datos) > 0) ? votos[0]++ : votos[1]++;
        (calcular(MODELO_SVM.duelo02, datos) > 0) ? votos[0]++ : votos[2]++;
        (calcular(MODELO_SVM.duelo12, datos) > 0) ? votos[1]++ : votos[2]++;

        const maxVotos = Math.max(...votos);
        const ganador = votos.indexOf(maxVotos);
        
        // Si hay un empate técnico (1, 1, 1) o no hay un ganador claro (votos < 2)
        // en un sistema One-vs-One de 3 clases, el máximo de votos debe ser 2 para tener certeza.
        if (maxVotos < 2) return "Indeterminado";

        const etiquetas = ["Apagado", "Papel", "Encendido"];
        
        return etiquetas[ganador];
    }
}
