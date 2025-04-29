import { Column, Entity, OneToMany } from 'typeorm';

import { Taller } from '../../taller/entities/taller.entity';
import { Consulta } from '../../consulta/entities/consulta.entity';
import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { NivelCursoType, NivelCursoEnum } from '../../common/const/const';

@Entity('curso')
export class Curso extends EntidadBasica {
  @Column({ type: 'enum', enum: NivelCursoEnum, nullable: false })
  nivel: NivelCursoType;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nombre: string;

  // Relaciones

  @OneToMany(() => Consulta, (consulta) => consulta.curso)
  consultas: Consulta[];

  @OneToMany(() => Taller, (taller) => taller.curso)
  talleres: Taller[];
}
