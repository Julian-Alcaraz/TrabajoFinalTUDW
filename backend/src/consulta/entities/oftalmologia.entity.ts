import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Consulta } from './consulta.entity';

@Entity('oftalmologia')
export class Oftalmologia {
  @PrimaryColumn({ type: 'int' })
  id_consulta: number;

  @OneToOne(() => Consulta, (consulta) => consulta.oftalmologia)
  @JoinColumn({ name: 'id_consulta' })
  consulta: Consulta;

  @Column({ type: 'varchar', length: 100, nullable: false })
  demanda: string;

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
