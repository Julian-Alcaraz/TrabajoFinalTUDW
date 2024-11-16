import { Column, Entity, OneToMany } from 'typeorm';

import { Consulta } from '../../consulta/entities/consulta.entity';
import { EntidadBasica } from '../../database/entities/EntidadBasica';

export type tiposInstitucion = 'Jardin' | 'Primario' | 'Secundario' | 'Terciario';

@Entity()
export class Institucion extends EntidadBasica {
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @Column({ type: 'enum', enum: ['Jardin', 'Primario', 'Secundario', 'Terciario'], nullable: false })
  tipo: tiposInstitucion;

  @OneToMany(() => Consulta, (consulta) => consulta.institucion)
  consultas: Consulta[];
}
