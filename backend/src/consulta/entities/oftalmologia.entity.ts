import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Consulta } from './consulta.entity';

import { DemandaType, DemandaEnum } from '../../common/const/const';

@Entity('oftalmologia')
export class Oftalmologia {
  @PrimaryColumn({ type: 'int' })
  id_consulta: number;

  @OneToOne(() => Consulta, (consulta) => consulta.oftalmologia)
  @JoinColumn({ name: 'id_consulta' })
  consulta: Consulta;

  @Column({ type: 'enum', enum: DemandaEnum })
  demanda: DemandaType;

  @Column({ type: 'boolean', nullable: false })
  primera_vez: boolean;

  @Column({ type: 'boolean', nullable: false })
  control: boolean;

  @Column({ type: 'boolean', nullable: false })
  receta: boolean;

  @Column({ type: 'date', nullable: false })
  prox_control: Date;

  @Column({ type: 'boolean', nullable: true })
  anteojos?: boolean;
}
