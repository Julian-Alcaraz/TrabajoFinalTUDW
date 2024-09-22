import { Entity, Column, OneToMany } from 'typeorm';

import { EntidadBasica } from '../../database/EntidadBasica';
import { UsuarioRol } from '../../usuario-rol/entities/usuario-rol.entity';

@Entity({ name: 'usuarios' })
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

  @OneToMany(() => UsuarioRol, (usuario_rol) => usuario_rol.usuario)
  usuario_roles: UsuarioRol[];
}
