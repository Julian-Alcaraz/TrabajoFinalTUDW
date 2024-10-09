import { Consulta } from '../../consulta/entities/consulta.entity';
import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Column, Entity, OneToOne } from 'typeorm';
export type tiposInstitucion = 'Jardin' | 'Primario' | 'Secundario' | 'Terciario';

@Entity()
export class Institucion extends EntidadBasica {
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @Column({ type: 'enum', enum: ['Jardin', 'Primario', 'Secundario', 'Terciario'], nullable: false })
  tipo: tiposInstitucion;

  @OneToOne(() => Consulta)
  consulta: Consulta;
}
