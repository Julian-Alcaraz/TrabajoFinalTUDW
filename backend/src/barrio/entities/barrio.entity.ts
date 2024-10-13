import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Chico } from '../../chico/entities/chico.entity';
import { Localidad } from '../../localidad/entities/localidad.entity';

@Entity({ name: 'barrios' })
export class Barrio extends EntidadBasica {
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  // Relaciones

  @ManyToOne(() => Localidad, (localidad) => localidad.barrios)
  @JoinColumn({ name: 'id_localidad' })
  localidad: Localidad;

  @OneToMany(() => Chico, (chico) => chico.barrio)
  chicos: Chico[];
}
