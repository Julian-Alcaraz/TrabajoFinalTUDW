import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Social } from '../../consulta/entities/social.entity';

@Entity({ name: 'categoria' })
export class Categoria extends EntidadBasica {
  @Column({ type: 'varchar', length: 50, nullable: false })
  nombre: string;

  // Relaciones

  @ManyToMany(() => Social, (social) => social.categorias)
  consultas: Social[];
}
