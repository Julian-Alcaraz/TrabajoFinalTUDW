import { Consulta } from '../../consulta/entities/consulta.entity';
import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity()
export class Curso extends EntidadBasica {
  @Column({ type: 'int', nullable: false })
  anio: number;

  // ver bien esto

  @OneToOne(() => Consulta)
  consulta: Consulta;
}
