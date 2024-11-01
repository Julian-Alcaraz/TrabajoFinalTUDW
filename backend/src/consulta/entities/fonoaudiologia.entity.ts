import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Consulta } from './consulta.entity';

@Entity('fonoaudiologia')
export class Fonoaudiologia {
  @PrimaryColumn({ type: 'int' })
  id_consulta: number;

  @OneToOne(() => Consulta)
  @JoinColumn({ name: 'id_consulta' })
  consulta: Consulta;

  @Column({ type: 'boolean' })
  asistencia: boolean;

  @Column({ type: 'varchar', length: 100 })
  diagnostico_presuntivo: string;

  @Column({ type: 'varchar', length: 100 })
  causas: string;
}
