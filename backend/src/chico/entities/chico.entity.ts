import { Consulta } from '../../consulta/entities/consulta.entity';
import { Barrio } from '../../barrio/entities/barrio.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EntidadBasica } from '../../database/entities/EntidadBasica';

export type sexoType = 'Femenino' | 'Masculino' | 'Otro';

@Entity()
export class Chico extends EntidadBasica {
  @Column({ type: 'int', nullable: false, unique: true })
  dni: number;
  // datos niño
  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellido: string;

  @Column({ type: 'enum', enum: ['Femenino', 'Masculino', 'Otro'], nullable: true })
  sexo: sexoType;

  @Column({ type: 'date', nullable: true })
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
  barrio: Barrio;

  @OneToMany(() => Consulta, (consulta) => consulta.chico)
  consulta: Consulta[];
}
