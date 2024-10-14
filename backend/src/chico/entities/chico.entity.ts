import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Consulta } from '../../consulta/entities/consulta.entity';
import { Barrio } from '../../barrio/entities/barrio.entity';
import { EntidadBasica } from '../../database/entities/EntidadBasica';

export type sexoType = 'Femenino' | 'Masculino' | 'Otro';

@Entity({ name: 'chicos' })
export class Chico extends EntidadBasica {
  @Column({ type: 'int', nullable: false, unique: true })
  dni: number;
  // datos niño
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  apellido: string;

  @Column({ type: 'enum', enum: ['Femenino', 'Masculino', 'Otro'], nullable: false })
  sexo: sexoType;

  @Column({ type: 'date', nullable: false })
  fe_nacimiento: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre_madre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre_padre: string;
  // no pondria turno

  // RELACIONES

  @ManyToOne(() => Barrio, (barrio) => barrio.chicos)
  @JoinColumn({ name: 'id_barrio' })
  barrio: Barrio;

  @OneToMany(() => Consulta, (consulta) => consulta.chico)
  consultas: Consulta[];
}
