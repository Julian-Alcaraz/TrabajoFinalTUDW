import { Barrio } from '../../barrio/entities/barrio.entity';
import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Localidad extends EntidadBasica {
  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @OneToMany(() => Barrio, (barrio) => barrio.localidad)
  barrios: Barrio[];
}
