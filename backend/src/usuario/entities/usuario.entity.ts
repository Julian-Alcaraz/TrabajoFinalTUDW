import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';

import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Rol } from '../../rol/entities/rol.entity';
import { Consulta } from '../../consulta/entities/consulta.entity';

@Entity({ name: 'usuario' })
export class Usuario extends EntidadBasica {
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'int', unique: true })
  dni: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  contrasenia: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  especialidad: string;

  @Column({ type: 'date' })
  fe_nacimiento: Date;

  // Relaciones

  @ManyToMany(() => Rol, (rol) => rol.usuarios)
  @JoinTable({
    name: 'usuario-rol',
    joinColumn: {
      name: 'id_usuario',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'id_rol',
      referencedColumnName: 'id',
    },
  })
  roles: Rol[];

  @OneToMany(() => Consulta, (consulta) => consulta.usuario)
  consultas: Consulta[];

  cambioContrasenia: boolean;
}
