import { Chico } from '../../chico/entities/chico.entity';
import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Localidad } from '../../localidad/entities/localidad.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
@Entity()
export class Barrio extends EntidadBasica {
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  // RELACIONES
  @ManyToOne(() => Localidad, (localidad) => localidad.barrios)
  localidad: Localidad;

  @OneToMany(() => Chico, (chico) => chico.barrio)
  chicos: Chico[];
}
