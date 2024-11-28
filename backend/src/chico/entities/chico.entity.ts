import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Consulta } from '../../consulta/entities/consulta.entity';
import { Barrio } from '../../barrio/entities/barrio.entity';
import { EntidadBasica } from '../../database/entities/EntidadBasica';

export type sexoType = 'Femenino' | 'Masculino' | 'Otro';

@Entity({ name: 'chico' })
export class Chico extends EntidadBasica {
  @Column({ type: 'int', nullable: false, unique: true })
  dni: number;

  // Datos chico

  @Column({ type: 'varchar', length: 50, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  apellido: string;

  @Column({ type: 'enum', enum: ['Femenino', 'Masculino', 'Otro'], nullable: false })
  sexo: sexoType;

  @Column({ type: 'date', nullable: false })
  fe_nacimiento: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: null })
  nombre_madre: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: null })
  nombre_padre: string;

  // RELACIONES

  @ManyToOne(() => Barrio, (barrio) => barrio.chicos)
  @JoinColumn({ name: 'id_barrio' })
  barrio: Barrio;

  @OneToMany(() => Consulta, (consulta) => consulta.chico)
  consultas: Consulta[];
}
