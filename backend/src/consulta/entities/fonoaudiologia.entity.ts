import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Consulta } from './consulta.entity';
import { CausasType, CausasEnum, DiagnosticoPresuntivoType, DiagnosticoPresuntivoEnum } from '../../common/const/const';

@Entity('fonoaudiologia')
export class Fonoaudiologia {
  @PrimaryColumn({ type: 'int' })
  id_consulta: number;

  @OneToOne(() => Consulta, (consulta) => consulta.fonoaudiologia)
  @JoinColumn({ name: 'id_consulta' })
  consulta: Consulta;

  // Datos Fonoaudiologia

  @Column({ type: 'boolean' })
  asistencia: boolean;

  @Column({ type: 'enum', enum: DiagnosticoPresuntivoEnum })
  diagnostico_presuntivo: DiagnosticoPresuntivoType;

  @Column({ type: 'enum', enum: CausasEnum })
  causas: CausasType;
}
