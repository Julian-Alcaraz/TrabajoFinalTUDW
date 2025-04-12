import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Especialidad } from '../../especialidad/entities/especialidad.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'marco' })
export class Marco extends EntidadBasica {
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  // Relaciones

  @ManyToOne(() => Especialidad, (especialidad) => especialidad.marcos)
  @JoinColumn({ name: 'id_especialidad' })
  especialidad: Especialidad;
}
