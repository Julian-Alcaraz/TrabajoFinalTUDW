import { Column, Entity, OneToMany } from 'typeorm';

import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Taller } from '../../taller/entities/taller.entity';
import { Marco } from '../../marco/entities/marco.entity';
import { EspecialidadType, EspecialidadEnum } from '../../common/const/const';

@Entity({ name: 'especialidad' })
export class Especialidad extends EntidadBasica {
  @Column({ type: 'enum', enum: EspecialidadEnum })
  nombre: EspecialidadType;

  // Relaciones

  @OneToMany(() => Taller, (taller) => taller.especialidad)
  talleres: Taller[];

  @OneToMany(() => Marco, (marco) => marco.especialidad)
  marcos: Marco[];
}
