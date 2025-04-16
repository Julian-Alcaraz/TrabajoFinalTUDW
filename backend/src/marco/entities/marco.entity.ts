import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Taller } from './../../taller/entities/taller.entity';
import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Especialidad } from '../../especialidad/entities/especialidad.entity';

@Entity({ name: 'marco' })
export class Marco extends EntidadBasica {
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  // Relaciones

  @ManyToOne(() => Especialidad, (especialidad) => especialidad.marcos)
  @JoinColumn({ name: 'id_especialidad' })
  especialidad: Especialidad;

  @OneToMany(() => Taller, (taller) => taller.marco)
  talleres: Taller;
}
