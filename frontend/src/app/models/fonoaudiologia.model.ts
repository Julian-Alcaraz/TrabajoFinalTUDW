export type DiagnosticoPresuntivoType = 'TEL' | 'TEA' | 'Retraso en el lenguaje, dislalias funcionales' | 'Respirador bucal' | 'Anquiloglosia' | 'Ortodoncia: Protrusión lingual, paladar hendido' | 'Síndromes' | 'Otras patologías que dificulten el lenguaje y la comunicación';
export type CausasType = 'Prenatal' | 'Postnatal' | 'ACV' | 'Respiratorias' | 'Audición' | 'Patologías clínicas' | 'Síndromes' | 'Inflamación de amígdalas o adenoides' | 'Prematurez' | 'Otras';


export class Fonoaudiologia {
  constructor(
    public id: number,
    public asistencia: boolean,
    public diagnostico_presuntivo: DiagnosticoPresuntivoType,
    public causas: CausasType,
  ) {}

  static overload_constructor() {
    return new Fonoaudiologia(0, false, 'TEL', 'ACV');
  }
}
