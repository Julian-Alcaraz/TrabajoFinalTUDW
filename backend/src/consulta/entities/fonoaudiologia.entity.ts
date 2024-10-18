import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Consulta } from './consulta.entity';

@Entity()
export class Fonoaudiologia {
  // esto lo hago para usar el id de la consulta como primaria y foranea
  @PrimaryColumn({ type: 'int' })
  id_consulta: number;

  @OneToOne(() => Consulta)
  @JoinColumn({ name: 'id_consulta' })
  consulta: Consulta;

  @Column({ type: 'boolean' })
  asistencia: boolean;

  @Column({ type: 'varchar', length: 100 })
  diagnosticoPresuntivo: string;

  @Column({ type: 'varchar', length: 100 })
  causas: string;
}
