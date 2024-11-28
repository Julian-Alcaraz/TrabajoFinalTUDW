import { Column, Entity, OneToMany } from 'typeorm';

import { Consulta } from '../../consulta/entities/consulta.entity';
import { EntidadBasica } from '../../database/entities/EntidadBasica';

export type nivelCurso = 'Jardin' | 'Primario' | 'Secundario';

@Entity('curso')
export class Curso extends EntidadBasica {
  @Column({ type: 'enum', enum: ['Jardin', 'Primario', 'Secundario'], nullable: false })
  nivel: nivelCurso;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @OneToMany(() => Consulta, (consulta) => consulta.curso)
  consultas: Consulta[];
}
