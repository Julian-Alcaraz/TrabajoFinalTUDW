import { Column, Entity, OneToMany } from 'typeorm';

import { Consulta } from '../../consulta/entities/consulta.entity';
import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { TipoInstitucionType, TipoInstitucionEnum } from '../../common/const/const';

@Entity()
export class Institucion extends EntidadBasica {
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @Column({ type: 'enum', enum: TipoInstitucionEnum, nullable: false })
  tipo: TipoInstitucionType;

  @OneToMany(() => Consulta, (consulta) => consulta.institucion)
  consultas: Consulta[];
}
