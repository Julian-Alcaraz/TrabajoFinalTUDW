import { setSeederFactory } from 'typeorm-extension';

import { Prevencion } from '../../consulta/entities/prevencion.entity';
import { ConsumoProblematicoEnum, FrecuenciaPrevencionEnum, MotivoConsumoEnum, OtraProblematicaEnum } from '../../common/const/const';

export const PrevencionFactory = setSeederFactory(Prevencion, async () => {
  const prevencion = new Prevencion();
  prevencion.edad_inicio_consumo = Math.floor(Math.random() * 10) + 1; // Genera un número entero entre 0 y 9

  prevencion.frecuencia = FrecuenciaPrevencionEnum[Math.floor(Math.random() * FrecuenciaPrevencionEnum.length)];
  prevencion.consumo_problematico = ConsumoProblematicoEnum[Math.floor(Math.random() * ConsumoProblematicoEnum.length)];
  prevencion.motivo_consumo = MotivoConsumoEnum[Math.floor(Math.random() * MotivoConsumoEnum.length)];
  prevencion.otra_problematica = OtraProblematicaEnum[Math.floor(Math.random() * OtraProblematicaEnum.length)];

  return prevencion;
});
