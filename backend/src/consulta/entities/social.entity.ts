import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Consulta } from './consulta.entity';

@Entity('social')
export class Social {
  @PrimaryColumn({ type: 'int' })
  id_consulta: number;

  @OneToOne(() => Consulta, (consulta) => consulta.social)
  @JoinColumn({ name: 'id_consulta' })
  consulta: Consulta;

  @Column({ type: 'varchar', length: 100, nullable: true })
  demanda: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  articulacion: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  objeto_informe: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  seguimiento: string;
}
