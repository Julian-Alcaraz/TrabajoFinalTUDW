import { DiagnosticoPresuntivoType, CausasType } from '@app/common/const/const';

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
