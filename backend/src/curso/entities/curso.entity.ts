import { Consulta } from '../../consulta/entities/consulta.entity';
import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Column, Entity, OneToMany } from 'typeorm';
export type nivelCurso = 'Primaria' | 'Secundario' | 'Jardin' | 'Terciario' | 'Universitario';

@Entity()
export class Curso extends EntidadBasica {
  @Column({ type: 'int', nullable: false })
  grado: number;
  @Column({ type: 'enum', enum: ['Primaria', 'Secundario', 'Jardin', 'Terciario', 'Universitario'], nullable: false })
  nivel: nivelCurso;
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @OneToMany(() => Consulta, (consulta) => consulta.chico)
  consultas: Consulta[];
}
