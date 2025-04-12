import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Curso } from '../../curso/entities/curso.entity';
import { Institucion } from '../../institucion/entities/institucion.entity';
import { Especialidad } from '../../especialidad/entities/especialidad.entity';
import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { DuracionEnum, DuracionType, DestinatariosEnum, DestinatariosType, TurnoTalleresEnum, TurnoTalleresType, ConjuntoConEnum, ConjuntoConType } from '../../common/const/const';

@Entity({ name: 'taller' })
export class Taller extends EntidadBasica {
  @Column({ type: 'boolean' })
  esTaller: boolean;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'date' }) // !!!!
  fecha: Date;

  @Column({ type: 'int' })
  cantEncuentros: number;

  @Column({ type: 'enum', enum: DuracionEnum })
  duracion: DuracionType;

  @Column({ type: 'int' })
  cantParticipantes: number;

  @Column({ type: 'enum', enum: DestinatariosEnum })
  destinatarios: DestinatariosType;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  observaciones: string;

  @Column({ type: 'varchar', length: 100 })
  recursos: string;

  @Column({ type: 'enum', enum: TurnoTalleresEnum })
  turno: TurnoTalleresType;

  @Column({ type: 'enum', enum: ConjuntoConEnum })
  conjuntoCon: ConjuntoConType;

  @Column({ type: 'varchar', length: 50 })
  frecuencia: string;

  // Relaciones

  @ManyToOne(() => Institucion, (institucion) => institucion.talleres)
  @JoinColumn({ name: 'id_institucion' })
  institucion: Institucion;

  @ManyToOne(() => Curso, (curso) => curso.talleres)
  @JoinColumn({ name: 'id_curso' })
  curso: Curso;

  @ManyToOne(() => Especialidad, (especialidad) => especialidad.talleres)
  @JoinColumn({ name: 'id_especialidad' })
  especialidad: Especialidad;
}
