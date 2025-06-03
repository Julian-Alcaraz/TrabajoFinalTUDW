import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Consulta } from './consulta.entity';

import { MotivoConsumoEnum, MotivoConsumoType, FrecuenciaPrevencionType, FrecuenciaPrevencionEnum, ConsumoProblematicoEnum, ConsumoProblematicoType, OtraProblematicaType, OtraProblematicaEnum } from '../../common/const/const';

@Entity('prevencion')
export class Prevencion {
  @PrimaryColumn({ type: 'int' })
  id_consulta: number;

  @OneToOne(() => Consulta, (consulta) => consulta.prevencion)
  @JoinColumn({ name: 'id_consulta' })
  consulta: Consulta;

  @Column({ type: 'int', nullable: true })
  edad_inicio_consumo: number;

  @Column({ type: 'enum', enum: MotivoConsumoEnum, nullable: true })
  motivo_consumo: MotivoConsumoType;

  @Column({ type: 'enum', enum: FrecuenciaPrevencionEnum, nullable: true })
  frecuencia: FrecuenciaPrevencionType;

  @Column({ type: 'enum', enum: ConsumoProblematicoEnum, nullable: true })
  consumo_problematico: ConsumoProblematicoType;

  @Column({ type: 'enum', enum: OtraProblematicaEnum, nullable: true })
  otra_problematica: OtraProblematicaType;
}
