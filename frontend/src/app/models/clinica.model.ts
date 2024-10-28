export class Clinica {
  constructor(
    public id: number,
    public diabetes: boolean,
    public hta: boolean,
    public obesidad: boolean,
    public consumo_alcohol: boolean,
    public consumo_drogas: boolean,
    public antecedentes_perinatal: boolean,
    public enfermedades_previas: boolean,
    public vacunas: string,
    public peso: number,
    public talla: number,
    public pct: number,
    public cc: number,
    public pcimc: number,
    public tas: number,
    public tad: number,
    public pcta: number,
    public examen_visual: string,
    public ortopedia_traumatologia: string,
    public lenguaje: string,
    public segto: boolean,
    public alimentacion: string,
    public hidratacion: string,
    public lacteos: boolean,
    public infusiones: boolean,
    public numero_comidas: number,
    public horas_pantalla: string,
    public horas_juego_airelibre: string,
    public horas_suenio: string,
    public proyecto: string,
  ) {}

  static overload_constructor() {
    return new Clinica(0, false, false, false, false, false, false, false, '', 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', false, '', '', false, false, 0, '', '', '', '');
  }
}
