import { AlimentacionType, CantidadComidasType, ExamenVisualType, HidratacionType, HsJuegoAireLibreType, HsPantallaType, HsSuenioType, InfusionesType, LenguajeType, OrtopediaYTraumatologiaType, VacunasType } from "@app/common/const/const";

export class Clinica {
  constructor(
    public id: number,
    public diabetes: boolean,
    public hta: boolean,
    public obesidad: boolean,
    public consumo_alcohol: boolean,
    public consumo_drogas: boolean,
    public consumo_tabaco: boolean,
    public antecedentes_perinatal: boolean,
    public enfermedades_previas: boolean,
    public vacunas: VacunasType,
    public peso: number,
    public talla: number,
    public pct: number,
    public cc: number,
    public pcimc: number,
    public tas: number,
    public tad: number,
    public pcta: number,
    public examen_visual: ExamenVisualType,
    public ortopedia_traumatologia: OrtopediaYTraumatologiaType,
    public lenguaje: LenguajeType,
    public segto: boolean,
    public alimentacion: AlimentacionType,
    public hidratacion: HidratacionType,
    public leche: boolean,
    public infusiones: InfusionesType,
    public cantidad_comidas: CantidadComidasType,
    public horas_pantalla: HsPantallaType,
    public horas_juego_aire_libre: HsJuegoAireLibreType,
    public horas_suenio: HsSuenioType,
  ) {}

  static overload_constructor() {
    return new Clinica(0, false, false, false, false, false, false, false, false, 'Completo', 0, 0, 0, 0, 0, 0, 0, 0, 'Normal', 'Normal', 'Adecuado', false, 'Frituras', 'Agua', false, 'Té', '4', 'Menor a 2hs', '1h', 'Menos de 10hs');
  }
}
