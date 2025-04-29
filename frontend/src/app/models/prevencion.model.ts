import { ConsumoProblematicoType, FrecuenciaPrevencionType, MotivoConsumoType, OtraProblematicaType } from '@app/common/const/const';

export class Prevencion {
  constructor(
    public id: number,
    public edad_inicio_consumo: number,
    public motivo_consumo: MotivoConsumoType,
    public frecuencia: FrecuenciaPrevencionType,
    public consumo_problematico: ConsumoProblematicoType,
    public otra_problematica: OtraProblematicaType,
  ) {}

  static overload_constructor() {
    return new Prevencion(0, 0, 'Otro', 'Otro', 'Otra', 'Otra');
  }
}
